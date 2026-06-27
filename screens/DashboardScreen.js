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
  Dimensions,
  PixelRatio,
  StatusBar,
  ActivityIndicator,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import * as Device from 'expo-device';

import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ACE_BLUE = '#0F4C81';

const scale = SCREEN_WIDTH / 375;

export function normalize(size) {
  const newSize = size * scale;
  const roundedSize = Math.round(
    PixelRatio.roundToNearestPixel(newSize)
  );

  return Platform.OS === 'ios'
    ? roundedSize
    : roundedSize - 2;
}

const PRIVACY_URL =
  'https://gist.githubusercontent.com/Meritto010/106fe9eed279743481b47dd0dc548bfe/raw/024f52e035c0860b37473e5bc7e32606023a1ea6/privacy-policy.md';

const TERMS_URL =
  'https://gist.githubusercontent.com/Meritto010/8f44e03d9d4d8c5eb0033d2e12f50900/raw/c71e80fab781e7336b62284beb13d8870bb99b2c/terms-of-service.md';

export default function LicenseActivationScreen({
  navigation,
}) {

  const {
    isActivated,
    activationInfo,
    activateLicense,
    deactivateLicense,
  } = useAuth();

  const [name, setName] = useState(
    activationInfo.fullName || ''
  );

  const [phone, setPhone] = useState(
    activationInfo.mobile || ''
  );

  const [licenseKey, setLicenseKey] = useState(
    activationInfo.licenseKey || ''
  );

  const [agreed, setAgreed] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleSupport = () => {

    const supportPhone = '919074887447';

    const url =
      `https://wa.me/${supportPhone}?text=Hi ACE English Support, I need help with my license activation.`;

    Linking.openURL(url).catch(() => {

      Alert.alert(
        'Error',
        'WhatsApp is not installed.'
      );

    });

  };

  const handleKeyFormatter = (text) => {

    const cleaned = text
      .replace(/[^a-zA-Z0-9]/g, '')
      .toUpperCase();

    let formatted = cleaned;

    if (cleaned.length > 3 && cleaned.length <= 7) {

      formatted =
        `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;

    } else if (cleaned.length > 7) {

      formatted =
        `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7, 11)}`;

    }

    setLicenseKey(
      formatted.slice(0, 13)
    );

  };
    const handleActivation = async () => {

    if (!name.trim()) {
      Alert.alert(
        'Required',
        'Please enter your full name.'
      );
      return;
    }

    if (!phone.trim()) {
      Alert.alert(
        'Required',
        'Please enter your mobile number.'
      );
      return;
    }

    if (!licenseKey.trim()) {
      Alert.alert(
        'Required',
        'Please enter your license key.'
      );
      return;
    }

    if (!agreed) {
      Alert.alert(
        'Terms Required',
        'Please accept the Privacy Policy and Terms of Service.'
      );
      return;
    }

    setLoading(true);

    try {

      const deviceId =
        Device.osBuildId ||
        Device.modelId ||
        Device.deviceName ||
        'unknown';

      const { data, error } = await supabase.rpc(
        'activate_license',
        {
          p_key: licenseKey.trim(),
          p_device_id: deviceId,
          p_name: name.trim(),
          p_phone: phone.trim(),
        }
      );

      if (
        error ||
        !data ||
        !data[0] ||
        !data[0].success
      ) {

        Alert.alert(
          'Activation Failed',
          data?.[0]?.message ||
            'Unable to activate your license.'
        );

        return;
      }

      const result = await activateLicense({

        licenseKey: licenseKey.trim(),

        fullName: name.trim(),

        mobile: phone.trim(),

      });

      if (!result.success) {

        Alert.alert(
          'Activation Error',
          result.message ||
            'Unable to save activation information.'
        );

        return;
      }

      Alert.alert(
        'Activation Successful',
        'Your Premium Membership has been activated.',
        [
          {
            text: 'Continue',
            onPress: () =>
              navigation.replace('Dashboard'),
          },
        ]
      );

    } catch (error) {

      Alert.alert(
        'Connection Error',
        'Please check your internet connection and try again.'
      );

    } finally {

      setLoading(false);

    }

  };

  const handleDeactivate = () => {

    Alert.alert(

      'Deactivate License',

      'This device will lose Premium access. Continue?',

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

              setName('');

              setPhone('');

              setLicenseKey('');

              setAgreed(false);

              Alert.alert(
                'License Removed',
                'Premium activation has been removed from this device.'
              );

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

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : 'height'
        }
      >

        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >

          <View style={styles.header}>

            <View style={styles.logoBadge}>
              <Ionicons
                name="shield-checkmark"
                size={normalize(26)}
                color="#FFFFFF"
              />
            </View>

            <Text style={styles.brandTitle}>
              ACE English
            </Text>

            <Text style={styles.tagline}>
              Mastery Centre
            </Text>

          </View>

          {isActivated ? (

            <View style={styles.form}>

              <View style={styles.successCard}>

                <Ionicons
                  name="checkmark-circle"
                  size={60}
                  color="#16A34A"
                />

                <Text style={styles.successTitle}>
                  Premium Activated
                </Text>

                <Text style={styles.successSubtitle}>
                  Your device is successfully activated.
                </Text>

              </View>

              <View style={styles.infoCard}>

                <Text style={styles.infoLabel}>
                  LICENSE KEY
                </Text>

                <Text style={styles.infoValue}>
                  {activationInfo.licenseKey}
                </Text>

                <Text style={styles.infoLabel}>
                  FULL NAME
                </Text>

                <Text style={styles.infoValue}>
                  {activationInfo.fullName}
                </Text>

                <Text style={styles.infoLabel}>
                  MOBILE
                </Text>

                <Text style={styles.infoValue}>
                  {activationInfo.mobile}
                </Text>

              </View>

              <TouchableOpacity
                style={styles.btnDeactivate}
                onPress={handleDeactivate}
              >
                <Ionicons
                  name="trash-outline
                  <TouchableOpacity
  style={styles.btnDeactivate}
  onPress={handleDeactivate}
>
  <Ionicons
    name="trash-outline"
    size={normalize(18)}
    color="#FFFFFF"
    style={{ marginRight: 8 }}
  />

  <Text style={styles.btnText}>
    Deactivate License
  </Text>

</TouchableOpacity>

</View>

) : (

<View style={styles.form}>

  <Text style={styles.label}>
    FULL NAME
  </Text>

  <TextInput
    style={styles.input}
    placeholder="Enter your full name"
    placeholderTextColor="#94A3B8"
    value={name}
    editable={!loading}
    onChangeText={setName}
  />

  <Text style={styles.label}>
    PHONE NUMBER
  </Text>

  <TextInput
    style={styles.input}
    placeholder="Enter mobile number"
    keyboardType="phone-pad"
    placeholderTextColor="#94A3B8"
    value={phone}
    editable={!loading}
    onChangeText={setPhone}
  />

  <Text style={styles.label}>
    LICENSE KEY
  </Text>

  <TextInput
    style={styles.input}
    placeholder="ASK-XXXX-XXXX"
    placeholderTextColor="#94A3B8"
    autoCapitalize="characters"
    maxLength={13}
    editable={!loading}
    value={licenseKey}
    onChangeText={handleKeyFormatter}
  />

  <View style={styles.checkboxContainer}>

    <TouchableOpacity
      disabled={loading}
      onPress={() => setAgreed(!agreed)}
    >

      <Ionicons
        name={
          agreed
            ? 'checkbox'
            : 'square-outline'
        }
        size={normalize(22)}
        color={
          agreed
            ? ACE_BLUE
            : '#CBD5E1'
        }
      />

    </TouchableOpacity>

    <View style={styles.termsRow}>

      <Text style={styles.checkboxText}>
        I agree to the
      </Text>

      <TouchableOpacity
        onPress={() =>
          Linking.openURL(PRIVACY_URL)
        }
      >
        <Text style={styles.linkText}>
          {' '}Privacy Policy
        </Text>
      </TouchableOpacity>

      <Text style={styles.checkboxText}>
        {' '}&
      </Text>

      <TouchableOpacity
        onPress={() =>
          Linking.openURL(TERMS_URL)
        }
      >
        <Text style={styles.linkText}>
          {' '}Terms
        </Text>
      </TouchableOpacity>

    </View>

  </View>

  <TouchableOpacity
    style={[
      styles.btnActivate,
      loading && {
        opacity: 0.7,
      },
    ]}
    disabled={loading}
    onPress={handleActivation}
  >

    {loading ? (

      <ActivityIndicator
        color="#FFFFFF"
      />

    ) : (

      <>

        <Ionicons
          name="flash"
          size={normalize(18)}
          color="#FFFFFF"
          style={{
            marginRight: 8,
          }}
        />

        <Text style={styles.btnText}>
          Activate Premium
        </Text>

      </>

    )}

  </TouchableOpacity>

  <TouchableOpacity
    style={styles.btnSkip}
    disabled={loading}
    onPress={() =>
      navigation.replace('Dashboard')
    }
  >

    <Text style={styles.skipText}>
      Explore Free Access
    </Text>

  </TouchableOpacity>

  <View style={styles.supportSection}>

    <Text style={styles.supportHeading}>
      GET SUPPORT
    </Text>

    <TouchableOpacity
      style={styles.supportRowPill}
      activeOpacity={0.85}
      onPress={handleSupport}
    >

      <Ionicons
        name="logo-whatsapp"
        size={normalize(16)}
        color="#065F46"
      />

      <Text style={styles.supportRowText}>
        Chat with Support
      </Text>

    </TouchableOpacity>

  </View>

</View>

)}

</ScrollView>

</KeyboardAvoidingView>

</SafeAreaView>

);

}
const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop:
      Platform.OS === 'android'
        ? StatusBar.currentHeight + normalize(16)
        : normalize(16),
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: normalize(60),
  },

  header: {
    alignItems: 'center',
    marginTop: normalize(6),
    marginBottom: normalize(20),
  },

  logoBadge: {
    width: normalize(56),
    height: normalize(56),
    borderRadius: normalize(28),
    backgroundColor: ACE_BLUE,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    marginBottom: normalize(10),
  },

  brandTitle: {
    fontSize: normalize(26),
    fontWeight: '900',
    color: ACE_BLUE,
    letterSpacing: 1.5,
  },

  tagline: {
    fontSize: normalize(13),
    color: '#475569',
    fontWeight: '700',
    marginTop: normalize(4),
  },

  form: {
    paddingHorizontal: normalize(24),
  },

  label: {
    fontSize: normalize(11),
    fontWeight: '800',
    color: '#475569',
    letterSpacing: 0.5,
    marginBottom: normalize(6),
  },

  input: {
    height: normalize(52),
    backgroundColor: '#F8FAFC',
    borderRadius: normalize(12),
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: normalize(14),
    fontSize: normalize(14),
    color: '#0F172A',
    marginBottom: normalize(16),
    fontWeight: '600',
  },

  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: normalize(4),
    marginBottom: normalize(24),
  },

  termsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: normalize(8),
    flex: 1,
    alignItems: 'center',
  },

  checkboxText: {
    fontSize: normalize(12),
    color: '#475569',
    fontWeight: '600',
  },

  linkText: {
    fontSize: normalize(12),
    color: ACE_BLUE,
    fontWeight: '800',
    textDecorationLine: 'underline',
  },

  btnActivate: {
    backgroundColor: ACE_BLUE,
    height: normalize(54),
    borderRadius: normalize(14),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    elevation: 2,
  },

  btnDeactivate: {
    backgroundColor: '#DC2626',
    height: normalize(54),
    borderRadius: normalize(14),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: normalize(28),
  },

  btnText: {
    color: '#FFFFFF',
    fontSize: normalize(15),
    fontWeight: '900',
  },

  btnSkip: {
    marginTop: normalize(18),
    alignItems: 'center',
    paddingVertical: normalize(6),
  },

  skipText: {
    color: ACE_BLUE,
    fontSize: normalize(13),
    fontWeight: '800',
    textDecorationLine: 'underline',
  },

  supportSection: {
    marginTop: normalize(24),
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: normalize(18),
    marginBottom: normalize(10),
  },

  supportHeading: {
    fontSize: normalize(10),
    fontWeight: '800',
    color: '#94A3B8',
    marginBottom: normalize(10),
    letterSpacing: 0.8,
  },

  supportRowPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(12),
    borderRadius: normalize(14),
    borderWidth: 1,
    borderColor: '#86EFAC',
    width: '100%',
    justifyContent: 'center',
  },

  supportRowText: {
    marginLeft: normalize(6),
    fontSize: normalize(13),
    fontWeight: '800',
    color: '#065F46',
  },

  successCard: {
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: normalize(16),
    borderWidth: 1,
    borderColor: '#BBF7D0',
    padding: normalize(24),
    marginBottom: normalize(24),
  },

  successTitle: {
    marginTop: normalize(12),
    fontSize: normalize(22),
    fontWeight: '800',
    color: '#166534',
  },

  successSubtitle: {
    marginTop: normalize(6),
    fontSize: normalize(13),
    color: '#4B5563',
    textAlign: 'center',
  },

  infoCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: normalize(16),
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: normalize(18),
  },

  infoLabel: {
    fontSize: normalize(10),
    fontWeight: '800',
    color: '#64748B',
    marginTop: normalize(12),
    textTransform: 'uppercase',
  },

  infoValue: {
    fontSize: normalize(15),
    fontWeight: '700',
    color: '#0F172A',
    marginTop: normalize(4),
  },

});