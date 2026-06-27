import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Linking,
  StatusBar,
  Platform,
  Dimensions,
  PixelRatio,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const scale = SCREEN_WIDTH / 375;

const ACE_BLUE = '#0F4C81';

export function normalize(size) {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

const FOCUS_TRACKS = [
  {
    id: 'communication',
    title: 'Communication Mastery',
    icon: 'chatbubble-outline',
  },
  {
    id: 'wordpower',
    title: 'Word Power Builder',
    icon: 'library-outline',
  },
  {
    id: 'career',
    title: 'Career Readiness',
    icon: 'briefcase-outline',
  },
];

export default function SettingsScreen({ navigation }) {

  const {
    isActivated,
    activationInfo,
    deactivateLicense,
  } = useAuth();

  const [selectedTrack, setSelectedTrack] =
    useState('communication');

  const userName =
    activationInfo.fullName || 'Learner';

  const licenseKey =
    activationInfo.licenseKey || 'N/A';

  useEffect(() => {
    loadFocusTrack();
  }, []);

  const loadFocusTrack = async () => {
    try {
      const track =
        await AsyncStorage.getItem(
          '@user_focus_track'
        );

      if (track) {
        setSelectedTrack(track);
      }
    } catch {}
  };

  const updateFocusTrack = async (id) => {
    setSelectedTrack(id);

    await AsyncStorage.setItem(
      '@user_focus_track',
      id
    );
  };

  const handleSupport = (type) => {

    const phone = '+919074887447';

    if (type === 'whatsapp') {

      Linking.openURL(
        `https://wa.me/${phone.replace('+', '')}`
      );

    } else if (type === 'call') {

      Linking.openURL(`tel:${phone}`);

    } else {

      Linking.openURL(
        'mailto:ace.careerdesk@gmail.com'
      );

    }

  };

  const handleDeactivate = () => {

    Alert.alert(
      'Deactivate License',
      'This will remove Premium activation from this device.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Deactivate',
          style: 'destructive',
          onPress: async () => {

            const result =
              await deactivateLicense();

            if (result.success) {

              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: 'Activation',
                  },
                ],
              });

            } else {

              Alert.alert(
                'Error',
                result.message ||
                  'Unable to deactivate.'
              );

            }

          },
        },
      ]
    );

  };
    return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
      />

      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={ACE_BLUE}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Settings
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        <View style={styles.profileBox}>

          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {userName.charAt(0).toUpperCase()}
            </Text>
          </View>

          <Text style={styles.userNameText}>
            {userName}
          </Text>

        </View>

        <View style={styles.card}>

          <Text style={styles.sectionHeading}>
            LICENSE DETAILS
          </Text>

          <Text style={styles.label}>
            Status : {isActivated ? 'Activated' : 'Not Activated'}
          </Text>

          <Text style={styles.label}>
            Key : {licenseKey}
          </Text>

          {isActivated && (
            <TouchableOpacity
              style={styles.deactivateBtn}
              onPress={handleDeactivate}
            >
              <Text style={styles.btnText}>
                Deactivate Device
              </Text>
            </TouchableOpacity>
          )}

        </View>

        <View style={styles.card}>

          <Text style={styles.sectionHeading}>
            SELECT FOCUS TRACK
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.pillScrollContainer}
          >

            {FOCUS_TRACKS.map((track) => (

              <TouchableOpacity
                key={track.id}
                style={[
                  styles.pill,
                  selectedTrack === track.id &&
                    styles.activePill,
                ]}
                onPress={() =>
                  updateFocusTrack(track.id)
                }
              >

                <Ionicons
                  name={track.icon}
                  size={15}
                  color={
                    selectedTrack === track.id
                      ? '#FFFFFF'
                      : '#334155'
                  }
                  style={{ marginRight: 6 }}
                />

                <Text
                  style={[
                    styles.pillText,
                    selectedTrack === track.id &&
                      styles.activePillText,
                  ]}
                >
                  {track.title}
                </Text>

              </TouchableOpacity>

            ))}

          </ScrollView>

        </View>

        <View style={styles.card}>

          <Text style={styles.sectionHeading}>
            SUPPORT
          </Text>

          <View style={styles.supportRow}>

            <TouchableOpacity
              style={styles.supportBtn}
              onPress={() =>
                handleSupport('whatsapp')
              }
            >
              <Ionicons
                name="logo-whatsapp"
                size={24}
                color="#25D366"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.supportBtn}
              onPress={() =>
                handleSupport('call')
              }
            >
              <Ionicons
                name="call"
                size={24}
                color={ACE_BLUE}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.supportBtn}
              onPress={() =>
                handleSupport('email')
              }
            >
              <Ionicons
                name="mail"
                size={24}
                color="#EA4335"
              />
            </TouchableOpacity>

          </View>

        </View>

        <TouchableOpacity
          style={styles.row}
          onPress={() =>
            navigation.navigate(
              'WebScreen',
              {
                title: 'Privacy Policy',
                url: 'https://gist.githubusercontent.com/Meritto010/106fe9eed279743481b47dd0dc548bfe/raw/024f52e035c0860b37473e5bc7e32606023a1ea6/privacy-policy.md',
              }
            )
          }
        >

          <Text style={styles.rowText}>
            Privacy Policy
          </Text>

        </TouchableOpacity>

        <TouchableOpacity
          style={styles.row}
          onPress={() =>
            navigation.navigate(
              'WebScreen',
              {
                title: 'Terms of Service',
                url: 'https://gist.githubusercontent.com/Meritto010/8f44e03d9d4d8c5eb0033d2e12f50900/raw/c71e80fab781e7336b62284beb13d8870bb99b2c/terms-of-service.md',
              }
            )
          }
        >

          <Text style={styles.rowText}>
            Terms of Service
          </Text>

        </TouchableOpacity>

      </ScrollView>

    </SafeAreaView>
  );
  const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(16),
    marginTop:
      Platform.OS === 'android'
        ? (StatusBar.currentHeight || 0) + normalize(10)
        : normalize(20),
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },

  backButton: {
    marginRight: normalize(16),
  },

  headerTitle: {
    fontSize: normalize(20),
    fontWeight: '800',
    color: ACE_BLUE,
  },

  scrollContent: {
    paddingHorizontal: normalize(20),
    paddingTop: normalize(20),
    paddingBottom: normalize(60),
  },

  profileBox: {
    alignItems: 'center',
    marginBottom: normalize(24),
  },

  avatarCircle: {
    width: normalize(72),
    height: normalize(72),
    borderRadius: normalize(36),
    backgroundColor: ACE_BLUE,
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    color: '#FFFFFF',
    fontSize: normalize(28),
    fontWeight: '800',
  },

  userNameText: {
    marginTop: normalize(12),
    fontSize: normalize(18),
    fontWeight: '700',
    color: '#1E293B',
  },

  card: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: normalize(16),
    marginBottom: normalize(18),
  },

  sectionHeading: {
    fontSize: normalize(11),
    fontWeight: '800',
    color: '#64748B',
    marginBottom: normalize(14),
    letterSpacing: 0.5,
  },

  label: {
    fontSize: normalize(14),
    color: '#1E293B',
    fontWeight: '600',
    marginBottom: normalize(8),
  },

  deactivateBtn: {
    marginTop: normalize(14),
    backgroundColor: '#DC2626',
    borderRadius: 12,
    paddingVertical: normalize(13),
    alignItems: 'center',
  },

  btnText: {
    color: '#FFFFFF',
    fontSize: normalize(14),
    fontWeight: '800',
  },

  pillScrollContainer: {
    paddingRight: normalize(20),
  },

  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E2E8F0',
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(10),
    borderRadius: 24,
    marginRight: normalize(10),
  },

  activePill: {
    backgroundColor: ACE_BLUE,
  },

  pillText: {
    color: '#334155',
    fontSize: normalize(13),
    fontWeight: '700',
  },

  activePillText: {
    color: '#FFFFFF',
  },

  supportRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: normalize(8),
  },

  supportBtn: {
    width: normalize(56),
    height: normalize(56),
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  row: {
    paddingVertical: normalize(18),
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },

  rowText: {
    fontSize: normalize(15),
    color: '#334155',
    fontWeight: '600',
  },

});