import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import VocabularyWidget from '../widgets/VocabularyWidget';

export default function VocabularyScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [vocabData, setVocabData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    checkLicense();
    fetch('https://raw.githubusercontent.com/Meritto010/vocabulary-data/refs/heads/main/vocab.json')
      .then(res => res.json())
      .then(setVocabData)
      .finally(() => setLoading(false))
      .catch(console.error);
  }, []);

  const checkLicense = async () => {
    const status = await AsyncStorage.getItem('@is_activated');
    setIsPro(status === 'true');
  };

  if (!isPro) {
    return (
      <View style={styles.centerBox}>
        <Ionicons name="lock-closed" size={50} color="#0F4C81" />
        <Text style={styles.lockedText}>Feature Locked</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Activation')} style={styles.proButton}>
          <Text style={{ color: '#FFF', fontWeight: '800' }}>Activate Premium</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) return <View style={styles.centerBox}><ActivityIndicator size="large" color="#0F4C81" /></View>;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vocabulary</Text>
      </View>
      <VocabularyWidget data={vocabData} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  centerBox: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingVertical: 16, 
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1, 
    borderColor: '#E2E8F0' 
  },
  headerTitle: { fontSize: 18, fontWeight: '900', marginLeft: 14, color: '#1E293B' },
  proButton: { marginTop: 22, backgroundColor: '#0F4C81', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  lockedText: { fontSize: 18, fontWeight: '800', marginTop: 12, color: '#1E293B' }
});
