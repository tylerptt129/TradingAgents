import React from 'react';
import { Tabs } from 'expo-router';
import { Text, View, StyleSheet } from 'react-native';
import { COLORS, SP } from '../../src/constants/theme';

function TabIcon({ icon, label, focused }: { icon: string; label: string; focused: boolean }) {
  return (
    <View style={styles.tabItem}>
      <Text style={[styles.tabIcon, focused && styles.tabIconActive]}>{icon}</Text>
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{label}</Text>
      {focused && <View style={styles.indicator} />}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="🎯" label="Today" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="📊" label="Stats" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="badges"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="🏆" label="Badges" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="⚙️" label="Profile" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.bgElevated,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    height: 85,
    paddingTop: SP.sm,
    paddingBottom: SP.lg,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },
  tabIcon: { fontSize: 22, opacity: 0.5 },
  tabIconActive: { opacity: 1 },
  tabLabel: { fontSize: 10, color: COLORS.textMuted, marginTop: 2, fontWeight: '500' },
  tabLabelActive: { color: COLORS.primary, fontWeight: '700' },
  indicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
    marginTop: 3,
  },
});
