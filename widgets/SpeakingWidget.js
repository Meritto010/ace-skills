import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, SafeAreaView, Platform, UIManager, LayoutAnimation } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function SpeakingWidget({ data }) {
  const [visible, setVisible] = useState(false);
  const sourceData = data || {};
  const levels = Object.keys(sourceData);
  const [level, setLevel] = useState(levels[0] || '');
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(prev => (prev === id ? null : id));
  };

  const speakLine = (text) => {
    if (!text) return;
    Speech.stop();
    const cleanText = text.replace('AI: ', '').replace('User: ', '').trim();
    Speech.speak(cleanText, { language: 'en-US', rate: 0.9, pitch: 1.0 });
  };

  return (
    <View style={styles.widgetContainer}>
      <TouchableOpacity style={styles.mainStartBtn} onPress={() => setVisible(true)}>
        <Ionicons name="mic-outline" size={22} color="#FFF" />
        <Text style={styles.mainStartBtnText}>Enter Simulation Lab</Text>
      </TouchableOpacity>

      <Modal visible={visible} animationType="slide" transparent={false}>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setVisible(false)}><Text style={{fontWeight:'700'}}>Close</Text></TouchableOpacity>
            <Text style={styles.modalTitle}>Speaking Lab</Text>
            <View style={{width: 40}} />
          </View>

          <ScrollView contentContainerStyle={styles.modalScroll}>
            <View style={styles.levelSelector}>
              {levels.map((lvl) => (
                <TouchableOpacity key={lvl} style={[styles.lvlPill, level === lvl && styles.lvlPillActive]} onPress={() => {setLevel(lvl); setExpandedId(null);}}>
                  <Text style={level === lvl ? {color: '#FFF'} : {color: '#64748B'}}>{lvl}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.contentHeading}>{sourceData[level]?.title?.toUpperCase()}</Text>

            {sourceData[level]?.topics?.map((item) => (
              <View key={item.id} style={styles.scenarioCard}>
                <View style={styles.scenarioHeader}>
                  <TouchableOpacity style={{ flex: 1 }} onPress={() => speakLine(item.title)}>
                    <Text style={styles.scenarioTitle}>{item.title}</Text>
                    <Text style={styles.focusText}>Focus: {item.grammar_focus}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ padding: 10 }} onPress={() => toggleExpand(item.id)}>
                    <Ionicons name={expandedId === item.id ? "chevron-up" : "chevron-down"} size={20} color="#0F4C81" />
                  </TouchableOpacity>
                </View>

                {expandedId === item.id && (
                  <View style={styles.syncArea}>
                    {item.dialogue.map((line, idx) => {
                      const isAi = line.startsWith('AI:');
                      return (
                        <TouchableOpacity 
                          key={idx} 
                          style={[isAi ? styles.rowAi : styles.chatBubbleUser]} 
                          onPress={() => speakLine(line)}
                        >
                          <Text style={isAi ? styles.aiText : styles.userText}>
                            {line.replace('AI: ', '').replace('User: ', '')}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  widgetContainer: { paddingHorizontal: 20 },
  mainStartBtn: { backgroundColor: '#0F4C81', padding: 16, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  mainStartBtnText: { color: '#FFF', fontWeight: '800', marginLeft: 8 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center', borderBottomWidth: 1, borderColor: '#E2E8F0' },
  modalTitle: { fontSize: 16, fontWeight: '900' },
  modalScroll: { padding: 20 },
  levelSelector: { flexDirection: 'row', marginBottom: 20 },
  lvlPill: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, backgroundColor: '#F1F5F9', marginRight: 10 },
  lvlPillActive: { backgroundColor: '#0F4C81' },
  contentHeading: { fontSize: 14, fontWeight: '900', color: '#94A3B8', marginBottom: 15, letterSpacing: 1 },
  scenarioCard: { backgroundColor: '#FFF', padding: 20, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  scenarioHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  scenarioTitle: { fontSize: 16, fontWeight: '800', color: '#1E293B', marginBottom: 4 },
  focusText: { fontSize: 12, color: '#0F4C81', fontWeight: '700' },
  syncArea: { marginTop: 15, paddingTop: 15, borderTopWidth: 1, borderColor: '#E2E8F0' },
  rowAi: { marginBottom: 10 },
  chatBubbleUser: { backgroundColor: '#0F4C81', padding: 12, borderRadius: 14, marginBottom: 10, alignSelf: 'flex-end', maxWidth: '80%' },
  aiText: { color: '#1E293B', fontWeight: '600' },
  userText: { color: '#FFF', fontWeight: '600' }
});
