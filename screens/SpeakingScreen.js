import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, StatusBar, TouchableOpacity, Platform, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SpeakingWidget from '../widgets/SpeakingWidget';

const SPEAKING_URL = 'https://raw.githubusercontent.com/Meritto010/speaking-data/refs/heads/main/speaking.json';

export default function SpeakingScreen() {
  const navigation = useNavigation();
  const [isPro, setIsPro] = useState(false);
  const [speakingData, setSpeakingData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkLicense();
    fetchSpeakingData();
  }, []);

  const checkLicense = async () => {
    try {
      const status = await AsyncStorage.getItem('@is_activated');
      setIsPro(status === 'true');
    } catch (e) {
      setIsPro(false);
    }
  };

  const fetchSpeakingData = async () => {
    setLoading(true);
    try {
      const response = await fetch(SPEAKING_URL);
      if (!response.ok) throw new Error('Network failed');
      const json = await response.json();
      await AsyncStorage.setItem('@speaking_data_cache', JSON.stringify(json));
      setSpeakingData(json);
    } catch (e) {
      const cachedData = await AsyncStorage.getItem('@speaking_data_cache');
      if (cachedData) {
        setSpeakingData(JSON.parse(cachedData));
      } else {
        Alert.alert('Error', 'Unable to load content.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isPro) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0F172A' }}>
        <Ionicons name="lock-closed" size={50} color="#0F4C81" />
        <Text style={{ fontSize: 18, fontWeight: '800', marginTop: 12, color: '#FFFFFF' }}>Feature Locked 🔒</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Activation')} style={styles.proButton}>
          <Text style={{ color: '#FFF', fontWeight: '800' }}>Activate Premium</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0F172A' }}>
        <ActivityIndicator size="large" color="#0F4C81" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
          <Text style={styles.navText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Speaking Lab</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.introSection}>
          <Text style={styles.welcomeText}>Speaking Mastery</Text>
          <Text style={styles.subText}>Engage in multi-turn simulations.</Text>
        </View>
        <SpeakingWidget data={speakingData} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A'
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android'
      ? (StatusBar.currentHeight || 0) + 15
      : 15,
    paddingBottom: 15,
    backgroundColor: '#0F4C81'
  },

  navButton: {
    flexDirection: 'row',
    alignItems: 'center'
  },

  navText: {
    color: '#FFF',
    fontWeight: '800',
    marginLeft: 8,
    fontSize: 14
  },

  headerTitle: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 18
  },

  scrollContent: {
    paddingBottom: 30
  },

  introSection: {
    padding: 20
  },

  welcomeText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '900'
  },

  subText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 6,
    lineHeight: 20
  },

  proButton: {
    marginTop: 22,
    backgroundColor: '#0F4C81',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12
  }
});