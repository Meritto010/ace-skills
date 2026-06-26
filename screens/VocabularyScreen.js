import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, StyleSheet, StatusBar, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import VocabularyWidget from '../widgets/VocabularyWidget';

export default function VocabularyScreen({ navigation }) {
  const [vocabData, setVocabData] = useState([]);

  useEffect(() => {
    // Replace with your actual JSON URL
    fetch('https://raw.githubusercontent.com/Meritto010/vocabulary-data/refs/heads/main/vocab.json')
      .then(res => res.json())
      .then(setVocabData)
      .catch(console.error);
  }, []);

  return (
    <View style={styles.screenWrapper}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          {/* Back button to navigate to Dashboard */}
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
  safeArea: { flex: 1, backgroundColor: '#FFF', paddingTop: StatusBar.currentHeight || 0 },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingVertical: 16, 
    borderBottomWidth: 1, 
    borderColor: '#E2E8F0' 
  },
  headerTitle: { fontSize: 18, fontWeight: '900', marginLeft: 14, color: '#1E293B' }
});
