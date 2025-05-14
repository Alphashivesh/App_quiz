import { LeaderboardEntry } from '@/types/quiz';

// Storage key for leaderboard data
const LEADERBOARD_KEY = 'quiz_leaderboard';

// Mock data for initial leaderboard
const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  {
    id: '1',
    name: 'John',
    score: 95,
    date: '2023-05-15T10:30:00Z',
  },
  {
    id: '2',
    name: 'Sarah',
    score: 85,
    date: '2023-05-16T14:45:00Z',
  },
  {
    id: '3',
    name: 'Michael',
    score: 75,
    date: '2023-05-17T09:15:00Z',
  },
  {
    id: '4',
    name: 'Emily',
    score: 70,
    date: '2023-05-18T16:20:00Z',
  },
  {
    id: '5',
    name: 'David',
    score: 65,
    date: '2023-05-19T11:10:00Z',
  },
];

/**
 * Get the current leaderboard data
 */
export function getLeaderboard(): LeaderboardEntry[] {
  // In a real app, this would use localStorage or AsyncStorage
  // For this demo, we're using mock data
  return INITIAL_LEADERBOARD;
}

/**
 * Save a new score to the leaderboard
 */
export function saveScore(entry: LeaderboardEntry): void {
  // In a real app, this would update localStorage or AsyncStorage
  // For this demo, we're just logging
  console.log('Saving score:', entry);
  
  // The actual implementation would look something like this:
  // const leaderboard = getLeaderboard();
  // const updatedLeaderboard = [...leaderboard, entry]
  //   .sort((a, b) => b.score - a.score)
  //   .slice(0, 100); // Keep only top 100 scores
  
  // localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(updatedLeaderboard));
}

/**
 * Clear all leaderboard data
 */
export function clearLeaderboard(): void {
  // In a real app, this would clear localStorage or AsyncStorage
  console.log('Clearing leaderboard');
  
  // localStorage.removeItem(LEADERBOARD_KEY);
}