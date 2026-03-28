import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DaySummary } from '../types';
import { COLORS, SP, FS, RADIUS } from '../constants/theme';

interface HeatMapProps {
  data: DaySummary[];
  columns?: number;
}

function getCellColor(rate: number): string {
  if (rate === 0) return COLORS.bgCard;
  if (rate < 0.25) return 'rgba(124, 92, 252, 0.15)';
  if (rate < 0.5) return 'rgba(124, 92, 252, 0.3)';
  if (rate < 0.75) return 'rgba(124, 92, 252, 0.5)';
  if (rate < 1) return 'rgba(124, 92, 252, 0.7)';
  return '#7C5CFC'; // Perfect day = full color
}

export function HeatMap({ data, columns = 7 }: HeatMapProps) {
  // Chunk into weeks
  const weeks: DaySummary[][] = [];
  for (let i = 0; i < data.length; i += columns) {
    weeks.push(data.slice(i, i + columns));
  }

  return (
    <View style={styles.container}>
      <View style={styles.legend}>
        <Text style={styles.legendLabel}>Less</Text>
        {[0, 0.25, 0.5, 0.75, 1].map((rate, i) => (
          <View key={i} style={[styles.legendCell, { backgroundColor: getCellColor(rate) }]} />
        ))}
        <Text style={styles.legendLabel}>More</Text>
      </View>
      <View style={styles.grid}>
        {weeks.map((week, wi) => (
          <View key={wi} style={styles.week}>
            {week.map((day, di) => (
              <View
                key={di}
                style={[
                  styles.cell,
                  { backgroundColor: getCellColor(day.completionRate) },
                  day.isPerfect && styles.perfectCell,
                ]}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  grid: { flexDirection: 'column', gap: 3 },
  week: { flexDirection: 'row', gap: 3 },
  cell: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 4,
    maxWidth: 18,
    maxHeight: 18,
  },
  perfectCell: {
    borderWidth: 1,
    borderColor: 'rgba(124, 92, 252, 0.5)',
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    marginBottom: SP.sm,
  },
  legendCell: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
  legendLabel: {
    color: COLORS.textMuted,
    fontSize: 9,
    marginHorizontal: SP.xs,
  },
});
