import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, StatusBar, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SpeakingWidget from '../widgets/SpeakingWidget';

export default function SpeakingScreen() {
  const navigation = useNavigation();

  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    checkLicense();
  }, []);

  const checkLicense = async () => {
    try {
      const status = await AsyncStorage.getItem('@is_activated');
      setIsPro(status === 'true');
    } catch (e) {
      setIsPro(false);
    }
  };

  // 🔒 PREMIUM BLOCK (ONLY ADDITION)
  if (!isPro) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0F172A' }}>
        <Ionicons name="lock-closed" size={50} color="#FFF" />

        <Text style={{ fontSize: 18, fontWeight: '800', marginTop: 10, color: '#FFF' }}>
          Premium Locked
        </Text>

        <TouchableOpacity
          onPress={() => navigation.navigate('LicenseActivation')}
          style={{
            marginTop: 20,
            backgroundColor: '#0F4C81',
            paddingHorizontal: 18,
            paddingVertical: 10,
            borderRadius: 10
          }}
        >
          <Text style={{ color: '#FFF', fontWeight: '800' }}>
            Unlock
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Dashboard')}>
          <Ionicons name="grid-outline" size={24} color="#FFF" />
          <Text style={styles.navText}>Dashboard</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Speaking Lab</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.introSection}>
          <Text style={styles.welcomeText}>Speaking Mastery</Text>
          <Text style={styles.subText}>Engage in multi-turn corporate simulations to master grammar in context.</Text>
        </View>

        <SpeakingWidget />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingBottom: 15, backgroundColor: '#0F4C81',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 10,
  },
  navButton: { flexDirection: 'row', alignItems: 'center' },
  navText: { color: '#FFF', fontWeight: '800', marginLeft: 8, fontSize: 14 },
  headerTitle: { color: '#FFF', fontWeight: '900', fontSize: 18 },
  scrollContent: { paddingBottom: 40 },
  introSection: { padding: 25 },
  welcomeText: { fontSize: 32, fontWeight: '900', color: '#FFF' },
  subText: { fontSize: 16, color: '#94A3B8', marginTop: 8, lineHeight: 24 }
});