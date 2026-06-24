import React, { useState, useEffect, useCallback } from "react";
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, 
  StatusBar, Platform, Alert, Dimensions, ActivityIndicator, Linking
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import SupportHubModal from '../components/SupportHubModal';
import InquiryModal from '../components/InquiryModal';

const { width } = Dimensions.get('window');
const ACE_BLUE = '#0F4C81';
const STREAM_URL = 'https://raw.githubusercontent.com/Meritto010/media_stream/main/media_stream.json';

export default function DashboardScreen() {
  const navigation = useNavigation();
  const [isPro, setIsPro] = useState(false);
  const [supportVisible, setSupportVisible] = useState(false);
  const [inquiryVisible, setInquiryVisible] = useState(false);
  const [student, setStudent] = useState({ name: '', phone: '', selectedCourse: '' });
  const [focusTrack, setFocusTrack] = useState('Communication Mastery');
  const [streamData, setStreamData] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadLicenseStatus();
    }, [])
  );

  useEffect(() => {
    loadFocusTrack();
    fetchStreams();
  }, []);

  const loadFocusTrack = async () => {
    try {
      const savedTrack = await AsyncStorage.getItem('@user_focus_track');
      if (savedTrack === 'communication') setFocusTrack('Communication Mastery');
      else if (savedTrack === 'wordpower') setFocusTrack('Word Power Builder');
      else if (savedTrack === 'career') setFocusTrack('Career Readiness');
      else setFocusTrack('Communication Mastery');
    } catch (e) { setFocusTrack('Communication Mastery'); }
  };

  const loadLicenseStatus = async () => {
    try {
      const activated = await AsyncStorage.getItem('@is_activated');
      setIsPro(activated === 'true');
    } catch (e) { setIsPro(false); }
  };

  const fetchStreams = async () => {
    try {
      const response = await fetch(STREAM_URL);
      const json = await response.json();
      if (json.categories) setStreamData(json.categories);
    } catch (e) { Alert.alert('Connection Error', 'Unable to load streams.'); }
    finally { setLoading(false); }
  };

  const handleRouteNavigation = (screenName) => {
    if (isPro) {
      navigation.navigate(screenName);
    } else {
      Alert.alert('Feature Locked', 'Premium license required.', [
  { text: 'Cancel', style: 'cancel' },
  { text: 'Activate', onPress: () => navigation.replace('Activation') }
  ]);
    }
  };

  const handleStreamPress = async (item) => {
    if (item.type === 'internal') navigation.navigate(item.url.replace('internal://', ''));
    else if (['video', 'pdf', 'web'].includes(item.type)) navigation.navigate('WebScreen', { url: item.url });
    else if (['audio', 'link'].includes(item.type)) {
      const supported = await Linking.canOpenURL(item.url);
      if (supported) await Linking.openURL(item.url);
      else Alert.alert("Error", "Cannot open this link.");
    }
  };

  const SkillButton = ({ title, icon, screen }) => (
    <TouchableOpacity style={styles.skillCard} activeOpacity={0.85} onPress={() => handleRouteNavigation(screen)}>
      <View style={styles.skillIconWrap}><Ionicons name={icon} size={22} color={ACE_BLUE} /></View>
      <Text style={styles.skillTitle}>{title}</Text>
      {!isPro && <View style={styles.lockBadge}><Ionicons name="lock-closed" size={11} color="#EF4444" /></View>}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent />
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.brandTitle}>ACE English</Text>
            <Text style={styles.brandTagline}>Mastery | Grammar • Speaking • Vocabulary</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={() => setSupportVisible(true)} style={{ marginRight: 15 }}>
              <Ionicons name="help-circle-outline" size={26} color={ACE_BLUE} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
              <Ionicons name="settings-outline" size={24} color={ACE_BLUE} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.focusCard}>
          <View style={styles.focusLeft}>
            <View style={styles.focusIconWrap}><Ionicons name="compass" size={20} color={ACE_BLUE} /></View>
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={styles.focusLabel}>CURRENT FOCUS TRACK</Text>
              <Text style={styles.focusTitle}>{focusTrack}</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionBlock}>
          <Text style={styles.sectionLabel}>CORE SKILLS</Text>
          <View style={styles.skillsRow}>
            <SkillButton title="Grammar" icon="book-outline" screen="Grammar" />
            <SkillButton title="Speaking" icon="mic-outline" screen="Speaking" />
            <SkillButton title="Word Power" icon="library-outline" screen="Vocabulary" />
          </View>
        </View>

        {loading ? <ActivityIndicator size="large" color={ACE_BLUE} style={{ marginTop: 40 }} /> : (
          streamData.map((category, index) => (
            <View style={styles.sectionBlock} key={index}>
              <Text style={styles.sectionLabel}>{category.headingTitle.toUpperCase()}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollPadding}>
                {category.items.map((item) => (
                  <TouchableOpacity key={item.id} activeOpacity={0.85} style={[styles.streamCard, { backgroundColor: item.accentBg || '#F8FAFC' }]} onPress={() => handleStreamPress(item)}>
                    <View style={styles.streamTop}>
                      <View style={styles.streamIconCircle}><Ionicons name={item.iconName || 'apps-outline'} size={18} color={ACE_BLUE} /></View>
                    </View>
                    <View style={styles.streamBottom}>
                      <Text numberOfLines={2} style={styles.streamTitle}>{item.title}</Text>
                      <View style={styles.actionRow}>
                        <Text style={styles.streamAction}>OPEN</Text>
                        <Ionicons name="arrow-forward" size={12} color={ACE_BLUE} />
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          ))
        )}

        <TouchableOpacity style={styles.inquireButton} onPress={() => setInquiryVisible(true)}>
          <Text style={styles.inquireButtonText}>Inquire Now</Text>
        </TouchableOpacity>
      </ScrollView>

      <SupportHubModal visible={supportVisible} onClose={() => setSupportVisible(false)} />
      <InquiryModal visible={inquiryVisible} onClose={() => setInquiryVisible(false)} student={student} setStudent={setStudent} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContainer: { paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? 50 : 20, paddingBottom: 40 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerActions: { flexDirection: 'row' },
  brandTitle: { fontSize: 26, fontWeight: '800', color: ACE_BLUE },
  brandTagline: { fontSize: 13, color: '#64748B', fontWeight: '700', marginTop: 2 },
  focusCard: { backgroundColor: '#F0F7FF', padding: 16, borderRadius: 16, marginTop: 28, borderWidth: 1, borderColor: '#D0E4FF' },
  focusLeft: { flexDirection: 'row', alignItems: 'center' },
  focusIconWrap: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' },
  focusLabel: { fontSize: 10, fontWeight: '800', color: '#475569' },
  focusTitle: { fontSize: 15, fontWeight: '800', color: '#0F4C81', marginTop: 2 },
  sectionBlock: { marginTop: 28 },
  sectionLabel: { fontSize: 11, fontWeight: '900', color: '#94A3B8', marginBottom: 14 },
  skillsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  skillCard: { backgroundColor: '#FFFFFF', width: (width - 64) / 3, paddingVertical: 18, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0', elevation: 2 },
  skillIconWrap: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#F0F7FF', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  skillTitle: { fontSize: 13, fontWeight: '800', color: '#1E293B' },
  lockBadge: { position: 'absolute', top: 8, right: 8, backgroundColor: '#FEF2F2', padding: 3, borderRadius: 6, borderWidth: 0.5, borderColor: '#FCA5A5' },
  horizontalScrollPadding: { paddingRight: 20 },
  streamCard: { width: 130, height: 145, borderRadius: 16, padding: 14, marginRight: 12, justifyContent: 'space-between', borderWidth: 1, borderColor: '#E2E8F0' },
  streamTitle: { fontSize: 13, fontWeight: '800', color: '#1E293B', marginTop: 10 },
  streamAction: { fontSize: 11, fontWeight: '900', color: ACE_BLUE, marginRight: 4 },
  actionRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  inquireButton: { backgroundColor: ACE_BLUE, paddingVertical: 18, borderRadius: 30, alignItems: 'center', marginTop: 40 },
  inquireButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }
});
