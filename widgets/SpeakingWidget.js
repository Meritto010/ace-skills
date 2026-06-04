import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
  LayoutAnimation,
  UIManager,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { speakingData } from '../data/SpeakingData';
import * as Speech from 'expo-speech'; // Added Speech library[span_1](start_span)[span_1](end_span)

const THEME_BLUE = '#0F4C81';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function SpeakingWidget() {
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);
  const levels = speakingData ? Object.keys(speakingData) : [];
  const [level, setLevel] = useState(levels[0] || 'A1');
  const [expandedId, setExpandedId] = useState(null);

  // New function to handle AI speaking[span_2](start_span)[span_2](end_span)
  const speakAiLine = (line) => {
    const textToSpeak = line.replace('AI: ', '');
    Speech.stop();
    Speech.speak(textToSpeak, {
      language: 'en-US',
      rate: 0.9,
      pitch: 1.0,
    });
  };

  const toggleScenario = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  const closeModal = () => {
    setExpandedId(null);
    setVisible(false);
    Speech.stop(); // Ensure speech stops when closing[span_3](start_span)[span_3](end_span)
  };

  const goToDashboard = () => {
    setExpandedId(null);
    setVisible(false);
    Speech.stop();
    setTimeout(() => navigation.navigate('Dashboard'), 150);
  };

  return (
    <View style={styles.widgetContainer}>
      <TouchableOpacity style={styles.mainStartBtn} activeOpacity={0.85} onPress={() => setVisible(true)}>
        <Ionicons name="mic-outline" size={22} color="#FFF" style={{ marginRight: 8 }} />
        <Text style={styles.mainStartBtnText}>Enter Simulation Lab</Text>
      </TouchableOpacity>

      <Modal visible={visible} animationType="slide" transparent={true} statusBarTranslucent={true} onRequestClose={closeModal}>
        <View style={styles.overlay}>
          <SafeAreaView style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={closeModal} style={styles.headerBtn}>
                <Ionicons name="chevron-down" size={26} color="#0F172A" />
                <Text style={styles.headerBtnText}>Close</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Speaking Lab</Text>
              <TouchableOpacity onPress={goToDashboard} style={styles.headerBtn}>
                <Ionicons name="grid-outline" size={22} color={THEME_BLUE} />
                <Text style={styles.dashboardText}>Dashboard</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.levelSelector}>
                {levels.map((lvl) => (
                  <TouchableOpacity key={lvl} style={[styles.lvlPill, level === lvl && styles.lvlPillActive]} onPress={() => {setLevel(lvl); setExpandedId(null);}}>
                    <Text style={[styles.lvlText, level === lvl && styles.lvlTextActive]}>{lvl}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.levelTitle}>{speakingData[level]?.title}</Text>

              {speakingData[level]?.topics.map((item) => {
                const isExpanded = expandedId === item.id;
                return (
                  <View key={item.id} style={styles.scenarioCard}>
                    <TouchableOpacity style={styles.scenarioHeader} onPress={() => toggleScenario(item.id)}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.scenarioTitle}>{item.title}</Text>
                        <Text style={styles.grammarFocusText}>Focus: {item.grammar_focus}</Text>
                      </View>
                      <Ionicons name={isExpanded ? 'remove-circle' : 'play-circle'} size={28} color={THEME_BLUE} />
                    </TouchableOpacity>

                    {isExpanded && (
                      <View style={styles.syncArea}>
                        {item.dialogue.map((line, idx) => {
                          const isAi = line.startsWith('AI:');
                          return (
                            <View key={idx} style={isAi ? styles.rowAi : styles.chatBubbleUser}>
                              <View style={isAi ? styles.chatBubbleAi : null}>
                                <Text style={isAi ? styles.aiText : styles.userText}>
                                  {line.replace('AI: ', '').replace('User: ', '')}
                                </Text>
                              </View>
                              {isAi && (
                                <TouchableOpacity onPress={() => speakAiLine(line)} style={{ marginLeft: 8 }}>
                                  <Ionicons name="volume-high" size={20} color={THEME_BLUE} />
                                </TouchableOpacity>
                              )}
                            </View>
                          );
                        })}
                      </View>
                    )}
                  </View>
                );
              })}
            </ScrollView>
          </SafeAreaView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  // ... existing styles ...
  rowAi: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  chatBubbleAi: { backgroundColor: '#F1F5F9', padding: 12, borderRadius: 14, alignSelf: 'flex-start', maxWidth: '85%' },
  chatBubbleUser: { backgroundColor: THEME_BLUE, padding: 12, borderRadius: 14, marginBottom: 10, alignSelf: 'flex-end', maxWidth: '85%' },
  aiText: { color: '#1E293B', fontWeight: '600', fontSize: 14 },
  userText: { color: '#FFF', fontWeight: '600', fontSize: 14 },
  // Ensure you include the other styles from your original file here
});
