import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatDate } from '@/utils/helpers';
import { LeaderboardEntry } from '@/types/quiz';

interface LeaderboardItemProps {
  entry: LeaderboardEntry;
  rank: number;
}

export default function LeaderboardItem({ entry, rank }: LeaderboardItemProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.rank}>#{rank}</Text>
      <View style={styles.details}>
        <Text style={styles.name}>{entry.name}</Text>
        <Text style={styles.date}>{formatDate(entry.date)}</Text>
      </View>
      <Text style={styles.score}>{entry.score}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 6,
    padding: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  rank: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#64748b',
    width: 40,
  },
  details: {
    flex: 1,
  },
  name: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#1e293b',
  },
  date: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  score: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#8A2BE2',
  },
});