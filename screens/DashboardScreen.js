import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
  Linking,
  Alert,
  Dimensions,
  ActivityIndicator
} from "react-native";

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import SupportHubModal from '../components/SupportHubModal';

const { width } = Dimensions.get('window');
const ACE_BLUE = '#0F4C81';

const STREAM_URL =
  'https://raw.githubusercontent.com/Meritto010/media_stream/main/media_stream.json';

export default function DashboardScreen() {
  const navigation = useNavigation();

  const [supportVisible, setSupportVisible] = useState(false);
  const [focusTrack, setFocusTrack] = useState('Communication Mastery');
  const [streamData, setStreamData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    loadFocusTrack();
    loadLicenseStatus();
    fetchStreams();
  }, []);

  // ✅ FIXED MATCHING SYSTEM
  const loadFocusTrack = async () => {
    try {
      const savedTrack = await AsyncStorage.getItem('@user_focus_track');

      if (savedTrack === 'communication') {
        setFocusTrack('Communication Mastery');
      } 
      else if (savedTrack === 'wordpower') {
        setFocusTrack('Word Power Builder');
      } 
      else if (savedTrack === 'career') {
        setFocusTrack('Career Readiness');
      } 
      else {
        setFocusTrack('Communication Mastery');
      }

    } catch (e) {
      console.log(e);
      setFocusTrack('Communication Mastery');
    }
  };

  const loadLicenseStatus = async () => {
    try {
      const activated = await AsyncStorage.getItem('@is_activated');

      if (activated === 'true') {
        setIsPro(true);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const fetchStreams = async () => {
    try {
      const response = await fetch(STREAM_URL);
      const json = await response.json();

      if (json.categories) {
        setStreamData(json.categories);
      }
    } catch (e) {
      Alert.alert('Connection Error', 'Unable to load learning streams.');
    } finally {
      setLoading(false);
    }
  };

  const openExternalLink = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Unable to open link.');
      }
    } catch (e) {
      Alert.alert('Error', 'Unable to open link.');
    }
  };

  const SkillButton = ({ title, icon, screen }) => (
    <TouchableOpacity
      style={styles.skillCard}
      activeOpacity={0.8}
      onPress={() => navigation.navigate(screen)}
    >
      <View style={styles.skillIconWrap}>
        <Ionicons name={icon} size={22} color={ACE_BLUE} />
      </View>
      <Text style={styles.skillTitle}>{title}</Text>
    </TouchableOpacity>
  );

  const StreamCard = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.streamCard,
        { backgroundColor: item.accentBg || '#F8FAFC' }
      ]}
      onPress={() => openExternalLink(item.targetUrl)}
    >
      <View style={styles.streamTop}>
        <View style={styles.streamIconCircle}>
          <Ionicons
            name={item.iconName || 'apps-outline'}
            size={20}
            color={ACE_BLUE}
          />
        </View>
      </View>

      <View style={styles.streamBottom}>
        <Text numberOfLines={2} style={styles.streamTitle}>
          {item.title}
        </Text>

        <Text style={styles.streamAction}>
          {item.actionLabel || 'OPEN'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >

        {/* HEADER */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.brandTitle}>ACE</Text>
            <Text style={styles.brandTagline}>
              Master Skills | Build Confidence
            </Text>
          </View>

          <TouchableOpacity
            style={styles.settingsBtn}
            onPress={() => navigation.navigate('Settings')}
          >
            <Ionicons name="settings-outline" size={24} color={ACE_BLUE} />
          </TouchableOpacity>
        </View>

        {/* FOCUS TRACK */}
        <View style={styles.focusCard}>
          <View style={styles.focusLeft}>
            <Ionicons name="compass-outline" size={22} color={ACE_BLUE} />

            <View style={{ marginLeft: 12 }}>
              <Text style={styles.focusLabel}>
                CURRENT FOCUS TRACK
              </Text>

              <Text style={styles.focusTitle}>
                {focusTrack}
              </Text>
            </View>
          </View>
        </View>

        {/* SKILLS */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionLabel}>SKILLS</Text>

          <View style={styles.skillsRow}>
            <SkillButton title="Grammar" icon="book-outline" screen="Grammar" />
            <SkillButton title="Speaking" icon="mic-outline" screen="Speaking" />
            <SkillButton title="Word Power" icon="library-outline" screen="Vocabulary" />
          </View>
        </View>

        {/* STREAMS */}
        {loading ? (
          <ActivityIndicator
            size="large"
            color={ACE_BLUE}
            style={{ marginTop: 40 }}
          />
        ) : (
          streamData.map((category, index) => (
            <View style={styles.sectionBlock} key={index}>
              <Text style={styles.sectionLabel}>
                {category.headingTitle}
              </Text>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {category.items.map((item) => (
                  <StreamCard item={item} key={item.id} />
                ))}
              </ScrollView>
            </View>
          ))
        )}

        {/* SUPPORT */}
        <TouchableOpacity
          style={styles.supportBtn}
          activeOpacity={0.85}
          onPress={() => setSupportVisible(true)}
        >
          <Ionicons name="help-circle-outline" size={20} color="#FFF" />
          <Text style={styles.supportText}>Open Support Hub</Text>
        </TouchableOpacity>

      </ScrollView>

      <SupportHubModal
        visible={supportVisible}
        onClose={() => setSupportVisible(false)}
        isPro={isPro}
      />
    </SafeAreaView>
  );
}