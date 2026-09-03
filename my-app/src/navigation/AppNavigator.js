import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Users, Trophy } from 'lucide-react-native';
import { colors, fontSize, fontWeight } from '../theme';
import HomeScreen from '../screens/HomeScreen';
import PlayersScreen from '../screens/PlayersScreen';
import PlayerFormScreen from '../screens/PlayerFormScreen';
import PlayerDetailsScreen from '../screens/PlayerDetailsScreen';
import LineupScreen from '../screens/LineupScreen';
import SavedLineupsScreen from '../screens/SavedLineupsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const LineupStack = createNativeStackNavigator();

const opts = { headerShown: false, contentStyle: { backgroundColor: colors.background }, animation: 'slide_from_right' };

function HomeStackScreen() {
  return <Stack.Navigator screenOptions={opts}><Stack.Screen name="Home" component={HomeScreen} /></Stack.Navigator>;
}

function PlayersStackScreen() {
  return (
    <Stack.Navigator screenOptions={opts}>
      <Stack.Screen name="PlayersList" component={PlayersScreen} />
      <Stack.Screen name="PlayerForm" component={PlayerFormScreen} />
      <Stack.Screen name="PlayerDetails" component={PlayerDetailsScreen} />
    </Stack.Navigator>
  );
}

function LineupStackScreen() {
  return (
    <LineupStack.Navigator screenOptions={opts}>
      <LineupStack.Screen name="SavedLineups" component={SavedLineupsScreen} />
      <LineupStack.Screen name="LineupBuilder" component={LineupScreen} />
    </LineupStack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'HomeTab') return <Home size={size} color={color} />;
          if (route.name === 'PlayersTab') return <Users size={size} color={color} />;
          if (route.name === 'LineupTab') return <Trophy size={size} color={color} />;
          return null;
        },
        tabBarActiveTintColor: colors.primary, tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border, borderTopWidth: 1, paddingBottom: 4, height: 60 },
        tabBarLabelStyle: { fontSize: fontSize.xs, fontWeight: fontWeight.semibold },
      })}>
      <Tab.Screen name="HomeTab" component={HomeStackScreen} options={{ tabBarLabel: 'Início' }} />
      <Tab.Screen name="PlayersTab" component={PlayersStackScreen} options={{ tabBarLabel: 'Jogadores' }} />
      <Tab.Screen name="LineupTab" component={LineupStackScreen} options={{ tabBarLabel: 'Escalações' }} />
    </Tab.Navigator>
  );
}
