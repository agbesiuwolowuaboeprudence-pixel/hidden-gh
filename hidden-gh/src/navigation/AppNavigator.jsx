import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from '../screens/HomeScreen';
import ExploreScreen from '../screens/ExploreScreen';

// ─── PLACEHOLDER SCREENS ─────────────────────────────────────────────────────



function ScanScreen() {
  return (
    <View style={ph.container}>
      <Text style={ph.icon}>📷</Text>
      <Text style={ph.title}>Scan</Text>
      <Text style={ph.sub}>Coming soon</Text>
    </View>
  );
}

function BookingsScreen() {
  return (
    <View style={ph.container}>
      <Text style={ph.icon}>🏨</Text>
      <Text style={ph.title}>Bookings</Text>
      <Text style={ph.sub}>Coming soon</Text>
    </View>
  );
}

function ProfileScreen() {
  return (
    <View style={ph.container}>
      <Text style={ph.icon}>👤</Text>
      <Text style={ph.title}>Profile</Text>
      <Text style={ph.sub}>Coming soon</Text>
    </View>
  );
}

// ─── TAB ICONS ───────────────────────────────────────────────────────────────

function TabIcon({ emoji, label, focused }) {
  return (
    <View style={tb.wrap}>
      <Text style={[tb.emoji, focused && tb.emojiFocused]}>{emoji}</Text>
      <Text style={[tb.label, focused && tb.labelFocused]}>{label}</Text>
    </View>
  );
}

function ScanTabIcon({ focused }) {
  return (
    <View style={tb.scanOuter}>
      <View style={[tb.scanInner, focused && tb.scanFocused]}>
        <Text style={tb.scanEmoji}>📷</Text>
      </View>
    </View>
  );
}

// ─── NAVIGATOR ───────────────────────────────────────────────────────────────

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarStyle: {
              backgroundColor: '#FFFFFF',
              borderTopColor: '#E8E8E8',
              borderTopWidth: 0.5,
              height: 70,
              paddingBottom: 10,
              paddingTop: 6,
            },
          }}
        >
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              tabBarIcon: ({ focused }) => (
                <TabIcon emoji="🏠" label="Home" focused={focused} />
              ),
            }}
          />
          <Tab.Screen
            name="Explore"
            component={ExploreScreen}
            options={{
              tabBarIcon: ({ focused }) => (
                <TabIcon emoji="🔍" label="Explore" focused={focused} />
              ),
            }}
          />
          <Tab.Screen
            name="Scan"
            component={ScanScreen}
            options={{
              tabBarIcon: ({ focused }) => (
                <ScanTabIcon focused={focused} />
              ),
            }}
          />
          <Tab.Screen
            name="Bookings"
            component={BookingsScreen}
            options={{
              tabBarIcon: ({ focused }) => (
                <TabIcon emoji="🏨" label="Bookings" focused={focused} />
              ),
            }}
          />
          <Tab.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              tabBarIcon: ({ focused }) => (
                <TabIcon emoji="👤" label="Profile" focused={focused} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────

const tb = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  emoji: {
    fontSize: 22,
    opacity: 0.4,
  },
  emojiFocused: {
    opacity: 1,
  },
  label: {
    fontSize: 10,
    color: '#A0A0A0',
    fontWeight: '500',
  },
  labelFocused: {
    color: '#1B5E3B',
    fontWeight: '700',
  },
  scanOuter: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  scanInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1B5E3B',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
  },
  scanFocused: {
    backgroundColor: '#F5A623',
  },
  scanEmoji: {
    fontSize: 24,
  },
});

const ph = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F7F2',
    gap: 10,
  },
  icon: {
    fontSize: 48,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  sub: {
    fontSize: 14,
    color: '#A0A0A0',
  },
});