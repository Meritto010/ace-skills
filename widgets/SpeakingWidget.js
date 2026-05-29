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

const THEME_BLUE = '#0F4C81';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function SpeakingWidget() {
  const navigation = useNavigation();

  const [visible, setVisible] = useState(false);

  const levels = speakingData ? Object.keys(speakingData) : [];

  const [level, setLevel] = useState(levels[0] || 'A1');

  const [expandedId, setExpandedId] = useState(null);

  const toggleScenario = (id) => {
    LayoutAnimation.configureNext(
      LayoutAnimation.Presets.easeInEaseOut
    );

    setExpandedId(expandedId === id ? null : id);
  };

  const closeModal = () => {
    setExpandedId(null);
    setVisible(false);
  };

  const goToDashboard = () => {
    setExpandedId(null);
    setVisible(false);

    setTimeout(() => {
      navigation.navigate('Dashboard');
    }, 150);
  };

  if (!speakingData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading Speaking Lab...</Text>
      </View>
    );
  }

  return (
    <View style={styles.widgetContainer}>

      {/* ENTRY BUTTON */}
      <TouchableOpacity
        style={styles.mainStartBtn}
        activeOpacity={0.85}
        onPress={() => setVisible(true)}
      >
        <Ionicons
          name="mic-outline"
          size={22}
          color="#FFF"
          style={{ marginRight: 8 }}
        />

        <Text style={styles.mainStartBtnText}>
          Enter Simulation Lab
        </Text>
      </TouchableOpacity>

      {/* MODAL */}
      <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
        statusBarTranslucent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.overlay}>

          <SafeAreaView style={styles.modalContent}>

            {/* HEADER */}
            <View style={styles.modalHeader}>

              <TouchableOpacity
                onPress={closeModal}
                style={styles.headerBtn}
              >
                <Ionicons
                  name="chevron-down"
                  size={26}
                  color="#0F172A"
                />

                <Text style={styles.headerBtnText}>
                  Close
                </Text>
              </TouchableOpacity>

              <Text style={styles.modalTitle}>
                Speaking Lab
              </Text>

              <TouchableOpacity
                onPress={goToDashboard}
                style={styles.headerBtn}
              >
                <Ionicons
                  name="grid-outline"
                  size={22}
                  color={THEME_BLUE}
                />

                <Text style={styles.dashboardText}>
                  Dashboard
                </Text>
              </TouchableOpacity>

            </View>

            {/* CONTENT */}
            <ScrollView
              contentContainerStyle={styles.modalScroll}
              showsVerticalScrollIndicator={false}
            >

              {/* LEVEL SELECTOR */}
              <View style={styles.levelSelector}>

                {levels.map((lvl) => (
                  <TouchableOpacity
                    key={lvl}
                    style={[
                      styles.lvlPill,
                      level === lvl && styles.lvlPillActive,
                    ]}
                    activeOpacity={0.8}
                    onPress={() => {
                      setLevel(lvl);
                      setExpandedId(null);
                    }}
                  >
                    <Text
                      style={[
                        styles.lvlText,
                        level === lvl && styles.lvlTextActive,
                      ]}
                    >
                      {lvl}
                    </Text>
                  </TouchableOpacity>
                ))}

              </View>

              {/* TITLE */}
              <Text style={styles.levelTitle}>
                {speakingData[level]?.title}
              </Text>

              {/* SCENARIOS */}
              {speakingData[level]?.topics.map((item) => {

                const isExpanded = expandedId === item.id;

                return (
                  <View
                    key={item.id}
                    style={styles.scenarioCard}
                  >

                    <TouchableOpacity
                      style={styles.scenarioHeader}
                      activeOpacity={0.75}
                      onPress={() => toggleScenario(item.id)}
                    >

                      <View style={{ flex: 1 }}>

                        <Text style={styles.scenarioTitle}>
                          {item.title}
                        </Text>

                        <Text style={styles.grammarFocusText}>
                          Focus: {item.grammar_focus}
                        </Text>

                      </View>

                      <Ionicons
                        name={
                          isExpanded
                            ? 'remove-circle'
                            : 'play-circle'
                        }
                        size={28}
                        color={THEME_BLUE}
                      />

                    </TouchableOpacity>

                    {/* DIALOGUES */}
                    {isExpanded && (
                      <View style={styles.syncArea}>

                        {item.dialogue.map((line, idx) => {

                          const isAi = line.startsWith('AI:');

                          return (
                            <View
                              key={idx}
                              style={
                                isAi
                                  ? styles.chatBubbleAi
                                  : styles.chatBubbleUser
                              }
                            >

                              <Text
                                style={
                                  isAi
                                    ? styles.aiText
                                    : styles.userText
                                }
                              >
                                {line
                                  .replace('AI: ', '')
                                  .replace('User: ', '')}
                              </Text>

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

  widgetContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },

  loadingContainer: {
    padding: 30,
    alignItems: 'center',
  },

  loadingText: {
    fontSize: 15,
    color: '#64748B',
    fontWeight: '600',
  },

  mainStartBtn: {
    backgroundColor: THEME_BLUE,
    height: 58,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',

    elevation: 4,

    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },

  mainStartBtnText: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 16,
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
  },

  modalContent: {
    flex: 1,
    backgroundColor: '#F8FAFC',

    marginTop:
      Platform.OS === 'android'
        ? StatusBar.currentHeight
        : 40,

    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,

    overflow: 'hidden',
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    backgroundColor: '#FFF',

    paddingHorizontal: 18,
    paddingVertical: 16,

    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },

  modalTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A',
  },

  headerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  headerBtnText: {
    marginLeft: 4,
    fontWeight: '700',
    color: '#0F172A',
    fontSize: 13,
  },

  dashboardText: {
    marginLeft: 4,
    fontWeight: '700',
    color: THEME_BLUE,
    fontSize: 12,
  },

  modalScroll: {
    paddingBottom: 100,
  },

  levelSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',

    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 14,
  },

  lvlPill: {
    backgroundColor: '#E2E8F0',

    paddingHorizontal: 18,
    paddingVertical: 10,

    borderRadius: 24,

    marginHorizontal: 5,
    marginBottom: 10,
  },

  lvlPillActive: {
    backgroundColor: THEME_BLUE,
  },

  lvlText: {
    color: '#64748B',
    fontWeight: '800',
    fontSize: 13,
  },

  lvlTextActive: {
    color: '#FFF',
  },

  levelTitle: {
    textAlign: 'center',

    fontSize: 11,
    fontWeight: '900',

    color: '#94A3B8',

    textTransform: 'uppercase',
    letterSpacing: 1,

    marginBottom: 20,
  },

  scenarioCard: {
    backgroundColor: '#FFF',

    marginHorizontal: 18,
    marginBottom: 14,

    borderRadius: 18,

    borderLeftWidth: 4,
    borderLeftColor: THEME_BLUE,

    elevation: 2,
  },

  scenarioHeader: {
    flexDirection: 'row',
    alignItems: 'center',

    padding: 18,
  },

  scenarioTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
  },

  grammarFocusText: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME_BLUE,
    marginTop: 5,
  },

  syncArea: {
    padding: 18,
    paddingTop: 6,

    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },

  chatBubbleAi: {
    backgroundColor: '#F1F5F9',

    padding: 12,
    borderRadius: 14,

    marginBottom: 10,

    alignSelf: 'flex-start',
    maxWidth: '85%',
  },

  chatBubbleUser: {
    backgroundColor: THEME_BLUE,

    padding: 12,
    borderRadius: 14,

    marginBottom: 10,

    alignSelf: 'flex-end',
    maxWidth: '85%',
  },

  aiText: {
    color: '#1E293B',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 20,
  },

  userText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 20,
  },
});