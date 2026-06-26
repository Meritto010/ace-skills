import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, StatusBar, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SpeakingWidget from '../widgets/SpeakingWidget';

const SPEAKING_URL = 'https://raw.githubusercontent.com/Meritto010/speaking-data/refs/heads/main/speaking.json';

export default function SpeakingScreen() {
  const navigation = useNavigation();
  const [speakingData, setSpeakingData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(SPEAKING_URL)
      .then(res => res.json())
      .then(setSpeakingData)
      .finally(() => setLoading(false));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
          <Text style={styles.navText}>Dashboard</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Speaking</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.introSection}>
          <Text style={styles.welcomeText}>Speaking Mastery</Text>
          <Text style={styles.subText}>Engage in multi-turn simulations.</Text>
        </View>
        {loading ? <ActivityIndicator size="large" color="#0F4C81" /> : <SpeakingWidget data={speakingData} />}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingBottom: 15, 
    backgroundColor: '#FFF', 
    borderBottomWidth: 1, 
    borderColor: '#E2E8F0', 
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 15 : 20 
  },
  navButton: { flexDirection: 'row', alignItems: 'center' },
  navText: { color: '#1E293B', fontWeight: '800', marginLeft: 8, fontSize: 14 },
  headerTitle: { color: '#1E293B', fontWeight: '900', fontSize: 18 },
  scrollContent: { paddingBottom: 30 },
  introSection: { padding: 20 },
  welcomeText: { color: '#1E293B', fontSize: 22, fontWeight: '900' },
  subText: { color: '#64748B', marginTop: 4 }
});
