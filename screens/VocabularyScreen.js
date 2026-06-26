import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, StyleSheet, StatusBar, Text, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import VocabularyWidget from '../widgets/VocabularyWidget';

export default function VocabularyScreen({ navigation }) {
  const [vocabData, setVocabData] = useState([]);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/Meritto010/vocabulary-data/refs/heads/main/vocab.json')
      .then(res => res.json())
      .then(setVocabData)
      .catch(console.error);
  }, []);

  return (
    <View style={styles.screenWrapper}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
            <Ionicons name="arrow-back" size={24} color="#1E293B" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Vocabulary</Text>
        </View>
        <VocabularyWidget data={vocabData} />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenWrapper: { flex: 1, backgroundColor: '#FFF' },
  safeArea: { 
    flex: 1, 
    backgroundColor: '#FFF', 
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 20 
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    marginBottom: 10 
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#1E293B', marginLeft: 15 },
});
