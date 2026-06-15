import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, ScrollView, 
  Modal, StatusBar, ActivityIndicator, LayoutAnimation, 
  Platform, UIManager, useWindowDimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Speech from 'expo-speech';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function GrammarWidget({ data }) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('basics'); 
  const [expandedId, setExpandedId] = useState(null);

  const speak = (text) => {
    if (!text) return;
    Speech.stop();
    const cleanText = text.replace(/^(AI:|User:|Grammar:)\s*/i, '').trim();
    Speech.speak(cleanText, { language: 'en-US', rate: 0.9 });
  };

  if (!data || Object.keys(data).length === 0) {
    return (
      <View style={styles.card}>
        <ActivityIndicator size="large" color="#0F4C81" />
      </View>
    );
  }

  const currentLevel = data[activeTab] || { goal: "", topics: [] };
  const isLargeScreen = width > 450;

  const toggleAccordion = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

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

      <Modal 
        animationType="slide" 
        visible={visible} 
        onRequestClose={() => setVisible(false)}
        presentationStyle="fullScreen"
      >
        <View style={[styles.modalContainer, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
          <StatusBar barStyle="dark-content" />
          
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Grammar Mastery</Text>
            <TouchableOpacity onPress={() => setVisible(false)} hitSlop={15}>
              <Ionicons name="close-circle" size={32} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <View style={[styles.tabBar, isLargeScreen && { marginHorizontal: 60 }]}>
            {['basics', 'beginner', 'intermediate'].map((tab) => (
              <TouchableOpacity 
                key={tab} 
                style={[styles.tab, activeTab === tab && styles.activeTab]}
                onPress={() => { setExpandedId(null); setActiveTab(tab); }}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                  {tab.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <ScrollView 
            style={styles.scrollMain}
            contentContainerStyle={[styles.scrollContentContainer, { paddingBottom: insets.bottom + 40 }]}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.goalBox}>
              <View style={styles.goalHeader}>
                <Ionicons name="flag" size={14} color="#0F4C81" />
                <Text style={styles.goalLabel}>CURRENT LEVEL GOAL</Text>
              </View>
              <Text style={styles.goalText}>{currentLevel.goal}</Text>
            </View>

            {currentLevel.topics.map((topic) => (
              <View key={topic.id} style={[styles.accordion, expandedId === topic.id && styles.activeAccordion]}>
                <View style={styles.accHeader}>
                  <TouchableOpacity style={{ flex: 1 }} onPress={() => speak(topic.title)}>
                    <Text style={[styles.accTitle, expandedId === topic.id && { color: '#0F4C81' }]}>
                      {topic.title}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => toggleAccordion(topic.id)} activeOpacity={0.7} style={{ padding: 10 }}>
                    <Ionicons 
                      name={expandedId === topic.id ? "chevron-up" : "chevron-down"} 
                      size={20} 
                      color={expandedId === topic.id ? "#0F4C81" : "#94A3B8"} 
                    />
                  </TouchableOpacity>
                </View>

                {expandedId === topic.id && (
                  <View style={styles.accContent}>
                    {/* Definition is now tap-to-speak */}
                    <TouchableOpacity onPress={() => speak(topic.definition)}>
                      <Text style={styles.defText}>{topic.definition}</Text>
                    </TouchableOpacity>
                    
                    {/* Tip is now tap-to-speak */}
                    <TouchableOpacity style={styles.tipBox} onPress={() => speak(topic.tip)}>
                      <Ionicons name="bulb" size={18} color="#B45309" />
                      <Text style={styles.tipText}>{topic.tip}</Text>
                    </TouchableOpacity>

                    <Text style={styles.exampleLabel}>Practical Usage</Text>
                    {topic.examples.map((ex, idx) => (
                      <View key={idx} style={styles.exItem}>
                        <View style={styles.exBullet} />
                        {/* Examples and Notes are now tap-to-speak */}
                        <TouchableOpacity style={{ flex: 1 }} onPress={() => speak(`${ex.s}. ${ex.n}`)}>
                          <Text style={styles.exSentence}>{ex.s}</Text>
                          <Text style={styles.exNote}>{ex.n}</Text>
                        </TouchableOpacity>
                      </View>
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

const styles = StyleSheet.create({
  cardContainer: { padding: 16 },
  card: { backgroundColor: '#FFF', padding: 24, borderRadius: 24, elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 12, borderWidth: 1, borderColor: '#F1F5F9' },
  title: { fontSize: 20, fontWeight: '800', color: '#1E293B', letterSpacing: -0.5 },
  subtitle: { fontSize: 14, color: '#64748B', marginTop: 4, fontWeight: '500' },
  openButton: { backgroundColor: '#0F4C81', flexDirection: 'row', padding: 16, borderRadius: 14, marginTop: 20, justifyContent: 'center', alignItems: 'center', gap: 10 },
  openButtonText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
  modalContainer: { flex: 1, backgroundColor: '#F8FAFC' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#FFF', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#0F4C81' },
  tabBar: { flexDirection: 'row', padding: 6, backgroundColor: '#E2E8F0', marginHorizontal: 20, borderRadius: 16, marginVertical: 15 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12 },
  activeTab: { backgroundColor: '#0F4C81', elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 },
  tabText: { fontSize: 11, fontWeight: '800', color: '#64748B' },
  activeTabText: { color: '#FFF' },
  scrollMain: { flex: 1 },
  scrollContentContainer: { paddingHorizontal: 20 },
  goalBox: { backgroundColor: '#F0F9FF', padding: 20, borderRadius: 20, marginBottom: 24, borderWidth: 1, borderColor: '#BAE6FD' },
  goalHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  goalLabel: { fontSize: 11, fontWeight: '900', color: '#0369A1', letterSpacing: 0.5 },
  goalText: { fontSize: 15, color: '#0C4A6E', fontWeight: '600', lineHeight: 22 },
  accordion: { backgroundColor: '#FFF', borderRadius: 18, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0', overflow: 'hidden' },
  activeAccordion: { borderColor: '#0F4C81', elevation: 2 },
  accHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
  accTitle: { fontWeight: '700', fontSize: 16, color: '#334155' },
  accContent: { padding: 20, borderTopWidth: 1, borderTopColor: '#F1F5F9', backgroundColor: '#FAFAFA' },
  defText: { fontSize: 15, color: '#334155', lineHeight: 24 },
  tipBox: { flexDirection: 'row', backgroundColor: '#FFFBEB', padding: 16, borderRadius: 12, marginTop: 16, gap: 10, alignItems: 'center', borderWidth: 1, borderColor: '#FEF3C7' },
  tipText: { flex: 1, fontSize: 14, color: '#92400E', fontWeight: '600', lineHeight: 20 },
  exampleLabel: { fontSize: 13, fontWeight: '800', color: '#0F4C81', marginTop: 24, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 },
  exItem: { flexDirection: 'row', marginBottom: 16, gap: 10 },
  exBullet: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#0F4C81', marginTop: 9 },
  exSentence: { fontSize: 15, fontWeight: '700', color: '#1E293B', lineHeight: 22 },
  exNote: { fontSize: 14, color: '#64748B', fontStyle: 'italic', marginTop: 4 }
});
