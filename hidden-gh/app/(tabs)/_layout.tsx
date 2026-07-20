import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { typography, useTheme, type Palette } from '@/src/theme';

type TabIconName = keyof typeof Ionicons.glyphMap;

function TabIcon({
  name,
  focusedName,
  label,
  focused,
}: {
  name: TabIconName;
  focusedName: TabIconName;
  label: string;
  focused: boolean;
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => createTabStyles(colors), [colors]);
  return (
    <View style={styles.wrap}>
      <Ionicons
        name={focused ? focusedName : name}
        size={22}
        color={focused ? colors.primary : colors.textMuted}
      />
      <Text style={[styles.label, focused && styles.labelFocused]}>{label}</Text>
    </View>
  );
}

export default function TabsLayout() {
  const { colors } = useTheme();
  const styles = useMemo(() => createTabStyles(colors), [colors]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.bar,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="home-outline" focusedName="home" label="Home" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name="compass-outline"
              focusedName="compass"
              label="Explore"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="trips"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name="calendar-outline"
              focusedName="calendar"
              label="Trips"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name="person-outline"
              focusedName="person"
              label="Profile"
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const createTabStyles = (c: Palette) =>
  StyleSheet.create({
    bar: {
      backgroundColor: c.surface,
      borderTopColor: c.border,
      borderTopWidth: StyleSheet.hairlineWidth,
      height: 72,
      paddingBottom: 10,
      paddingTop: 8,
    },
    wrap: {
      alignItems: 'center',
      justifyContent: 'center',
      gap: 3,
    },
    label: {
      ...typography.tab,
      color: c.textMuted,
    },
    labelFocused: {
      color: c.primary,
      fontWeight: '700',
    },
  });
