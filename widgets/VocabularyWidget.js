import React, { useState, useEffect, useMemo } from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, FlatList, 
  ActivityIndicator, StyleSheet, LayoutAnimation, Platform, UIManager 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const VOCAB_URL = "https://raw.githubusercontent.com/Meritto010/vocabulary-data/refs/heads/main/vocab.json";
const COURSES_URL = "https://raw.githubusercontent.com/Meritto010/courses/refs/heads/main/courses.json";

export default function VocabularyWidget() {
  const [data, setData] = useState([]);
  const [courses, setCourses] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Social");
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetch(VOCAB_URL).then(res => res.json()).then(setData);
    fetch(COURSES_URL).then(res => res.json()).then(setCourses).catch(console.error);
  }, []);

  const speak = (text) => {
    if (!text) return;
    Speech.stop();
    const cleanText = text.replace(/^(AI:|User:|Grammar:)\s*/i, '').trim();
    Speech.speak(cleanText, { language: 'en-US', rate: 0.9 });
  };

  const categories = useMemo(() => [...new Set(data.map(item => item.category))], [data]);
  const filteredData = useMemo(() => data.filter(item => item.category === activeCategory), [data, activeCategory]);

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillContainer}>
        {categories.map(cat => (
          <TouchableOpacity key={cat} style={[styles.pill, activeCategory === cat && styles.pillActive]} onPress={() => { setActiveCategory(cat); setExpandedId(null); }}>
            <Text style={[styles.pillText, activeCategory === cat && styles.pillTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList 
        data={filteredData}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <TouchableOpacity 
                style={{ flex: 1 }}
                onPress={() => speak(item.term)}
              >
                <Text style={styles.term}>{item.term}</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={{ padding: 10 }}
                onPress={() => { 
                  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); 
                  setExpandedId(expandedId === item.id ? null : item.id); 
                }}
              >
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
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  pillContainer: { flexGrow: 0, paddingTop: 30, paddingBottom: 15, paddingHorizontal: 20 },
  pill: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 16, backgroundColor: '#F1F5F9', marginRight: 8 },
  pillActive: { backgroundColor: '#0F4C81' },
  pillText: { fontSize: 13, fontWeight: '700', color: '#64748B' },
  pillTextActive: { color: '#FFF' },
  card: { paddingHorizontal: 15, paddingVertical: 12, borderBottomWidth: 1, borderColor: '#F1F5F9' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  term: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
  expanded: { marginTop: 8, padding: 12, backgroundColor: '#F8FAFC', borderRadius: 8 },
  def: { color: '#334155', fontSize: 14, lineHeight: 20 }
});
