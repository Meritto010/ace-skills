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

  // 🔒 PREMIUM BLOCK (ONLY ADDITION)
  if (!isPro) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' }}>
        <Ionicons name="lock-closed" size={50} color="#0F4C81" />

        <Text style={{ fontSize: 18, fontWeight: '800', marginTop: 10, color: '#1E293B' }}>
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
    padding: 16, 
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    elevation: 1
  },
  backButton: { marginRight: 16 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1E293B' }
});