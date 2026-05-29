import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Linking,
  Platform,
  LayoutAnimation,
  UIManager,
  StatusBar,
  Dimensions,
  PixelRatio
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = SCREEN_WIDTH / 375;
const ACE_BLUE = '#0F4C81';

export function normalize(size) {
  const newSize = size * scale;
  const roundedSize = Math.round(PixelRatio.roundToNearestPixel(newSize));
  return Platform.OS === 'ios' ? roundedSize : roundedSize - 2;
}

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// ✅ FIXED MATCHING STRINGS WITH DASHBOARD LIFECYCLE
const FOCUS_TRACKS = [
  { id: 'communication', title: 'Communication Mastery', icon: 'chatbubbles-outline', color: '#0F4C81' },
  { id: 'wordpower', title: 'Word Power Builder', icon: 'book-outline', color: '#8B5CF6' },
  { id: 'career', title: 'Career Readiness', icon: 'briefcase-outline', color: '#10B981' }
];

export default function SettingsScreen({ navigation }) {
  const [isPro, setIsPro] = useState(false);
  const [licenseKey, setLicenseKey] = useState("");
  const [userName, setUserName] = useState("Student");
  const [selectedTrack, setSelectedTrack] = useState('communication');
  const [trackExpanded, setTrackExpanded] = useState(false);

  const PRIVACY_URL = 'https://gist.githubusercontent.com/Meritto010/106fe9eed279743481b47dd0dc548bfe/raw/024f52e035c0860b37473e5bc7e32606023a1ea6/privacy-policy.md';
  const TERMS_URL = 'https://gist.githubusercontent.com/Meritto010/8f44e03d9d4d8c5eb0033d2e12f50900/raw/c71e80fab781e7336b62284beb13d8870bb99b2c/terms-of-service.md';

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const proStatus = await AsyncStorage.getItem('@is_activated');
      const key = await AsyncStorage.getItem('@activated_license');
      const name = await AsyncStorage.getItem('@user_name');
      const track = await AsyncStorage.getItem('@user_focus_track');

      if (proStatus === 'true') setIsPro(true);
      if (key) setLicenseKey(key);
      if (name) setUserName(name);
      if (track) setSelectedTrack(track);
    } catch (e) {
      console.log("Failed to load settings data.");
    }
  };

  const selectTrack = async (trackId) => {
    try {
      await AsyncStorage.setItem('@user_focus_track', trackId);
      setSelectedTrack(trackId);
      toggleExpand();
      Alert.alert("Track Updated", "Your focus track has been successfully saved.");
    } catch (e) {
      Alert.alert("Error", "Could not save your preference.");
    }
  };

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTrackExpanded(!trackExpanded);
  };

  const handleSupportClick = () => {
    const phone = '919074887447';
    const url = `https://wa.me/${phone}?text=Hi ACE Support, I am reaching out from my Settings screen for assistance.`;
    Linking.openURL(url).catch(() => Alert.alert('Error', 'WhatsApp not installed.'));
  };

  const handleResetLicense = () => {
    Alert.alert(
      "Deactivate App",
      "Are you sure you want to remove the current license validation key from this handset device?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Deactivate",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert("Deactivated", "App has been reset. Please relaunch application.", [
                { text: "OK", onPress: () => navigation.replace('Activation') }
              ]);
            } catch (e) {
              Alert.alert("Error", "Failed to clear license profile registry.");
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={true} />
      
      {/* 🌟 SAFE SPACED TOP HEADER SECTION */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.screenHeaderTitle}>Settings</Text>
        <View style={{ width: 40 }} /> 
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.profileBox}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{userName.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.userNameText}>{userName}</Text>
          <View style={[styles.badgeContainer, { backgroundColor: isPro ? '#ECFDF5' : '#F1F5F9' }]}>
            <Ionicons name={isPro ? "shield-checkmark" : "lock-closed"} size={14} color={isPro ? '#10B981' : '#64748B'} />
            <Text style={[styles.badgeText, { color: isPro ? '#047857' : '#475569' }]}>
              {isPro ? "PREMIUM ACTIVE" : "FREE ACCESS"}
            </Text>
          </View>
        </View>

        {isPro && (
          <View style={styles.card}>
            <Text style={styles.sectionHeading}>LICENSE DETAILS</Text>
            <View style={{ marginTop: 4 }}>
              <Text style={styles.licenseLabel}>REGISTERED SECURITY KEY</Text>
              <Text style={styles.licenseKey}>{licenseKey}</Text>
            </View>
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.sectionHeading}>PERSONALIZATION</Text>
          
          <TouchableOpacity style={styles.row} onPress={toggleExpand} activeOpacity={0.7}>
            <View style={[styles.iconContainer, { backgroundColor: '#F0F7FF' }]}>
              <Ionicons name="compass-outline" size={18} color={ACE_BLUE} />
            </View>
            <View style={styles.rowContent}>
              <Text style={styles.rowText}>Focus Track</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.rowValue}>
                  {FOCUS_TRACKS.find(t => t.id === selectedTrack)?.title || "Select"}
                </Text>
                <Ionicons name={trackExpanded ? "chevron-up" : "chevron-down"} size={16} color="#94A3B8" style={{ marginLeft: 6 }} />
              </View>
            </View>
          </TouchableOpacity>

          {trackExpanded && (
            <View style={{ marginTop: 10 }}>
              {FOCUS_TRACKS.map((track) => {
                const isSelected = selectedTrack === track.id;
                return (
                  <TouchableOpacity
                    key={track.id}
                    style={[styles.trackCard, isSelected && styles.trackCardSelected]}
                    onPress={() => selectTrack(track.id)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name={track.icon} size={18} color={isSelected ? ACE_BLUE : '#64748B'} />
                    <Text style={[styles.trackCardText, isSelected && styles.trackCardTextSelected]}>
                      {track.title}
                    </Text>
                    {isSelected && <Ionicons name="checkmark-circle" size={18} color={ACE_BLUE} style={{ marginLeft: 'auto' }} />}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionHeading}>LEGAL & SUPPORT</Text>
          
          <TouchableOpacity style={styles.row} onPress={() => Linking.openURL(PRIVACY_URL)}>
            <View style={[styles.iconContainer, { backgroundColor: '#F0FDF4' }]}>
              <Ionicons name="document-text-outline" size={18} color="#16A34A" />
            </View>
            <View style={styles.rowContent}>
              <Text style={styles.rowText}>Privacy Policy</Text>
              <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.row} onPress={() => Linking.openURL(TERMS_URL)}>
            <View style={[styles.iconContainer, { backgroundColor: '#FEF2F2' }]}>
              <Ionicons name="shield-half-outline" size={18} color="#EF4444" />
            </View>
            <View style={styles.rowContent}>
              <Text style={styles.rowText}>Terms of Service</Text>
              <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.row} onPress={handleSupportClick}>
            <View style={[styles.iconContainer, { backgroundColor: '#FDF4FF' }]}>
              <Ionicons name="logo-whatsapp" size={18} color="#D946EF" />
            </View>
            <View style={styles.rowContent}>
              <Text style={styles.rowText}>Help & Support Hub</Text>
              <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionHeading}>SYSTEM</Text>
          <TouchableOpacity style={styles.row} onPress={handleResetLicense} activeOpacity={0.7}>
            <View style={[styles.iconContainer, { backgroundColor: '#FFF5F5' }]}>
              <Ionicons name="power" size={18} color="#DC2626" />
            </View>
            <View style={styles.rowContent}>
              <Text style={[styles.rowText, { color: '#DC2626' }]}>Deactivate Device Key</Text>
              <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
            </View>
          </TouchableOpacity>
        </View>

        <Text style={styles.versionText}>Version 1.0.0 (Build 54)</Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFFFFF' 
  },
  // 🌟 FIX: Balanced Header alignment pushing content below the top safe status bar space natively
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(16),
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + normalize(12) : normalize(12),
    paddingBottom: normalize(12),
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
    backgroundColor: '#FFFFFF'
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  screenHeaderTitle: {
    fontSize: normalize(18),
    fontWeight: '900',
    color: '#1E293B'
  },
  scrollContent: { 
    paddingHorizontal: normalize(20), 
    paddingTop: normalize(16),
    paddingBottom: normalize(40) // Balanced room at the bottom
  },
  profileBox: { 
    alignItems: 'center', 
    marginVertical: normalize(16) 
  },
  avatarCircle: { 
    width: normalize(68), 
    height: normalize(68), 
    borderRadius: normalize(34), 
    backgroundColor: '#F0F7FF', 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#E2E8F0', 
    marginBottom: normalize(10) 
  },
  avatarText: { 
    fontSize: normalize(24), 
    fontWeight: '900', 
    color: ACE_BLUE 
  },
  userNameText: { 
    fontSize: normalize(18), 
    fontWeight: '800', 
    color: '#1E293B' 
  },
  badgeContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 12, 
    paddingVertical: 5, 
    borderRadius: 20, 
    marginTop: 8 
  },
  badgeText: { 
    fontSize: normalize(10), 
    fontWeight: '800', 
    marginLeft: 5, 
    letterSpacing: 0.5 
  },
  card: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 16, 
    padding: 16, 
    marginBottom: 14, 
    borderWidth: 1, 
    borderColor: '#E2E8F0' 
  },
  sectionHeading: { 
    fontSize: normalize(11), 
    fontWeight: '900', 
    color: '#94A3B8', 
    letterSpacing: 0.8, 
    marginBottom: 6 
  },
  licenseLabel: { 
    fontSize: normalize(10), 
    fontWeight: '800', 
    color: '#64748B', 
    marginTop: 6, 
    letterSpacing: 0.5 
  },
  licenseKey: { 
    fontSize: normalize(13), 
    fontWeight: '800', 
    color: ACE_BLUE, 
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', 
    marginTop: 4, 
    backgroundColor: '#F8FAFC', 
    padding: 10, 
    borderRadius: 8, 
    borderWidth: 1, 
    borderColor: '#E2E8F0', 
    textAlign: 'center' 
  },
  row: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 12 
  },
  iconContainer: { 
    width: normalize(34), 
    height: normalize(34), 
    borderRadius: normalize(10), 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 12 
  },
  rowContent: { 
    flex: 1, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  rowText: { 
    fontSize: normalize(13), 
    fontWeight: '700', 
    color: '#334155' 
  },
  rowValue: { 
    fontSize: normalize(12), 
    color: '#64748B', 
    fontWeight: '700' 
  },
  trackCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F8FAFC', 
    padding: 12, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#E2E8F0', 
    marginBottom: 8 
  },
  trackCardSelected: { 
    borderColor: ACE_BLUE, 
    backgroundColor: '#F0F7FF' 
  },
  trackCardText: { 
    fontSize: normalize(12), 
    fontWeight: '700', 
    color: '#475569', 
    marginLeft: 10 
  },
  trackCardTextSelected: { 
    color: ACE_BLUE, 
    fontWeight: '800' 
  },
  versionText: { 
    textAlign: 'center', 
    fontSize: normalize(11), 
    color: '#94A3B8', 
    fontWeight: '700', 
    marginTop: 10, 
    marginBottom: 10 
  }
});
