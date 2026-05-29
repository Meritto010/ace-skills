import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import VocabularyWidget from '../widgets/VocabularyWidget';

export default function VocabularyScreen({ navigation }) {

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

  // 🔒 PREMIUM FALLBACK SAFETY GATE (FIXED TARGET ROUTE)
  if (!isPro) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' }}>
        <Ionicons name="lock-closed" size={50} color="#0F4C81" />
        <Text style={{ fontSize: 18, fontWeight: '800', marginTop: 12, color: '#1E293B' }}>
          Feature Locked 🔒
        </Text>
        <Text style={{ fontSize: 13, color: '#64748B', fontWeight: '600', marginTop: 4, textAlign: 'center', paddingHorizontal: 40 }}>
          This module requires an active license key to process content.
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Activation')} // Fixed matching App.js key name
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
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Professional Expressions</Text>
      </View>
      
      <View style={{ flex: 1 }}>
        <VocabularyWidget />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    marginRight: 14,
  },
  headerTitle: { 
    fontSize: 18,
    fontWeight: '900', 
    color: '#1E293B',
  },
});
