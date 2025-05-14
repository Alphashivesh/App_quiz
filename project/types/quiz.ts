export interface Question {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  date: string;
}

export interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  selectedAnswer: string | null;
  timeLeft: number;
  isAnswered: boolean;
  quizComplete: boolean;
}