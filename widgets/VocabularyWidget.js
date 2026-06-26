import React, { useState, useMemo } from 'react';
import { 
  View, Text, TouchableOpacity, FlatList, StyleSheet, LayoutAnimation, Platform, UIManager 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function VocabularyWidget({ data }) {
  const [selectedLetter, setSelectedLetter] = useState("A");
  const [expandedId, setExpandedId] = useState(null);

  const filteredData = useMemo(() => {
    return data
      .filter(item => item.term?.toUpperCase().startsWith(selectedLetter))
      .slice(0, 5);
  }, [data, selectedLetter]);

  const speak = (text) => {
    Speech.stop();
    Speech.speak(text, { language: 'en-IN', rate: 0.9 });
  };

  return (
    <View style={styles.container}>
      {/* Compact Alphabet Grid */}
      <View style={styles.gridContainer}>
        {ALPHABET.map((letter) => (
          <TouchableOpacity
            key={letter}
            style={[styles.pill, selectedLetter === letter && styles.pillActive]}
            onPress={() => setSelectedLetter(letter)}
          >
            <Text style={[styles.pillText, selectedLetter === letter && styles.pillTextActive]}>
              {letter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={{ flex: 1 }}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.category || "General"}</Text>
                </View>
                <TouchableOpacity onPress={() => speak(item.term)}>
                  <Text style={styles.term}>{item.term}</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                setExpandedId(expandedId === item.id ? null : item.id);
              }}>
                <Ionicons name={expandedId === item.id ? "chevron-up" : "chevron-down"} size={20} color="#64748B" />
              </TouchableOpacity>
            </View>
            {expandedId === item.id && (
              <TouchableOpacity style={styles.expanded} onPress={() => speak(item.definition)}>
                <Text style={styles.def}>{item.definition}</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No terms for {selectedLetter}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', paddingHorizontal: 10 },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6, // Added gap for compact spacing
    paddingTop: 10, // Moved grid up by reducing top padding
    paddingBottom: 15,
  },
  pill: {
    width: '11%', // Reduced size for a more compact, centered look
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
  },
  pillActive: { backgroundColor: '#0F4C81' },
  pillText: { fontSize: 12, fontWeight: '700', color: '#64748B' },
  pillTextActive: { color: '#FFF' },
  listContent: { paddingBottom: 40 },
  card: { 
    marginHorizontal: 5, 
    marginVertical: 6,
    padding: 14, 
    backgroundColor: '#FFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4,
  },
  badgeText: { fontSize: 9, fontWeight: '800', color: '#0369A1', textTransform: 'uppercase' },
  term: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  expanded: { marginTop: 8 },
  def: { fontSize: 14, color: '#475569', lineHeight: 20 },
  empty: { textAlign: 'center', marginTop: 50, color: '#94A3B8' }
});
