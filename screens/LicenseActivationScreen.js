import React, { useState, useContext } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import * as Device from 'expo-device';
import { supabase } from '../services/supabase';
import ActivationInstructionModal from '../components/ActivationInstructionModal';
import { AuthContext } from '../context/AuthContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = SCREEN_WIDTH / 375;
const ACE_BLUE = '#0F4C81';

export function normalize(size) {
  const newSize = size * scale;
  const roundedSize = Math.round(PixelRatio.roundToNearestPixel(newSize));
  return Platform.OS === 'ios' ? roundedSize : roundedSize - 2;
}

export default function LicenseActivationScreen({ navigation }) {
  const { login } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [licenseKey, setLicenseKey] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const PRIVACY_URL = 'https://gist.githubusercontent.com/Meritto010/106fe9eed279743481b47dd0dc548bfe/raw/024f52e035c0860b37473e5bc7e32606023a1ea6/privacy-policy.md';
  const TERMS_URL = 'https://gist.githubusercontent.com/Meritto010/8f44e03d9d4d8c5eb0033d2e12f50900/raw/c71e80fab781e7336b62284beb13d8870bb99b2c/terms-of-service.md';

  const handleSupport = () => {
    const supportPhone = '919074887447';
    const url = `https://wa.me/${supportPhone}?text=Hi ACE English Support, I have a license enquiry / need support with activation.`;
    Linking.openURL(url).catch(() => Alert.alert('Error', 'WhatsApp not installed.'));
  };

  const handleKeyFormatter = (text) => {
    let cleaned = text.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    let formatted = cleaned;
    if (cleaned.length > 3 && cleaned.length <= 7) {
      formatted = `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    } else if (cleaned.length > 7) {
      formatted = `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7, 11)}`;
    }
    setLicenseKey(formatted.slice(0, 13));
  };

  const handleActivation = async () => {
    if (!name.trim() || !phone.trim() || !licenseKey.trim()) {
      Alert.alert('Required', 'Please enter your name, phone number, and license key.');
      return;
    }
    if (!agreed) {
      Alert.alert('Terms Required', 'Please accept Privacy Policy and Terms.');
      return;
    }

    setLoading(true);

    try {
      const deviceId = Device.osBuildId || Device.modelId || 'unknown';
      
      const { data, error } = await supabase.rpc('activate_license', {
        p_key: licenseKey.trim(),
        p_device_id: deviceId,
        p_name: name.trim(),
        p_phone: phone.trim()
      });

      if (error || !data || !data[0]?.success) {
        Alert.alert("Activation Failed", data?.[0]?.message || "Something went wrong.");
      } else {
        await AsyncStorage.setItem('@user_name', name.trim());
        await AsyncStorage.setItem('@user_phone', phone.trim());

        Alert.alert("Success", "Activation Successful!");
        // FIX: Pass the license key to login() so context updates isActivated to true
        login(licenseKey.trim()); 
      }
    } catch (err) {
      Alert.alert("Error", "Check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <View style={styles.logoBadge}><Ionicons name="shield-checkmark" size={normalize(26)} color="#FFF" /></View>
            <Text style={styles.brandTitle}>ACE English</Text>
            <Text style={styles.tagline}>Mastery Centre</Text>
            <TouchableOpacity style={styles.instructionsPill} onPress={() => setShowInstructions(true)} activeOpacity={0.85}>
              <Ionicons name="information-circle-outline" size={normalize(16)} color={ACE_BLUE} />
              <Text style={styles.instructionsText}>Activation Instructions</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>FULL NAME</Text>
            <TextInput style={styles.input} placeholder="Enter your full name" placeholderTextColor="#94A3B8" value={name} editable={!loading} onChangeText={setName} />
            <Text style={styles.label}>PHONE NUMBER</Text>
            <TextInput style={styles.input} placeholder="Enter mobile number" keyboardType="phone-pad" placeholderTextColor="#94A3B8" value={phone} editable={!loading} onChangeText={setPhone} />
            <View style={styles.labelRow}>
              <Text style={styles.label}>LICENSE KEY</Text>
              <TouchableOpacity onPress={() => setShowInstructions(true)} activeOpacity={0.7}><Ionicons name="information-circle-outline" size={normalize(18)} color="#64748B" /></TouchableOpacity>
            </View>
            <TextInput style={styles.input} placeholder="ASK-XXXX-XXXX" placeholderTextColor="#94A3B8" value={licenseKey} editable={!loading} maxLength={13} autoCapitalize="characters" onChangeText={handleKeyFormatter} />

            <View style={styles.checkboxContainer}>
              <TouchableOpacity disabled={loading} onPress={() => setAgreed(!agreed)}><Ionicons name={agreed ? 'checkbox' : 'square-outline'} size={normalize(22)} color={agreed ? ACE_BLUE : '#CBD5E1'} /></TouchableOpacity>
              <View style={styles.termsRow}>
                <Text style={styles.checkboxText}>I agree to the</Text>
                <TouchableOpacity onPress={() => Linking.openURL(PRIVACY_URL)}><Text style={styles.linkText}> Privacy Policy</Text></TouchableOpacity>
                <Text style={styles.checkboxText}> &</Text>
                <TouchableOpacity onPress={() => Linking.openURL(TERMS_URL)}><Text style={styles.linkText}> Terms</Text></TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity disabled={loading} style={[styles.btnActivate, loading && { opacity: 0.7 }]} onPress={handleActivation}>
              {loading ? <ActivityIndicator color="#FFF" /> : (
                <>
                  <Ionicons name="flash" size={normalize(18)} color="#FFF" style={{ marginRight: 8 }} />
                  <Text style={styles.btnText}>Activate Premium</Text>
                </>
              )}
            </TouchableOpacity>
            
            <View style={styles.supportSection}>
              <Text style={styles.supportHeading}>GET SUPPORT</Text>
              <TouchableOpacity style={styles.supportRowPill} onPress={handleSupport} activeOpacity={0.85}>
                <Ionicons name="logo-whatsapp" size={normalize(16)} color="#065F46" />
                <Text style={styles.supportRowText}>Chat with Support</Text>
              </TouchableOpacity>
            </View>
          </View>
          <ActivationInstructionModal visible={showInstructions} onClose={() => setShowInstructions(false)} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + normalize(16) : normalize(16) },
  scrollContent: { flexGrow: 1, paddingBottom: normalize(60) },
  header: { alignItems: 'center', marginTop: normalize(6), marginBottom: normalize(20) },
  logoBadge: { width: normalize(56), height: normalize(56), borderRadius: normalize(28), backgroundColor: ACE_BLUE, justifyContent: 'center', alignItems: 'center', elevation: 4, marginBottom: normalize(10) },
  brandTitle: { fontSize: normalize(26), fontWeight: '900', color: ACE_BLUE, letterSpacing: 1.5 },
  tagline: { fontSize: normalize(13), color: '#475569', fontWeight: '700', marginTop: normalize(4) },
  instructionsPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EFF6FF', borderWidth: 1, borderColor: '#DBEAFE', paddingHorizontal: normalize(16), paddingVertical: normalize(10), borderRadius: normalize(22), marginTop: normalize(12) },
  instructionsText: { marginLeft: normalize(6), color: ACE_BLUE, fontWeight: '800', fontSize: normalize(12) },
  form: { paddingHorizontal: normalize(24) },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: normalize(6) },
  label: { fontSize: normalize(11), fontWeight: '800', color: '#475569', letterSpacing: 0.5 },
  input: { height: normalize(52), backgroundColor: '#F8FAFC', borderRadius: normalize(12), borderWidth: 1.5, borderColor: '#E2E8F0', paddingHorizontal: normalize(14), fontSize: normalize(14), color: '#0F172A', marginBottom: normalize(16), fontWeight: '600' },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: normalize(24), marginTop: normalize(4) },
  termsRow: { flexDirection: 'row', flexWrap: 'wrap', marginLeft: normalize(8), flex: 1, alignItems: 'center' },
  checkboxText: { fontSize: normalize(12), color: '#475569', fontWeight: '600' },
  linkText: { fontSize: normalize(12), color: ACE_BLUE, fontWeight: '800', textDecorationLine: 'underline' },
  btnActivate: { backgroundColor: ACE_BLUE, height: normalize(54), borderRadius: normalize(14), justifyContent: 'center', alignItems: 'center', flexDirection: 'row', elevation: 2, shadowColor: ACE_BLUE, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 5 },
  btnText: { color: '#FFFFFF', fontSize: normalize(15), fontWeight: '900' },
  supportSection: { marginTop: normalize(24), alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: normalize(18), marginBottom: normalize(10) },
  supportHeading: { fontSize: normalize(10), fontWeight: '800', color: '#94A3B8', marginBottom: normalize(10), letterSpacing: 0.8 },
  supportRowPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#DCFCE7', paddingHorizontal: normalize(16), paddingVertical: normalize(12), borderRadius: normalize(14), borderWidth: 1, borderColor: '#86EFAC', width: '100%', justifyContent: 'center' },
  supportRowText: { marginLeft: normalize(6), fontSize: normalize(13), fontWeight: '800', color: '#065F46' },
});
