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

  return Platform.OS === 'ios'
    ? roundedSize
    : roundedSize - 2;
}

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FOCUS_TRACKS = [
  {
    id: 'career_english',
    title: 'Career English',
    icon: 'briefcase-outline',
    color: '#0F4C81'
  },
  {
    id: 'interview_mastery',
    title: 'Interview Mastery',
    icon: 'people-outline',
    color: '#10B981'
  },
  {
    id: 'workplace_speaking',
    title: 'Workplace Speaking',
    icon: 'chatbubbles-outline',
    color: '#F59E0B'
  },
  {
    id: 'daily_word_power',
    title: 'Daily Word Power',
    icon: 'book-outline',
    color: '#8B5CF6'
  }
];

const SettingRow = ({
  icon,
  title,
  value,
  onPress,
  color = "#64748B",
  isLast = false
}) => (
  <TouchableOpacity
    style={[
      styles.row,
      isLast && { borderBottomWidth: 0 }
    ]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View
      style={[
        styles.iconContainer,
        { backgroundColor: color + '15' }
      ]}
    >
      <Ionicons
        name={icon}
        size={normalize(18)}
        color={color}
      />
    </View>

    <View style={styles.rowContent}>
      <Text style={styles.rowText}>{title}</Text>

      {value ? (
        <Text style={styles.rowValue}>{value}</Text>
      ) : null}
    </View>

    <Ionicons
      name="chevron-forward"
      size={normalize(16)}
      color="#CBD5E1"
    />
  </TouchableOpacity>
);

export default function SettingsScreen({ navigation }) {

  const [licenseKey, setLicenseKey] = useState("FREE USER");
  const [userName, setUserName] = useState("Learner");
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [expandedSection, setExpandedSection] = useState('license');

  useEffect(() => {
    loadUserData();
  }, []);

  // ✅ FIXED SAFE LOADER
  const loadUserData = async () => {
    try {
      const key = await AsyncStorage.getItem('@activated_license');
      const name = await AsyncStorage.getItem('@user_name');
      const track = await AsyncStorage.getItem('@user_focus_track');

      setLicenseKey(key ? key : "FREE USER");

      if (name) {
        const formattedName = name
          .trim()
          .split(' ')
          .map(word =>
            word.charAt(0).toUpperCase() +
            word.slice(1).toLowerCase()
          )
          .join(' ');

        setUserName(formattedName);
      }

      setSelectedTrack(track ? track : 'career_english');

    } catch (e) {
      console.log("Settings Load Error:", e);
      setLicenseKey("FREE USER");
      setUserName("Learner");
      setSelectedTrack('career_english');
    }
  };

  const toggleSection = (section) => {
    LayoutAnimation.configureNext(
      LayoutAnimation.Presets.easeInEaseOut
    );

    setExpandedSection(
      expandedSection === section ? null : section
    );
  };

  const selectFocusTrack = async (trackId) => {
    try {
      await AsyncStorage.setItem('@user_focus_track', trackId);
      setSelectedTrack(trackId);

      Alert.alert(
        "Focus Track Updated",
        "Your personalized dashboard track has been updated."
      );

    } catch (e) {
      Alert.alert(
        "Error",
        "Unable to update focus track."
      );
    }
  };

  const openWhatsApp = () => {
    const phone = '919074887447';

    const message = encodeURIComponent(
      'Hi ACE Support Team, I need help with my ACE Skills App.'
    );

    Linking.openURL(`https://wa.me/${phone}?text=${message}`)
      .catch(() => {
        Alert.alert("Error", "WhatsApp is not installed.");
      });
  };

  // ✅ FIXED LOGOUT (NO LICENSE REDIRECT)
  const performLogout = async () => {
    try {

      await AsyncStorage.multiRemove([
        '@is_activated',
        '@activated_license',
        '@user_name',
        '@user_focus_track'
      ]);

      // safe return to dashboard
      navigation.reset({
        index: 0,
        routes: [{ name: 'Dashboard' }]
      });

    } catch (e) {
      Alert.alert("Error", "Logout failed.");
    }
  };

  const AccordionSection = ({
    title,
    icon,
    sectionKey,
    iconColor,
    children
  }) => {

    const isOpen = expandedSection === sectionKey;

    return (
      <View style={styles.sectionCard}>

        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection(sectionKey)}
          activeOpacity={0.7}
        >

          <View style={styles.headerLeft}>

            <View
              style={[
                styles.headerIconCircle,
                { backgroundColor: iconColor + '12' }
              ]}
            >
              <Ionicons
                name={icon}
                size={normalize(18)}
                color={iconColor}
              />
            </View>

            <Text style={styles.sectionLabel}>
              {title}
            </Text>

          </View>

          <Ionicons
            name={isOpen ? "chevron-up" : "chevron-down"}
            size={normalize(18)}
            color="#94A3B8"
          />

        </TouchableOpacity>

        {isOpen && (
          <View style={styles.accordionContent}>
            {children}
          </View>
        )}

      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>

      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F8FAFC"
      />

      {/* HEADER */}
      <View style={styles.header}>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backCircle}
        >
          <Ionicons
            name="arrow-back"
            size={normalize(22)}
            color={ACE_BLUE}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Settings
        </Text>

        <View style={{ width: normalize(40) }} />

      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* USER CARD */}
        <View style={styles.brandCard}>

          <View style={styles.avatar}>
            <Ionicons
              name="person"
              size={normalize(28)}
              color="#FFF"
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.brandName}>
              {userName}
            </Text>

            <Text style={styles.version}>
              ACE Skills App v1.1.0
            </Text>
          </View>

        </View>

        {/* LICENSE */}
        <AccordionSection
          title="LICENSE DETAILS"
          icon="ribbon-outline"
          iconColor="#6366F1"
          sectionKey="license"
        >
          <View style={styles.licenseInfo}>
            <Text style={styles.licenseSubTitle}>
              LICENSE STATUS
            </Text>

            <Text style={styles.licenseName}>
              {licenseKey === "FREE USER"
                ? "FREE ACCESS"
                : "PRO ACTIVATED"}
            </Text>

            <View style={styles.divider} />

            <Text style={styles.licenseSubTitle}>
              LICENSE KEY
            </Text>

            <Text style={styles.licenseKey}>
              {licenseKey}
            </Text>
          </View>
        </AccordionSection>

        {/* FOCUS TRACK */}
        <AccordionSection
          title="FOCUS TRACK"
          icon="compass-outline"
          iconColor={ACE_BLUE}
          sectionKey="focus"
        >
          {FOCUS_TRACKS.map((track) => {

            const isSelected = selectedTrack === track.id;

            return (
              <TouchableOpacity
                key={track.id}
                style={[
                  styles.trackCard,
                  isSelected && styles.trackCardSelected
                ]}
                onPress={() => selectFocusTrack(track.id)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.trackIconCircle,
                    { backgroundColor: track.color + '15' }
                  ]}
                >
                  <Ionicons
                    name={track.icon}
                    size={normalize(18)}
                    color={track.color}
                  />
                </View>

                <Text
                  style={[
                    styles.trackCardText,
                    isSelected && styles.trackCardTextSelected
                  ]}
                >
                  {track.title}
                </Text>

                <Ionicons
                  name={isSelected ? "radio-button-on" : "radio-button-off"}
                  size={normalize(20)}
                  color={isSelected ? ACE_BLUE : '#CBD5E1'}
                />
              </TouchableOpacity>
            );
          })}
        </AccordionSection>

        {/* SUPPORT */}
        <AccordionSection
          title="SUPPORT"
          icon="help-buoy-outline"
          iconColor="#10B981"
          sectionKey="support"
        >
          <SettingRow
            icon="logo-whatsapp"
            title="WhatsApp Support"
            color="#22C55E"
            onPress={openWhatsApp}
            isLast
          />
        </AccordionSection>

        {/* ACCOUNT */}
        <AccordionSection
          title="ACCOUNT"
          icon="settings-outline"
          iconColor="#F97316"
          sectionKey="account"
        >
          <SettingRow
            icon="log-out-outline"
            title="Deactivate Device"
            color="#EF4444"
            onPress={performLogout}
            isLast
          />
        </AccordionSection>

      </ScrollView>

    </SafeAreaView>
  );
}