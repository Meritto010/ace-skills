import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Linking,
  StatusBar
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const ACE_BLUE = '#0F4C81';

/* =========================
   FEATURE CHIPS
========================= */
const FeatureChip = ({ icon, title, iconColor }) => (
  <View style={styles.chip}>
    <Ionicons name={icon} size={16} color={iconColor} />
    <Text style={styles.chipText}>{title}</Text>
  </View>
);

export default function LicenseActivationScreen({ navigation }) {
  const [name, setName] = useState('');
  const [licenseKey, setLicenseKey] = useState('');
  const [agreed, setAgreed] = useState(false);

  const PRIVACY_URL = 'https://example.com/privacy';
  const TERMS_URL = 'https://example.com/terms';

  const openLink = (url) => {
    Linking.openURL(url).catch(() =>
      Alert.alert('Error', 'Cannot open link')
    );
  };

  /* =========================
     SUPPORT
========================= */
  const openSupportDesk = () => {
    const phone = '919074887447';
    const msg =
      'Hi ACE Support, I need help with license activation.';

    Linking.openURL(
      `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`
    );
  };

  /* =========================
     ACTIVATE
========================= */
  const handleActivation = async () => {
    if (!name.trim()) {
      Alert.alert('Enter Name');
      return;
    }

    if (!licenseKey.trim()) {
      Alert.alert('Enter License Key');
      return;
    }

    if (!agreed) {
      Alert.alert('Please accept terms');
      return;
    }

    try {
      await AsyncStorage.setItem('@is_activated', 'true');
      await AsyncStorage.setItem('@activated_license', licenseKey);
      await AsyncStorage.setItem('@user_name', name);

      navigation.reset({
        index: 0,
        routes: [{ name: 'Dashboard' }]
      });

    } catch (e) {
      Alert.alert('Error', 'Activation failed');
    }
  };

  /* =========================
     FREE MODE
========================= */
  const freeMode = async () => {
    await AsyncStorage.setItem('@is_activated', 'false');

    navigation.reset({
      index: 0,
      routes: [{ name: 'Dashboard' }]
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.content}>

          {/* BRAND */}
          <View style={styles.header}>
            <Text style={styles.title}>ACE</Text>
            <Text style={styles.tagline}>
              Master Skills | Build Confidence
            </Text>
          </View>

          {/* PILLS */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.pillRow}
          >
            <FeatureChip icon="mic-outline" iconColor="#F59E0B" title="Speaking" />
            <FeatureChip icon="book-outline" iconColor="#7C3AED" title="Grammar" />
            <FeatureChip icon="library-outline" iconColor="#2563EB" title="Vocabulary" />
          </ScrollView>

          {/* FORM */}
          <View style={styles.card}>

            <Text style={styles.label}>NAME</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor="#94A3B8"
            />

            <Text style={styles.label}>LICENSE KEY</Text>
            <TextInput
              style={styles.input}
              value={licenseKey}
              onChangeText={setLicenseKey}
              placeholder="XXXX-XXXX"
              placeholderTextColor="#94A3B8"
              autoCapitalize="characters"
            />

            {/* CONSENT */}
            <View style={styles.consent}>
              <TouchableOpacity onPress={() => setAgreed(!agreed)}>
                <Ionicons
                  name={agreed ? 'checkbox' : 'square-outline'}
                  size={22}
                  color={agreed ? ACE_BLUE : '#CBD5E1'}
                />
              </TouchableOpacity>

              <Text style={styles.consentText}>
                I agree to Terms & Privacy Policy
              </Text>
            </View>

            {/* ACTIVATE BUTTON */}
            <TouchableOpacity
              style={styles.activateBtn}
              onPress={handleActivation}
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={18}
                color="#FFF"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.activateText}>Activate</Text>
            </TouchableOpacity>

            {/* FREE MODE */}
            <TouchableOpacity onPress={freeMode}>
              <Text style={styles.freeText}>
                Continue without activation
              </Text>
            </TouchableOpacity>

          </View>

        </ScrollView>

        {/* SUPPORT */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.support}
            onPress={openSupportDesk}
          >
            <Ionicons name="logo-whatsapp" size={18} color="#25D366" />
            <Text style={styles.supportText}>Support Desk</Text>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* =========================
   STYLES
========================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },

  content: {
    paddingBottom: 120
  },

  header: {
    alignItems: 'center',
    marginTop: 40
  },

  title: {
    fontSize: 34,
    fontWeight: '900',
    color: ACE_BLUE
  },

  tagline: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4
  },

  pillRow: {
    paddingHorizontal: 20,
    marginTop: 25
  },

  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10
  },

  chipText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '700',
    color: '#334155'
  },

  card: {
    marginTop: 25,
    marginHorizontal: 20
  },

  label: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    marginBottom: 6
  },

  input: {
    height: 55,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 18,
    backgroundColor: '#F8FAFC'
  },

  consent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },

  consentText: {
    marginLeft: 8,
    fontSize: 12,
    color: '#64748B'
  },

  activateBtn: {
    backgroundColor: ACE_BLUE,
    height: 55,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },

  activateText: {
    color: '#fff',
    fontWeight: '800'
  },

  freeText: {
    textAlign: 'center',
    marginTop: 15,
    color: '#64748B',
    fontWeight: '700'
  },

  footer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignItems: 'center'
  },

  support: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#fff'
  },

  supportText: {
    marginLeft: 6,
    fontWeight: '800',
    color: '#1E293B'
  }
});