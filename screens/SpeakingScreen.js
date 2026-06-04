import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, StatusBar, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech'; // Import to manage audio stopping[span_1](start_span)[span_1](end_span)
import SpeakingWidget from '../widgets/SpeakingWidget';

export default function SpeakingScreen() {
  const navigation = useNavigation();
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    checkLicense();
    
    // Stop audio automatically when navigating away[span_2](start_span)[span_2](end_span)
    const unsubscribe = navigation.addListener('blur', () => {
      Speech.stop();
    });

    return unsubscribe;
  }, [navigation]);

  const checkLicense = async () => {
    try {
      const status = await AsyncStorage.getItem('@is_activated');
      setIsPro(status === 'true');
    } catch (e) {
      setIsPro(false);
    }
  };

  if (!isPro) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0F172A' }}>
        <Ionicons name="lock-closed" size={50} color="#0F4C81" />
        <Text style={{ fontSize: 18, fontWeight: '800', marginTop: 12, color: '#FFFFFF' }}>
          Feature Locked 
        </Text>
        <Text style={{ fontSize: 13, color: '#94A3B8', fontWeight: '600', marginTop: 4, textAlign: 'center', paddingHorizontal: 40 }}>
          This module requires an active license key to process content.
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Activation')}
          style={{
            marginTop: 22,
            backgroundColor: '#0F4C81',
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 12,
            elevation: 2
          }}
        >
          <Text style={{ color: '#FFF', fontWeight: '800', fontSize: 14 }}>
            Activate Premium
          </Text>
        </TouchableOpacity>
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
  scrollContent: { paddingBottom: 30 },
  introSection: { padding: 20 },
  welcomeText: { color: '#FFF', fontSize: 22, fontWeight: '900' },
  subText: { color: '#94A3B8', fontSize: 14, fontWeight: '600', marginTop: 6, lineHeight: 20 },
});
