import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import type { ReactNode } from 'react';

// Inline tab icon components — no emoji, SVG paths via Text unicode shapes are not ideal.
// Using simple geometric indicators as placeholders. In production, use expo-symbols or
// a custom SVG icon set.

function TabIcon({ focused, label }: { focused: boolean; label: string }): ReactNode {
  return (
    <View style={styles.tabIconWrapper}>
      <View style={[styles.tabDot, focused && styles.tabDotActive]} />
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{label}</Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} label="Today" />,
        }}
      />
      <Tabs.Screen
        name="record"
        options={{
          title: 'Record',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} label="Record" />,
        }}
      />
      <Tabs.Screen
        name="players"
        options={{
          title: 'Players',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} label="Players" />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} label="Settings" />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#0C1117',
    borderTopWidth: 1,
    borderTopColor: '#2A3A4A',
    height: 72,
    paddingBottom: 8,
  },
  tabIconWrapper: {
    alignItems: 'center',
    gap: 4,
    paddingTop: 8,
  },
  tabDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#5E6E7E',
  },
  tabDotActive: {
    backgroundColor: '#10B981',
    width: 20,
    borderRadius: 2,
  },
  tabLabel: {
    fontFamily: 'DMSans',
    fontSize: 10,
    color: '#5E6E7E',
    fontWeight: '500',
  },
  tabLabelActive: {
    color: '#10B981',
    fontWeight: '700',
  },
});
