import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, SafeAreaView, Linking, StatusBar, Platform, Dimensions, PixelRatio } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native'; // Added import for robust navigation reset

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = SCREEN_WIDTH / 375;
const ACE_BLUE = '#0F4C81';

export function normalize(size) {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

const FOCUS_TRACKS = [
  { id: 'communication', title: 'Communication Mastery', icon: 'chatbubble-outline' },
  { id: 'wordpower', title: 'Word Power Builder', icon: 'library-outline' },
  { id: 'career', title: 'Career Readiness', icon: 'briefcase-outline' }
];

export default function SettingsScreen({ navigation }) {
  const [licenseKey, setLicenseKey] = useState("N/A");
  const [userName, setUserName] = useState("Learner");
  const [selectedTrack, setSelectedTrack] = useState('communication');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const name = await AsyncStorage.getItem('@user_name');
    const key = await AsyncStorage.getItem('@activated_license');
    const track = await AsyncStorage.getItem('@user_focus_track');

    if (name) setUserName(name);
    if (key) setLicenseKey(key);
    if (track) setSelectedTrack(track);
  };

  const handleSupport = (type) => {
    const phone = '+919074887447';
    if (type === 'whatsapp') Linking.openURL(`https://wa.me/${phone.replace('+', '')}`);
    else if (type === 'email') Linking.openURL('mailto:ace.careerdesk@gmail.com');
    else if (type === 'call') Linking.openURL(`tel:${phone}`);
  };

  const handleDeactivate = async () => {
    Alert.alert(
      "Deactivate License",
      "This will remove the license from this device. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Deactivate",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.multiRemove(['@is_activated', '@activated_license', '@user_name', '@user_phone', '@account_type']);
            // Robust reset for cross-platform (native & web)
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'Activation' }],
              })
            );
          },
        },
      ]
    );
  };

  const updateFocusTrack = async (id) => {
    setSelectedTrack(id);
    await AsyncStorage.setItem('@user_focus_track', id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={ACE_BLUE} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileBox}>
          <View style={styles.avatarCircle}><Text style={styles.avatarText}>{userName.charAt(0).toUpperCase()}</Text></View>
          <Text style={styles.userNameText}>{userName}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionHeading}>LICENSE DETAILS</Text>
          <Text style={styles.label}>KEY: {licenseKey}</Text>
          <TouchableOpacity style={styles.deactivateBtn} onPress={handleDeactivate}>
            <Text style={styles.btnText}>Deactivate Device</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionHeading}>SELECT FOCUS PILLAR</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillScrollContainer}>
            {FOCUS_TRACKS.map((t) => (
              <TouchableOpacity key={t.id} style={[styles.pill, selectedTrack === t.id && styles.activePill]} onPress={() => updateFocusTrack(t.id)}>
                <Ionicons name={t.icon} size={normalize(14)} color={selectedTrack === t.id ? '#FFF' : '#334155'} style={{ marginRight: 6 }} />
                <Text style={[styles.pillText, selectedTrack === t.id && styles.activePillText]}>{t.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionHeading}>SUPPORT HUB</Text>
          <View style={styles.supportRow}>
            <TouchableOpacity style={styles.supportBtn} onPress={() => handleSupport('whatsapp')}><Ionicons name="logo-whatsapp" size={24} color="#25D366" /></TouchableOpacity>
            <TouchableOpacity style={styles.supportBtn} onPress={() => handleSupport('call')}><Ionicons name="call" size={24} color={ACE_BLUE} /></TouchableOpacity>
            <TouchableOpacity style={styles.supportBtn} onPress={() => handleSupport('email')}><Ionicons name="mail" size={24} color="#EA4335" /></TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('WebScreen', { url: 'https://gist.githubusercontent.com/Meritto010/106fe9eed279743481b47dd0dc548bfe/raw/024f52e035c0860b37473e5bc7e32606023a1ea6/privacy-policy.md' })}>
          <Text style={styles.rowText}>Privacy Policy & Terms</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  headerRow: { flexDirection: 'row', alignItems: 'center', padding: normalize(20), borderBottomWidth: 1, borderColor: '#EEE' },
  backButton: { marginRight: 15 },
  headerTitle: { fontSize: normalize(20), fontWeight: 'bold', color: ACE_BLUE },
  scrollContent: { padding: normalize(20), paddingBottom: normalize(50) },
  profileBox: { alignItems: 'center', marginBottom: normalize(20) },
  avatarCircle: { width: normalize(70), height: normalize(70), borderRadius: normalize(35), backgroundColor: ACE_BLUE, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#FFF', fontSize: normalize(24), fontWeight: 'bold' },
  userNameText: { fontSize: normalize(18), fontWeight: 'bold', marginTop: 10 },
  card: { backgroundColor: '#F8F9FA', padding: normalize(16), borderRadius: 12, marginBottom: normalize(16), borderWidth: 1, borderColor: '#E8EAED' },
  sectionHeading: { fontSize: normalize(11), fontWeight: '800', color: '#5F6368', marginBottom: 10 },
  label: { fontSize: normalize(14), fontWeight: '600', color: '#202124', marginBottom: 10 },
  deactivateBtn: { backgroundColor: '#EA4335', padding: normalize(10), borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#FFF', fontWeight: 'bold' },
  pillScrollContainer: { paddingRight: 20 },
  pill: { flexDirection: 'row', alignItems: 'center', paddingVertical: normalize(10), paddingHorizontal: normalize(16), borderRadius: 20, backgroundColor: '#E8EAED', marginRight: 10 },
  activePill: { backgroundColor: ACE_BLUE },
  pillText: { fontSize: normalize(13), fontWeight: '700', color: '#334155' },
  activePillText: { color: '#FFF' },
  supportRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 },
  supportBtn: { padding: 10, backgroundColor: '#FFF', borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  row: { paddingVertical: normalize(15), borderBottomWidth: 1, borderColor: '#EEE' },
  rowText: { fontSize: normalize(15), color: '#3C4043' }
});
