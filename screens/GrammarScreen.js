import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GrammarWidget from '../widgets/GrammarWidget';
import { grammarData } from '../data/GrammarData';

export default function GrammarScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const [isPro, setIsPro] = useState(false);

  const titleSize = width > 400 ? 20 : 18;

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
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { fontSize: titleSize }]}>
          Grammar Mastery
        </Text>
      </View>

      <View style={styles.content}>
        <GrammarWidget data={grammarData} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  backButton: { marginRight: 16 },
  headerTitle: { fontWeight: '700', color: '#1E293B' },
  content: { flex: 1 }
});