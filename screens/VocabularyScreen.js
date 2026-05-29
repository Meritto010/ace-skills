import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, SafeAreaView, StyleSheet, StatusBar, Platform } from 'react-native';
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

  //  PREMIUM FALLBACK SAFETY GATE (FIXED TARGET ROUTE)
  if (!isPro) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' }}>
        <Ionicons name="lock-closed" size={50} color="#0F4C81" />
        <Text style={{ fontSize: 18, fontWeight: '800', marginTop: 12, color: '#1E293B' }}>
          Feature Locked 
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
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={true} />
      
      {/*  SAFE SPACED TOP HEADER SECTION */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Professional Expressions</Text>
      </View>
      
      <View style={styles.contentContainer}>
        <VocabularyWidget />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#F8FAFC' 
  },
  //  FIX: Balanced Header alignment pushing content natively below status bar layer
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 12 : 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    marginRight: 14,
    padding: 2, // Slightly increased tap target profile safely
  },
  headerTitle: { 
    fontSize: 18,
    fontWeight: '900', 
    color: '#1E293B',
  },
  //  FIX: Balanced outer framing layout container for internal widgets 
  contentContainer: { 
    flex: 1,
    paddingHorizontal: 4, // Prevents content listings from clipping on rounded screen glass corners
    paddingBottom: 12     // Balance layout spacing at base framework level
  }
});
