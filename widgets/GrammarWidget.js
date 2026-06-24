import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, ScrollView, 
  Modal, ActivityIndicator, Platform, UIManager 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Speech from 'expo-speech';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function GrammarWidget({ data }) {
  const insets = useSafeAreaInsets();
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('basics'); 
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    return () => Speech.stop();
  }, []);

  const handleClose = () => {
    Speech.stop();
    setVisible(false);
  };

  // 1. Helper for full details (Used by Individual Play Button)
  const getFullTopicString = (topic) => {
    const examplesText = topic.examples
      ? topic.examples.map(ex => `${ex.s}. ${ex.n}`).join('. ')
      : '';
    return `${topic.title}. ${topic.definition}. ${topic.tip}. ${examplesText}`;
  };

  // 2. Helper for summary only (Used by Play All Button)
  const getSummaryString = (topic) => {
    return `${topic.title}. ${topic.definition}.`;
  };

  // Play single topic with FULL content
  const speak = (topic) => {
    Speech.stop();
    Speech.speak(getFullTopicString(topic), { language: 'en-IN', rate: 0.9 });
  };

  // Play all topics with SUMMARY content (Title + Definition only)
  const speakAll = async () => {
    Speech.stop();
    const topics = currentLevel?.topics || [];
    
    for (const topic of topics) {
      let isStopped = false;
      await new Promise((resolve) => {
        Speech.speak(getSummaryString(topic), {
          language: 'en-US',
          rate: 0.9,
          onDone: resolve,
          onStopped: () => { isStopped = true; resolve(); }
        });
      });
      if (isStopped) break;
      await new Promise(resolve => setTimeout(resolve, 800));
    }
  };

  const stopSpeaking = () => Speech.stop();
  const currentLevel = data ? (data[activeTab] || { goal: "", topics: [] }) : { goal: "", topics: [] };

  if (!data || Object.keys(data).length === 0) {
    return <View style={styles.card}><ActivityIndicator size="large" color="#0F4C81" /></View>;
  }

  return (
    <View style={styles.cardContainer}>
      <View style={styles.card}>
        <View style={styles.cardInfo}>
          <Text style={styles.title}>Grammar Reference</Text>
          <Text style={styles.subtitle}>Comprehensive Learning Library</Text>
        </View>
        <TouchableOpacity style={styles.openButton} onPress={() => setVisible(true)}>
          <Text style={styles.openButtonText}>Open Library</Text>
          <Ionicons name="book-outline" size={18} color="#FFF" />
        </TouchableOpacity>
      </View>

      <Modal animationType="slide" visible={visible} onRequestClose={handleClose} presentationStyle="fullScreen">
        <View style={[styles.modalContainer, { paddingTop: insets.top }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Grammar Mastery</Text>
            <TouchableOpacity onPress={handleClose}><Ionicons name="close-circle" size={32} color="#94A3B8" /></TouchableOpacity>
          </View>

          <View style={styles.tabBar}>
            {['basics', 'beginner', 'intermediate'].map((tab) => (
              <TouchableOpacity key={tab} style={[styles.tab, activeTab === tab && styles.activeTab]} onPress={() => setActiveTab(tab)}>
                <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <ScrollView style={styles.scrollMain} contentContainerStyle={styles.scrollContentContainer}>
            <View style={styles.goalBox}><Text style={styles.goalText}>{currentLevel.goal}</Text></View>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={[styles.ctrlBtn, styles.playAll]} onPress={speakAll}><Text style={styles.btnTxt}>Play All Summaries</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.ctrlBtn, styles.stop]} onPress={stopSpeaking}><Text style={styles.btnTxt}>Stop</Text></TouchableOpacity>
            </View>

            {currentLevel.topics.map((topic) => (
              <View key={topic.id} style={styles.accordion}>
                <View style={styles.accHeader}>
                  <TouchableOpacity onPress={() => speak(topic)}>
                    <Ionicons name="play-circle" size={24} color="#0F4C81" />
                  </TouchableOpacity>
                  <Text style={styles.accTitle} onPress={() => setExpandedId(expandedId === topic.id ? null : topic.id)}>{topic.title}</Text>
                </View>
                {expandedId === topic.id && (
                  <View style={styles.accContent}>
                    <Text style={styles.defText}>{topic.definition}</Text>
                    <Text style={styles.tipText}>Tip: {topic.tip}</Text>
                    {topic.examples?.map((ex, idx) => (
                      <Text key={idx} style={styles.exampleText}>• {ex.s} - {ex.n}</Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

// ... (Styles remain the same)
const styles = StyleSheet.create({
  cardContainer: { padding: 16 },
  card: { backgroundColor: '#FFF', padding: 24, borderRadius: 24, elevation: 4 },
  title: { fontSize: 20, fontWeight: '800', color: '#1E293B' },
  subtitle: { fontSize: 14, color: '#64748B' },
  openButton: { backgroundColor: '#0F4C81', flexDirection: 'row', padding: 16, borderRadius: 14, marginTop: 20, justifyContent: 'center', alignItems: 'center', gap: 10 },
  openButtonText: { color: '#FFF', fontWeight: '700' },
  modalContainer: { flex: 1, backgroundColor: '#F8FAFC' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#0F4C81' },
  tabBar: { flexDirection: 'row', padding: 6, backgroundColor: '#E2E8F0', marginHorizontal: 20, borderRadius: 16 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12 },
  activeTab: { backgroundColor: '#0F4C81' },
  tabText: { fontSize: 11, fontWeight: '800', color: '#64748B' },
  activeTabText: { color: '#FFF' },
  scrollMain: { flex: 1 },
  scrollContentContainer: { paddingHorizontal: 20, paddingBottom: 100 },
  goalBox: { backgroundColor: '#F0F9FF', padding: 20, borderRadius: 20, marginBottom: 20 },
  goalText: { fontSize: 15, color: '#0C4A6E', fontWeight: '600' },
  buttonRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  ctrlBtn: { flex: 1, padding: 14, borderRadius: 12, alignItems: 'center' },
  playAll: { backgroundColor: '#059669' },
  stop: { backgroundColor: '#DC2626' },
  btnTxt: { color: '#FFF', fontWeight: '700' },
  accordion: { backgroundColor: '#FFF', borderRadius: 18, marginBottom: 12, padding: 15 },
  accHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  accTitle: { flex: 1, fontWeight: '700', fontSize: 16 },
  accContent: { marginTop: 10, paddingLeft: 10 },
  defText: { fontSize: 15, color: '#334155', marginBottom: 5 },
  tipText: { fontSize: 14, color: '#64748B', fontStyle: 'italic', marginBottom: 10 },
  exampleText: { fontSize: 14, color: '#475569', marginBottom: 8 }
});
