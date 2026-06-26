import React, { useContext } from 'react';
import { ActivityIndicator, View, StatusBar, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, AuthContext } from './context/AuthContext';

// Importing all your screens
import DashboardScreen from './screens/DashboardScreen';
import GrammarScreen from './screens/GrammarScreen';
import LegalScreen from './screens/LegalScreen';
import LicenseActivationScreen from './screens/LicenseActivationScreen';
import PdfReaderScreen from './screens/PdfReaderScreen';
import PlayerScreen from './screens/PlayerScreen';
import SettingsScreen from './screens/SettingsScreen';
import SpeakingScreen from './screens/SpeakingScreen';
import VocabularyScreen from './screens/VocabularyScreen';
import WebScreen from './screens/WebScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}

function AppNavigator() {
  const { loading, isActivated } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <ActivityIndicator size="large" color="#0F4C81" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
          cardStyle: { backgroundColor: '#FFFFFF' },
        }}
      >
        {isActivated ? (
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
        ) : (
          <Stack.Screen name="Activation" component={LicenseActivationScreen} />
        )}
        {/* All screens included */}
        <Stack.Screen name="Grammar" component={GrammarScreen} />
        <Stack.Screen name="Legal" component={LegalScreen} />
        <Stack.Screen name="PdfReader" component={PdfReaderScreen} />
        <Stack.Screen name="Player" component={PlayerScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Speaking" component={SpeakingScreen} />
        <Stack.Screen name="Vocabulary" component={VocabularyScreen} />
        <Stack.Screen name="WebScreen" component={WebScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
