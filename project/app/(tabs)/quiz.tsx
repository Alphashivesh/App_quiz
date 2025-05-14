import { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Clock, ArrowLeft, CircleHelp as HelpCircle } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { fetchQuizQuestions } from '@/services/apiService';
import { decodeHtml } from '@/utils/helpers';
import { Question } from '@/types/quiz';

const { width } = Dimensions.get('window');
const isWideScreen = width > 768;

const TIMER_DURATION = 30;

export default function QuizScreen() {
  const { category = 'any', difficulty = 'medium' } = useLocalSearchParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [loading, setLoading] = useState(true);
  const [quizComplete, setQuizComplete] = useState(false);
  
  // Store randomized answers for each question
  const [randomizedAnswers, setRandomizedAnswers] = useState<string[][]>([]);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const loadedQuestions = await fetchQuizQuestions(
          category as string,
          difficulty as string,
          10
        );
        setQuestions(loadedQuestions);
        
        // Pre-randomize answers for all questions
        const randomized = loadedQuestions.map(question => {
          return [...question.incorrect_answers, question.correct_answer]
            .sort(() => Math.random() - 0.5);
        });
        setRandomizedAnswers(randomized);
        
        setLoading(false);
      } catch (error) {
        console.error('Failed to load questions:', error);
        setLoading(false);
      }
    };

    loadQuestions();
  }, [category, difficulty]);

  useEffect(() => {
    if (loading || quizComplete) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (!isAnswered) {
            handleAnswerSelection('');
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex, loading, isAnswered, quizComplete]);

  const handleAnswerSelection = useCallback((answer: string) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answer);
    setIsAnswered(true);

    const currentQuestion = questions[currentQuestionIndex];
    if (answer === currentQuestion.correct_answer) {
      setScore((prev) => prev + 10);
    } else {
      setScore((prev) => Math.max(0, prev - 5));
    }

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedAnswer(null);
        setIsAnswered(false);
        setTimeLeft(TIMER_DURATION);
      } else {
        setQuizComplete(true);
      }
    }, 1500);
  }, [currentQuestionIndex, isAnswered, questions]);

  const startNewQuiz = useCallback(() => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setTimeLeft(TIMER_DURATION);
    setQuizComplete(false);
    setLoading(true);
    
    // Fetch new questions
    fetchQuizQuestions(category as string, difficulty as string, 10)
      .then(loadedQuestions => {
        setQuestions(loadedQuestions);
        // Pre-randomize answers for all questions
        const randomized = loadedQuestions.map(question => {
          return [...question.incorrect_answers, question.correct_answer]
            .sort(() => Math.random() - 0.5);
        });
        setRandomizedAnswers(randomized);
        setLoading(false);
      })
      .catch(error => {
        console.error('Failed to load questions:', error);
        setLoading(false);
      });
  }, [category, difficulty]);

  const handleFinishQuiz = useCallback(() => {
    router.navigate({
      pathname: '/(tabs)/leaderboard',
      params: { score: score.toString() }
    });
  }, [score]);

  const goBack = useCallback(() => {
    router.back();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer} edges={['top']}>
        <ActivityIndicator size="large" color="#8A2BE2" />
        <Text style={styles.loadingText}>Loading questions...</Text>
      </SafeAreaView>
    );
  }

  if (quizComplete) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Animated.View 
          entering={FadeIn.duration(500)}
          style={styles.resultsContainer}>
          <View style={styles.scoreCircle}>
            <Text style={styles.finalScoreText}>{score}</Text>
          </View>
          <Text style={styles.completeTitle}>Quiz Complete!</Text>
          <Text style={styles.completeSubtitle}>
            {score >= 80 ? 'Excellent! You\'re a quiz master!' : 
             score >= 50 ? 'Good job! Keep practicing!' : 
             'Don\'t worry, you\'ll do better next time!'}
          </Text>
          
          <TouchableOpacity style={styles.finishButton} onPress={handleFinishQuiz}>
            <Text style={styles.finishButtonText}>See Leaderboard</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.retryButton} onPress={startNewQuiz}>
            <Text style={styles.retryButtonText}>Try Another Quiz</Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;
  
  // Use pre-randomized answers for the current question
  const allAnswers = randomizedAnswers[currentQuestionIndex] || [];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <ArrowLeft color="#1e293b" size={24} />
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {currentQuestionIndex + 1}/{questions.length}
          </Text>
        </View>
        <View style={styles.timerContainer}>
          <Clock color="#1e293b" size={20} />
          <Text style={styles.timerText}>{timeLeft}s</Text>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.questionContainer}>
          <View style={styles.questionHeader}>
            <HelpCircle color="#8A2BE2" size={24} />
            <Text style={styles.questionNumber}>Question {currentQuestionIndex + 1}</Text>
          </View>
          <Text style={styles.questionText}>
            {decodeHtml(currentQuestion.question)}
          </Text>
          <Text style={styles.categoryText}>
            {currentQuestion.category} • {currentQuestion.difficulty.charAt(0).toUpperCase() + currentQuestion.difficulty.slice(1)}
          </Text>
        </View>

        <View style={styles.answersContainer}>
          {allAnswers.map((answer, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.answerCard,
                isWideScreen && styles.wideAnswerCard,
                selectedAnswer === answer && answer === currentQuestion.correct_answer && styles.correctAnswer,
                selectedAnswer === answer && answer !== currentQuestion.correct_answer && styles.wrongAnswer,
                isAnswered && answer === currentQuestion.correct_answer && styles.correctAnswer,
              ]}
              disabled={isAnswered}
              onPress={() => handleAnswerSelection(answer)}>
              <Text 
                style={[
                  styles.answerText,
                  (selectedAnswer === answer && answer === currentQuestion.correct_answer) || 
                  (isAnswered && answer === currentQuestion.correct_answer) ? styles.selectedAnswerText : null,
                  selectedAnswer === answer && answer !== currentQuestion.correct_answer ? styles.selectedAnswerText : null,
                ]}>
                {decodeHtml(answer)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>Current Score</Text>
          <Text style={styles.scoreValue}>{score}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#64748b',
    marginTop: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  backButton: {
    padding: 8,
  },
  progressContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8A2BE2',
    borderRadius: 4,
  },
  progressText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
    textAlign: 'center',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  timerText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#1e293b',
    marginLeft: 4,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  questionContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  questionNumber: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#8A2BE2',
    marginLeft: 8,
  },
  questionText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    color: '#1e293b',
    lineHeight: 28,
  },
  categoryText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#64748b',
    marginTop: 12,
  },
  answersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  answerCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  wideAnswerCard: {
    width: '48%',
  },
  correctAnswer: {
    backgroundColor: '#dcfce7',
    borderColor: '#10b981',
  },
  wrongAnswer: {
    backgroundColor: '#fee2e2',
    borderColor: '#ef4444',
  },
  answerText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#1e293b',
  },
  selectedAnswerText: {
    color: '#1e293b',
    fontFamily: 'Poppins-Medium',
  },
  scoreContainer: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  scoreLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#64748b',
  },
  scoreValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
    color: '#8A2BE2',
    marginTop: 4,
  },
  resultsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  scoreCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#8A2BE2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  finalScoreText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 48,
    color: '#fff',
  },
  completeTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: '#1e293b',
    marginBottom: 12,
  },
  completeSubtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 32,
  },
  finishButton: {
    backgroundColor: '#8A2BE2',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
    marginBottom: 16,
  },
  finishButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#fff',
  },
  retryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#8A2BE2',
  },
  retryButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#8A2BE2',
  },
});