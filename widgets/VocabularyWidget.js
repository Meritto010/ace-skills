import React, { useState, useEffect, useMemo } from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, FlatList, 
  ActivityIndicator, StyleSheet, LayoutAnimation, Platform, UIManager 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const GITHUB_VOCAB_URL = "https://raw.githubusercontent.com/Meritto010/vocabulary-data/refs/heads/main/vocab.json";

export default function VocabularyWidget() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Social");
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetch(GITHUB_VOCAB_URL)
      .then(res => res.json())
      .then(json => { setData(json); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  const displayData = useMemo(() => data.filter(item => item.category === activeCategory), [data, activeCategory]);

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#0F4C81" /></View>;

  return (
    <View style={styles.container}>
      <FlatList 
        data={displayData}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.scrollViewport}
        renderItem={({ item }) => (
          <View style={styles.accordionCard}>
            <TouchableOpacity onPress={() => setExpandedId(expandedId === item.id ? null : item.id)} style={styles.cardHeader}>
              <Text style={styles.termTitle}>{item.term}</Text>
              <Ionicons name={expandedId === item.id ? "chevron-up" : "chevron-down"} size={20} color="#64748B" />
            </TouchableOpacity>
            {expandedId === item.id && (
              <View style={styles.cardExpandedArea}>
                <Text style={styles.descriptionBody}>{item.definition}</Text>
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', marginTop: 10 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollViewport: { padding: 16, paddingBottom: 150 }, // Added bottom padding to avoid hitting FAB
  accordionCard: { backgroundColor: '#FFF', borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 16 },
  termTitle: { fontSize: 16, fontWeight: '700' },
  cardExpandedArea: { padding: 16, backgroundColor: '#FAFAFA' },
  descriptionBody: { fontSize: 14, color: '#334155' }
});