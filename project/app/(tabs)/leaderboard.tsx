import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { Medal, Trophy, Award } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getLeaderboard, saveScore } from '@/services/leaderboardService';
import { LeaderboardEntry } from '@/types/quiz';
import LeaderboardItem from '@/components/LeaderboardItem';

const { width } = Dimensions.get('window');
const isWideScreen = width > 768;

export default function LeaderboardScreen() {
  const { score: newScore } = useLocalSearchParams();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userName, setUserName] = useState('You');
  const [showUserPrompt, setShowUserPrompt] = useState(false);

  useEffect(() => {
    // Load leaderboard data
    const boardData = getLeaderboard();
    setLeaderboard(boardData);

    // If there's a new score from the quiz, add it to the leaderboard
    if (newScore) {
      const scoreNum = parseInt(newScore as string, 10);
      
      if (!isNaN(scoreNum)) {
        const newEntry: LeaderboardEntry = {
          id: Date.now().toString(),
          name: userName,
          score: scoreNum,
          date: new Date().toISOString(),
        };
        
        // Add to leaderboard and save
        const updatedLeaderboard = [...boardData, newEntry].sort((a, b) => b.score - a.score);
        saveScore(newEntry);
        setLeaderboard(updatedLeaderboard);
      }
    }
  }, [newScore, userName]);

  // Calculate user's position in the leaderboard
  const getUserRank = () => {
    if (!newScore) return null;
    
    const scoreNum = parseInt(newScore as string, 10);
    if (isNaN(scoreNum)) return null;
    
    const rank = leaderboard.findIndex(entry => entry.score < scoreNum) + 1;
    return rank === 0 ? leaderboard.length + 1 : rank;
  };

  const userRank = getUserRank();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Leaderboard</Text>
        <Text style={styles.subtitle}>See how you rank against other players</Text>
      </View>

      {newScore && (
        <View style={styles.yourScoreContainer}>
          <LinearGradient
            colors={['#8A2BE2', '#9370DB']}
            style={styles.yourScoreCard}>
            <View style={styles.yourScoreHeader}>
              <Trophy color="#fff" size={24} />
              <Text style={styles.yourScoreTitle}>Your Result</Text>
            </View>
            <View style={styles.scoreDetails}>
              <View style={styles.scoreItem}>
                <Text style={styles.scoreItemLabel}>Score</Text>
                <Text style={styles.scoreItemValue}>{newScore}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.scoreItem}>
                <Text style={styles.scoreItemLabel}>Rank</Text>
                <Text style={styles.scoreItemValue}>#{userRank || '-'}</Text>
              </View>
            </View>
          </LinearGradient>
        </View>
      )}

      <View style={styles.topThreeContainer}>
        {leaderboard.slice(0, 3).map((entry, index) => (
          <View key={entry.id} style={[
            styles.topThreeItem,
            index === 0 ? styles.firstPlace : null,
            index === 1 ? styles.secondPlace : null,
            index === 2 ? styles.thirdPlace : null,
          ]}>
            {index === 0 && <Medal color="#FFD700" size={24} />}
            {index === 1 && <Medal color="#C0C0C0" size={24} />}
            {index === 2 && <Medal color="#CD7F32" size={24} />}
            <Text style={styles.topThreeName}>{entry.name}</Text>
            <Text style={styles.topThreeScore}>{entry.score}</Text>
          </View>
        ))}
      </View>

      <View style={styles.leaderboardContainer}>
        <View style={styles.leaderboardHeader}>
          <Award color="#8A2BE2" size={20} />
          <Text style={styles.leaderboardTitle}>All Players</Text>
        </View>
        
        <FlatList
          data={leaderboard}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <LeaderboardItem entry={item} rank={index + 1} />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No scores yet. Be the first to set a high score!</Text>
            </View>
          }
        />
      </View>
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
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: '#1e293b',
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#64748b',
    marginTop: 4,
  },
  yourScoreContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  yourScoreCard: {
    borderRadius: 12,
    padding: 16,
  },
  yourScoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  yourScoreTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#fff',
    marginLeft: 8,
  },
  scoreDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  scoreItem: {
    alignItems: 'center',
  },
  scoreItemLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  scoreItemValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#fff',
    marginTop: 4,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#fff',
    opacity: 0.3,
  },
  topThreeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  topThreeItem: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    width: isWideScreen ? '30%' : '30%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  firstPlace: {
    borderColor: '#FFD700',
    borderWidth: 2,
  },
  secondPlace: {
    borderColor: '#C0C0C0',
    borderWidth: 2,
  },
  thirdPlace: {
    borderColor: '#CD7F32',
    borderWidth: 2,
  },
  topThreeName: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#1e293b',
    marginTop: 8,
  },
  topThreeScore: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#8A2BE2',
    marginTop: 4,
  },
  leaderboardContainer: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 20,
  },
  leaderboardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  leaderboardTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#1e293b',
    marginLeft: 8,
  },
  listContent: {
    paddingBottom: 100,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
});