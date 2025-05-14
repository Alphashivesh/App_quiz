import { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Brain, ChartBar as BarChart3, Clock, BrainCircuit } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { quizCategories } from '@/constants/quizCategories';

const { width } = Dimensions.get('window');
const isWideScreen = width > 768;

export default function HomeScreen() {
  const startQuiz = useCallback((category: string, difficulty: string) => {
    router.push({
      pathname: '/(tabs)/quiz',
      params: { category, difficulty }
    });
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.appName}>QuizMaster</Text>
          <Text style={styles.subTitle}>Test your knowledge with fun quizzes!</Text>
        </View>

        <View style={styles.statsContainer}>
          <LinearGradient
            colors={['#8A2BE2', '#9370DB']}
            style={styles.statsCard}>
            <Brain color="#fff" size={24} />
            <Text style={styles.statsValue}>150+</Text>
            <Text style={styles.statsLabel}>Questions</Text>
          </LinearGradient>

          <LinearGradient
            colors={['#20B2AA', '#48D1CC']}
            style={styles.statsCard}>
            <BarChart3 color="#fff" size={24} />
            <Text style={styles.statsValue}>10+</Text>
            <Text style={styles.statsLabel}>Categories</Text>
          </LinearGradient>

          <LinearGradient
            colors={['#FF7F50', '#FF6347']}
            style={styles.statsCard}>
            <Clock color="#fff" size={24} />
            <Text style={styles.statsValue}>30s</Text>
            <Text style={styles.statsLabel}>Per Question</Text>
          </LinearGradient>
        </View>

        <View style={styles.featuredSection}>
          <View style={styles.sectionHeader}>
            <BrainCircuit color="#8A2BE2" size={20} />
            <Text style={styles.sectionTitle}>Featured Categories</Text>
          </View>
          
          <View style={styles.categoriesContainer}>
            {quizCategories.map((category, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.categoryCard, isWideScreen && styles.wideCategory]}
                onPress={() => startQuiz(category.id, 'medium')}>
                <Image
                  source={{ uri: category.imageUrl }}
                  style={styles.categoryImage}
                />
                <View style={styles.categoryContent}>
                  <Text style={styles.categoryTitle}>{category.name}</Text>
                  <TouchableOpacity
                    style={styles.startButton}
                    onPress={() => startQuiz(category.id, 'medium')}>
                    <Text style={styles.startButtonText}>Start</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.difficultySection}>
          <Text style={styles.sectionTitle}>Select Difficulty</Text>
          <View style={styles.difficultyOptions}>
            <TouchableOpacity
              style={[styles.difficultyCard, styles.easyDifficulty]}
              onPress={() => startQuiz('any', 'easy')}>
              <Text style={styles.difficultyText}>Easy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.difficultyCard, styles.mediumDifficulty]}
              onPress={() => startQuiz('any', 'medium')}>
              <Text style={styles.difficultyText}>Medium</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.difficultyCard, styles.hardDifficulty]}
              onPress={() => startQuiz('any', 'hard')}>
              <Text style={styles.difficultyText}>Hard</Text>
            </TouchableOpacity>
          </View>
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  appName: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: '#1e293b',
  },
  subTitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#64748b',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  statsCard: {
    width: '30%',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#fff',
    marginTop: 8,
  },
  statsLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#fff',
    marginTop: 2,
  },
  featuredSection: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#1e293b',
    marginLeft: 8,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  wideCategory: {
    width: '31%',
  },
  categoryImage: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
  },
  categoryContent: {
    padding: 12,
  },
  categoryTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#1e293b',
    marginBottom: 8,
  },
  startButton: {
    backgroundColor: '#8A2BE2',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  startButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#fff',
  },
  difficultySection: {
    marginTop: 20,
    paddingHorizontal: 20,
    marginBottom: 100,
  },
  difficultyOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  difficultyCard: {
    width: '30%',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  easyDifficulty: {
    backgroundColor: '#10b981',
  },
  mediumDifficulty: {
    backgroundColor: '#f59e0b',
  },
  hardDifficulty: {
    backgroundColor: '#ef4444',
  },
  difficultyText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#fff',
  },
});