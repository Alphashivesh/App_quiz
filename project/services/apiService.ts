import { Question } from '@/types/quiz';

// This API provides trivia questions with multiple options
const API_BASE_URL = 'https://opentdb.com/api.php';

export async function fetchQuizQuestions(
  category: string = 'any',
  difficulty: string = 'medium',
  amount: number = 10
): Promise<Question[]> {
  try {
    let url = `${API_BASE_URL}?amount=${amount}&type=multiple`;
    
    // Add category if specified (not 'any')
    if (category !== 'any') {
      url += `&category=${category}`;
    }
    
    // Add difficulty if specified
    if (difficulty !== 'any') {
      url += `&difficulty=${difficulty}`;
    }
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.response_code !== 0) {
      throw new Error('Failed to fetch questions');
    }
    
    return data.results;
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    // Return mock data in case of API failure
    return getMockQuestions(amount);
  }
}

// Mock data for testing or when API fails
function getMockQuestions(amount: number = 10): Question[] {
  const mockQuestions: Question[] = [
    {
      category: 'Science & Nature',
      type: 'multiple',
      difficulty: 'medium',
      question: 'What is the most abundant element in the Universe?',
      correct_answer: 'Hydrogen',
      incorrect_answers: ['Helium', 'Oxygen', 'Carbon']
    },
    {
      category: 'Entertainment: Film',
      type: 'multiple',
      difficulty: 'easy',
      question: 'Who directed the 1994 film &quot;Pulp Fiction&quot;?',
      correct_answer: 'Quentin Tarantino',
      incorrect_answers: ['Steven Spielberg', 'James Cameron', 'Stanley Kubrick']
    },
    {
      category: 'History',
      type: 'multiple',
      difficulty: 'hard',
      question: 'In which year did the First World War begin?',
      correct_answer: '1914',
      incorrect_answers: ['1916', '1912', '1918']
    },
    {
      category: 'Geography',
      type: 'multiple',
      difficulty: 'medium',
      question: 'What is the capital of Australia?',
      correct_answer: 'Canberra',
      incorrect_answers: ['Sydney', 'Melbourne', 'Perth']
    },
    {
      category: 'Sports',
      type: 'multiple',
      difficulty: 'easy',
      question: 'In which sport would you perform a slam dunk?',
      correct_answer: 'Basketball',
      incorrect_answers: ['Football', 'Tennis', 'Golf']
    },
    {
      category: 'Entertainment: Music',
      type: 'multiple',
      difficulty: 'medium',
      question: 'Which band released the album &quot;The Dark Side of the Moon&quot;?',
      correct_answer: 'Pink Floyd',
      incorrect_answers: ['The Beatles', 'Led Zeppelin', 'The Rolling Stones']
    },
    {
      category: 'Science: Computers',
      type: 'multiple',
      difficulty: 'hard',
      question: 'What does the acronym &quot;HTTP&quot; stand for?',
      correct_answer: 'Hypertext Transfer Protocol',
      incorrect_answers: [
        'Hypertext Transit Protocol',
        'Hypertext Tree Protocol',
        'Hypertext Transmission Procedure'
      ]
    },
    {
      category: 'Mythology',
      type: 'multiple',
      difficulty: 'easy',
      question: 'Who was the Greek god of the sea?',
      correct_answer: 'Poseidon',
      incorrect_answers: ['Zeus', 'Apollo', 'Hermes']
    },
    {
      category: 'Entertainment: Television',
      type: 'multiple',
      difficulty: 'medium',
      question: 'In the TV show &quot;Breaking Bad&quot;, what is the street name of Walter White&#039;s alter ego?',
      correct_answer: 'Heisenberg',
      incorrect_answers: ['Eisenberg', 'Hindenburg', 'Hitzenberg']
    },
    {
      category: 'General Knowledge',
      type: 'multiple',
      difficulty: 'easy',
      question: 'Which of these is NOT a primary color?',
      correct_answer: 'Green',
      incorrect_answers: ['Red', 'Blue', 'Yellow']
    }
  ];
  
  return mockQuestions.slice(0, amount);
}