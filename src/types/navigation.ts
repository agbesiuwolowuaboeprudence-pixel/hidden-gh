import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { Guide, TouristSite } from './index';

export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Main: { screen?: keyof MainTabParamList; params?: object } | undefined;
  SiteDetail: { site: TouristSite };
  GuideDetail: { guide: Guide };
  Notifications: undefined;
  EditProfile: undefined;
  Premium: undefined;
  Hotels: undefined;
  HelpSupport: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Explore: { segment?: 'sites' | 'map' | 'guides' } | undefined;
  Trips: undefined;
  Profile: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type MainTabScreenProps<T extends keyof MainTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, T>,
    NativeStackScreenProps<RootStackParamList>
  >;
