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
import { useNavigation, CommonActions } from '@react-navigation/native';
import SupportHubModal from '../components/SupportHubModal';

const { width } = Dimensions.get('window');
const ACE_BLUE = '#0F4C81';
const STREAM_URL = 'https://raw.githubusercontent.com/Meritto010/media_stream/main/media_stream.json';

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

  const loadFocusTrack = async () => {
    try {
      const savedTrack = await AsyncStorage.getItem('@user_focus_track');
      if (savedTrack === 'communication') setFocusTrack('Communication Mastery');
      else if (savedTrack === 'wordpower') setFocusTrack('Word Power Builder');
      else if (savedTrack === 'career') setFocusTrack('Career Readiness');
      else setFocusTrack('Communication Mastery');
    } catch (e) {
      setFocusTrack('Communication Mastery');
    }
  };

  const loadLicenseStatus = async () => {
    try {
      const activated = await AsyncStorage.getItem('@is_activated');
      if (activated === 'true') {
        setIsPro(true);
      } else {
        setIsPro(false);
      }
    } catch (e) {
      setIsPro(false);
    }
  };

  const fetchStreams = async () => {
    try {
      const response = await fetch(STREAM_URL);
      const json = await response.json();
      if (json.categories) setStreamData(json.categories);
    } catch (e) {
      Alert.alert('Connection Error', 'Unable to load learning streams.');
    } finally {
      setLoading(false);
    }
  };

  const handleRouteNavigation = (screenName) => {
    if (isPro) {
      navigation.navigate(screenName);
    } else {
      Alert.alert(
        'Feature Locked 🔒',
        'This module requires an active premium license. Would you like to activate premium now?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Activate License', 
            onPress: () => {
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'Activation' }],
                })
              );
            }
          }
        ]
      );
    }
  };

  const SkillButton = ({ title, icon, screen }) => (
    <TouchableOpacity
      style={styles.skillCard}
      activeOpacity={0.85}
      onPress={() => handleRouteNavigation(screen)}
    >
      <View style={styles.skillIconWrap}>
        <Ionicons name={icon} size={22} color={ACE_BLUE} />
      </View>
      <Text style={styles.skillTitle}>{title}</Text>
      {!isPro && (
        <View style={styles.lockBadge}>
          <Ionicons name="lock-closed" size={11} color="#EF4444" />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={true} />
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Header Row */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.brandTitle}>ACE</Text>
            <Text style={styles.brandTagline}>Master Skills | Build Confidence</Text>
          </View>
          <TouchableOpacity style={styles.settingsBtn} onPress={() => navigation.navigate('Settings')}>
            <Ionicons name="settings-outline" size={24} color={ACE_BLUE} />
          </TouchableOpacity>
        </View>

        {/* Current Focus Track Card */}
        <View style={styles.focusCard}>
          <View style={styles.focusLeft}>
            <View style={styles.focusIconWrap}>
              <Ionicons name="compass" size={20} color={ACE_BLUE} />
            </View>
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={styles.focusLabel}>CURRENT FOCUS TRACK</Text>
              <Text style={styles.focusTitle}>{focusTrack}</Text>
            </View>
          </View>
        </View>

        {/* Skills Grid Section */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionLabel}>CORE SKILLS</Text>
          <View style={styles.skillsRow}>
            <SkillButton title="Grammar" icon="book-outline" screen="Grammar" />
            <SkillButton title="Speaking" icon="mic-outline" screen="Speaking" />
            <SkillButton title="Word Power" icon="library-outline" screen="Vocabulary" />
          </View>
        </View>

        {/* Dynamic Media Streams */}
        {loading ? (
          <ActivityIndicator size="large" color={ACE_BLUE} style={{ marginTop: 40 }} />
        ) : (
          streamData.map((category, index) => (
            <View style={styles.sectionBlock} key={index}>
              <Text style={styles.sectionLabel}>{category.headingTitle.toUpperCase()}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollPadding}>
                {category.items.map((item) => (
                  <TouchableOpacity 
                    key={item.id} 
                    activeOpacity={0.85} 
                    style={[styles.streamCard, { backgroundColor: item.accentBg || '#F8FAFC' }]}
                    onPress={() => Linking.openURL(item.targetUrl).catch(() => Alert.alert('Error', 'Invalid link.'))}
                  >
                    <View style={styles.streamTop}>
                      <View style={styles.streamIconCircle}>
                        <Ionicons name={item.iconName || 'apps-outline'} size={18} color={ACE_BLUE} />
                      </View>
                    </View>
                    <View style={styles.streamBottom}>
                      <Text numberOfLines={2} style={styles.streamTitle}>{item.title}</Text>
                      <View style={styles.actionRow}>
                        <Text style={styles.streamAction}>{item.actionLabel || 'OPEN'}</Text>
                        <Ionicons name="arrow-forward" size={12} color={ACE_BLUE} />
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          ))
        )}

        {/* Support Button Footer */}
        <TouchableOpacity style={styles.supportBtn} activeOpacity={0.85} onPress={() => setSupportVisible(true)}>
          <Ionicons name="help-circle-outline" size={20} color="#FFF" />
          <Text style={styles.supportText}>Open Support Hub</Text>
        </TouchableOpacity>

      </ScrollView>
      <SupportHubModal visible={supportVisible} onClose={() => setSupportVisible(false)} isPro={isPro} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFFFFF' 
  },
  scrollContainer: { 
    paddingHorizontal: 20, 
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 16 : 20, 
    paddingBottom: 40 
  },
  headerRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 4
  },
  brandTitle: { 
    fontSize: 28, 
    fontWeight: '900', 
    color: ACE_BLUE,
    letterSpacing: 0.5
  },
  brandTagline: { 
    fontSize: 13, 
    color: '#64748B', 
    fontWeight: '700',
    marginTop: 2
  },
  settingsBtn: { 
    padding: 6,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  focusCard: { 
    backgroundColor: '#F0F7FF', // Light corporate blue background tint
    padding: 16, 
    borderRadius: 16, 
    marginTop: 24, 
    borderWidth: 1, 
    borderColor: '#D0E4FF' 
  },
  focusLeft: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  focusIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D0E4FF'
  },
  focusLabel: { 
    fontSize: 10, 
    fontWeight: '800', 
    color: '#475569', 
    letterSpacing: 0.8 
  },
  focusTitle: { 
    fontSize: 15, 
    fontWeight: '800', 
    color: '#0F4C81', // Highlight focus title using corporate identity color
    marginTop: 2 
  },
  sectionBlock: { 
    marginTop: 32 
  },
  sectionLabel: { 
    fontSize: 11, 
    fontWeight: '900', 
    color: '#94A3B8', 
    letterSpacing: 1.2, 
    marginBottom: 14 
  },
  skillsRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between' 
  },
  skillCard: { 
    backgroundColor: '#FFFFFF', 
    width: (width - 64) / 3, // Balanced perfectly to fit edge limits smoothly
    paddingVertical: 18, 
    borderRadius: 16, 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#E2E8F0', 
    position: 'relative', 
    // Subtle design shadow for card elevation elevation
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2 
  },
  skillIconWrap: { 
    width: 44, 
    height: 44, 
    borderRadius: 12, 
    backgroundColor: '#F0F7FF', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 10 
  },
  skillTitle: { 
    fontSize: 12, 
    fontWeight: '800', 
    color: '#1E293B' 
  },
  lockBadge: { 
    position: 'absolute', 
    top: 8, 
    right: 8, 
    backgroundColor: '#FEF2F2', 
    padding: 3, 
    borderRadius: 6, 
    borderWidth: 0.5, 
    borderColor: '#FCA5A5' 
  },
  streamCard: { 
    width: 144, 
    height: 154, 
    borderRadius: 16, 
    padding: 14, 
    marginRight: 12, 
    justifyContent: 'space-between', 
    borderWidth: 1, 
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1
  },
  horizontalScrollPadding: {
    paddingRight: 8 
  },
  streamTop: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  streamIconCircle: { 
    width: 36, 
    height: 36, 
    borderRadius: 10, // Rounded-rect format looks more corporate than circles
    backgroundColor: '#FFFFFF', 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  streamBottom: { 
    marginTop: 8 
  },
  streamTitle: { 
    fontSize: 13, 
    fontWeight: '800', 
    color: '#1E293B', 
    lineHeight: 17, 
    height: 34 
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8
  },
  streamAction: { 
    fontSize: 11, 
    fontWeight: '900', 
    color: ACE_BLUE, 
    letterSpacing: 0.5,
    marginRight: 4
  },
  supportBtn: { 
    backgroundColor: ACE_BLUE, 
    flexDirection: 'row', 
    height: 54, 
    borderRadius: 16, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 44, 
    elevation: 2,
    shadowColor: ACE_BLUE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6
  },
  supportText: { 
    color: '#FFFFFF', 
    fontSize: 14, 
    fontWeight: '800', 
    marginLeft: 8 
  }
});
