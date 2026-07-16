import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ThemeProvider, typography, useTheme, type Palette } from '../theme';
import type { MainTabParamList, RootStackParamList } from '../types/navigation';

import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import ExploreScreen from '../screens/ExploreScreen';
import TripsScreen from '../screens/TripsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SiteDetailScreen from '../screens/SiteDetailScreen';
import GuideDetailScreen from '../screens/GuideDetailScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import PremiumScreen from '../screens/PremiumScreen';
import HotelsScreen from '../screens/HotelsScreen';
import HelpSupportScreen from '../screens/HelpSupportScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

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

function MainTabs() {
  const { colors } = useTheme();
  const styles = useMemo(() => createTabStyles(colors), [colors]);
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.bar,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="home-outline" focusedName="home" label="Home" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
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
      <Tab.Screen
        name="Trips"
        component={TripsScreen}
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
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
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
    </Tab.Navigator>
  );
}

function Navigation() {
  const { colors, scheme } = useTheme();
  const navTheme = useMemo(() => {
    const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        background: colors.background,
        card: colors.surface,
        text: colors.textPrimary,
        border: colors.border,
        primary: colors.primary,
      },
    };
  }, [colors, scheme]);

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}
      >
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="SiteDetail" component={SiteDetailScreen} />
        <Stack.Screen name="GuideDetail" component={GuideDetailScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="Premium" component={PremiumScreen} />
        <Stack.Screen name="Hotels" component={HotelsScreen} />
        <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function AppNavigator() {
  return (
    <ThemeProvider initialScheme="dark">
      <SafeAreaProvider>
        <Navigation />
      </SafeAreaProvider>
    </ThemeProvider>
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
