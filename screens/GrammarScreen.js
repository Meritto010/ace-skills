import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, useWindowDimensions, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GrammarWidget from '../widgets/GrammarWidget';

// GitHub URL for the dynamic data
const GRAMMAR_URL = 'https://raw.githubusercontent.com/Meritto010/grammar-data/refs/heads/main/grammar.json';

export default function GrammarScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const [isPro, setIsPro] = useState(false);
  const [grammarData, setGrammarData] = useState(null); // Holds fetched data
  const [loading, setLoading] = useState(true);

  const titleSize = width > 400 ? 20 : 18;

  useEffect(() => {
    checkLicense();
    fetchGrammarData();
  }, []);

  const checkLicense = async () => {
    try {
      const status = await AsyncStorage.getItem('@is_activated');
      setIsPro(status === 'true');
    } catch (e) {
      setIsPro(false);
    }
  };

  const fetchGrammarData = async () => {
    try {
      const response = await fetch(GRAMMAR_URL);
      if (!response.ok) throw new Error('Network response was not ok');
      const json = await response.json();
      setGrammarData(json);
    } catch (e) {
      Alert.alert('Error', 'Unable to load grammar content.');
    } finally {
      setLoading(false);
    }
  };

  // 🔒 PREMIUM FALLBACK SAFETY GATE
  if (!isPro) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' }}>
        <Ionicons name="lock-closed" size={50} color="#0F4C81" />
        <Text style={{ fontSize: 18, fontWeight: '800', marginTop: 12, color: '#1E293B' }}>
          Feature Locked 🔒
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Activation')}
          style={{ marginTop: 22, backgroundColor: '#0F4C81', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, elevation: 2 }}
        >
          <Text style={{ color: '#FFF', fontWeight: '800', fontSize: 14 }}>Activate Premium</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Loading State
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' }}>
        <ActivityIndicator size="large" color="#0F4C81" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { fontSize: titleSize }]}>
          Grammar Mastery
        </Text>
      </View>

      <View style={styles.content}>
        {/* Pass the dynamically fetched data to your widget */}
        <GrammarWidget data={grammarData} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderColor: '#E2E8F0', backgroundColor: '#FFFFFF' },
  backButton: { marginRight: 14 },
  headerTitle: { fontWeight: '900', color: '#1E293B' },
  content: { flex: 1 },
});
