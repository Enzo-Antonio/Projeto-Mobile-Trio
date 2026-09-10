import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Users, Trophy } from 'lucide-react-native';
import { colors, fontSize, fontWeight } from '../theme';
import HomeScreen from '../screens/HomeScreen';
import PlayerScreen from '../screens/PlayerScreen';
import PlayerFormScreen from '../screens/PlayerFormScreen';
import PlayerDetailsScreen from '../screens/PlayerDetailsScreen';
import LineupScreen from '../screens/LineupScreen';
import SavedLineupsScreen from '../screens/SavedLineupsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const stackOptions = {
  headerShown: false,
  contentStyle: { backgroundColor: colors.background },
  animation: 'slide_from_right',
};

const TAB_ICONS = {
  HomeTab: Home,
  PlayersTab: Users,
  LineupTab: Trophy,
};

const HomeStack = () => (
  <Stack.Navigator screenOptions={stackOptions}>
    <Stack.Screen name="Home" component={HomeScreen} />
  </Stack.Navigator>
);

const PlayersStack = () => (
  <Stack.Navigator screenOptions={stackOptions}>
    <Stack.Screen name="PlayersList" component={PlayerScreen} />
    <Stack.Screen name="PlayerForm" component={PlayerFormScreen} />
    <Stack.Screen name="PlayerDetails" component={PlayerDetailsScreen} />
  </Stack.Navigator>
);

const LineupStack = () => (
  <Stack.Navigator screenOptions={stackOptions}>
    <Stack.Screen name="SavedLineups" component={SavedLineupsScreen} />
    <Stack.Screen name="LineupBuilder" component={LineupScreen} />
  </Stack.Navigator>
);

const getTabOptions = ({ route }) => {
  const Icon = TAB_ICONS[route.name];
  return {
    headerShown: false,
    tabBarIcon: ({ color, size }) => (Icon ? <Icon size={size} color={color} /> : null),
    tabBarActiveTintColor: colors.primary,
    tabBarInactiveTintColor: colors.textMuted,
    tabBarStyle: {
      backgroundColor: colors.surface,
      borderTopColor: colors.border,
      borderTopWidth: 1,
      paddingBottom: 4,
      height: 60,
    },
    tabBarLabelStyle: {
      fontSize: fontSize.xs,
      fontWeight: fontWeight.semibold,
    },
  };
};

export default function AppNavigator() {
  return (
    <Tab.Navigator screenOptions={getTabOptions}>
      <Tab.Screen name="HomeTab" component={HomeStack} options={{ tabBarLabel: 'Início' }} />
      <Tab.Screen name="PlayersTab" component={PlayersStack} options={{ tabBarLabel: 'Jogadores' }} />
      <Tab.Screen name="LineupTab" component={LineupStack} options={{ tabBarLabel: 'Escalações' }} />
    </Tab.Navigator>
  );
}
