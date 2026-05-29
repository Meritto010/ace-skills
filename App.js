import React, { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  View,
  StatusBar,
  Platform,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  NavigationContainer,
} from '@react-navigation/native';

import {
  createStackNavigator,
} from '@react-navigation/stack';

/* =========================
   SCREENS
========================= */

import LicenseActivationScreen from './screens/LicenseActivationScreen';

import DashboardScreen from './screens/DashboardScreen';

import GrammarScreen from './screens/GrammarScreen';

import SpeakingScreen from './screens/SpeakingScreen';

import VocabularyScreen from './screens/VocabularyScreen';

import SettingsScreen from './screens/SettingsScreen';

import LegalScreen from './screens/LegalScreen';

/* =========================
   STACK
========================= */

const Stack = createStackNavigator();

/* =========================
   MAIN APP STACK
========================= */

function MainAppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        cardStyle: {
          backgroundColor: '#FFFFFF',
        },
      }}
    >

      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
      />

      <Stack.Screen
        name="Grammar"
        component={GrammarScreen}
      />

      <Stack.Screen
        name="Speaking"
        component={SpeakingScreen}
      />

      <Stack.Screen
        name="Vocabulary"
        component={VocabularyScreen}
      />

      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
      />

      <Stack.Screen
        name="Legal"
        component={LegalScreen}
      />

    </Stack.Navigator>
  );
}

/* =========================
   ROOT APP
========================= */

export default function App() {

  const [loading, setLoading] = useState(true);

  const [initialRoute, setInitialRoute] =
    useState('Activation');

  useEffect(() => {
    checkActivation();
  }, []);

  /* =========================
     CHECK LICENSE STATUS
  ========================= */

  const checkActivation = async () => {

    try {

      const activated =
        await AsyncStorage.getItem('@is_activated');

      if (activated === 'true') {

        setInitialRoute('MainApp');

      } else {

        setInitialRoute('Activation');

      }

    } catch (e) {

      setInitialRoute('Activation');

    } finally {

      setLoading(false);

    }
  };

  /* =========================
     LOADING SCREEN
  ========================= */

  if (loading) {

    return (

      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
          paddingTop:
            Platform.OS === 'android'
              ? StatusBar.currentHeight
              : 0,
        }}
      >

        <StatusBar
          barStyle="dark-content"
          backgroundColor="#FFFFFF"
        />

        <ActivityIndicator
          size="large"
          color="#0F4C81"
        />

      </View>
    );
  }

  /* =========================
     NAVIGATION
  ========================= */

  return (

    <NavigationContainer>

      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
      />

      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}
      >

        {/* LICENSE ACTIVATION */}

        <Stack.Screen
          name="Activation"
          component={LicenseActivationScreen}
        />

        {/* MAIN APPLICATION */}

        <Stack.Screen
          name="MainApp"
          component={MainAppNavigator}
        />

      </Stack.Navigator>

    </NavigationContainer>
  );
}