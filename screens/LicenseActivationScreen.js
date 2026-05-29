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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { checkLicense } from '../services/supabase';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = SCREEN_WIDTH / 375;
const ACE_BLUE = '#0F4C81';

export function normalize(size) {
  const newSize = size * scale;
  const roundedSize = Math.round(PixelRatio.roundToNearestPixel(newSize));
  return Platform.OS === 'ios' ? roundedSize : roundedSize - 2;
}

// Fixed feature layout mapping matching your architecture layout
const FeatureChip = ({ icon, iconColor, title }) => (
  <View style={styles.fChipCard}>
    <View style={[styles.iconCircle, { backgroundColor: `${iconColor}15` }]}>
      <Ionicons name={icon} size={normalize(16)} color={iconColor} />
    </View>
    <Text style={styles.fText}>{title}</Text>
  </View>
);

export default function LicenseActivationScreen({ navigation }) {
  const [name, setName] = useState('');
  const [licenseKey, setLicenseKey] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const PRIVACY_URL = 'https://gist.githubusercontent.com/Meritto010/106fe9eed279743481b47dd0dc548bfe/raw/024f52e035c0860b37473e5bc7e32606023a1ea6/privacy-policy.md';
  const TERMS_URL = 'https://gist.githubusercontent.com/Meritto010/8f44e03d9d4d8c5eb0033d2e12f50900/raw/c71e80fab781e7336b62284beb13d8870bb99b2c/terms-of-service.md';

  const handleSupport = () => {
    const phone = '919074887447';
    const url = `https://wa.me/${phone}?text=Hi ACE Skills Support, I have a license enquiry / need support with activation.`;
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

  const handleFreeAccess = () => {
    navigation.replace('MainApp'); // Fixed: Targeted the nested structural wrapper
  };

  const handleActivation = async () => {
    if (!name.trim() || !licenseKey.trim()) {
      Alert.alert('Required', 'Please enter your details.');
      return;
    }
    if (!agreed) {
      Alert.alert('Terms Required', 'Please accept Privacy Policy and Terms.');
      return;
    }

    setLoading(true);
    try {
      const formattedKey = licenseKey.trim();
      const isValid = await checkLicense(formattedKey);

      if (isValid === true) {
        await AsyncStorage.setItem('@is_activated', 'true');
        await AsyncStorage.setItem('@activated_license', formattedKey);
        await AsyncStorage.setItem('@user_name', name.trim());
        
        setLoading(false);
        Alert.alert('Activation Successful', 'Premium features unlocked.', [
          { text: 'Continue', onPress: () => navigation.replace('MainApp') }
        ]);
      } else {
        setLoading(false);
        Alert.alert('Activation Failed', 'Invalid or disabled license key.');
      }
    } catch (e) {
      setLoading(false);
      Alert.alert('Connection Error', 'Unable to connect to verification server.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.header}>
            <View style={styles.logoBadge}>
              <Ionicons name="shield-checkmark" size={normalize(30)} color="#FFF" />
            </View>
            <Text style={styles.brandTitle}>ACE SKILLS</Text>
            <Text style={styles.tagline}>Master Skills | Build Confidence</Text>
          </View>

          {/* 🌟 FIX: Shifted to a grid matrix wrapper layout instead of an infinite horizontal row to avoid stamped placement */}
          <View style={styles.matrixWrapper}>
            <View style={styles.fChipsContainer}>
              {/* Row 1: Grammar & Speaking */}
              <FeatureChip icon="book-outline" iconColor="#7C3AED" title="Grammar Mastery" />
              <FeatureChip icon="mic-outline" iconColor="#F59E0B" title="Speaking Lab" />
              
              {/* Row 2: Word Power & Career Readiness */}
              <FeatureChip icon="library-outline" iconColor="#2563EB" title="Word Power" />
              <FeatureChip icon="briefcase-outline" iconColor="#10B981" title="Career Readiness" />
            </View>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>FULL NAME</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor="#94A3B8"
              value={name}
              editable={!loading}
              onChangeText={setName}
            />

            <Text style={styles.label}>LICENSE KEY</Text>
            <TextInput
              style={styles.input}
              placeholder="ASK-XXXX-XXXX"
              placeholderTextColor="#94A3B8"
              value={licenseKey}
              editable={!loading}
              maxLength={13}
              autoCapitalize="characters"
              onChangeText={handleKeyFormatter}
            />

            <View style={styles.checkboxContainer}>
              <TouchableOpacity disabled={loading} onPress={() => setAgreed(!agreed)}>
                <Ionicons name={agreed ? 'checkbox' : 'square-outline'} size={normalize(22)} color={agreed ? ACE_BLUE : '#CBD5E1'} />
              </TouchableOpacity>
              <View style={styles.termsRow}>
                <Text style={styles.checkboxText}>I agree to the</Text>
                <TouchableOpacity onPress={() => Linking.openURL(PRIVACY_URL)}>
                  <Text style={styles.linkText}> Privacy Policy</Text>
                </TouchableOpacity>
                <Text style={styles.checkboxText}> &</Text>
                <TouchableOpacity onPress={() => Linking.openURL(TERMS_URL)}>
                  <Text style={styles.linkText}> Terms</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity disabled={loading} style={[styles.btnActivate, loading && { opacity: 0.7 }]} onPress={handleActivation}>
              {loading ? <ActivityIndicator color="#FFF" /> : <><Ionicons name="flash" size={normalize(18)} color="#FFF" style={{ marginRight: 8 }} /><Text style={styles.btnText}>Activate Premium</Text></>}
            </TouchableOpacity>

            <TouchableOpacity disabled={loading} style={styles.btnSkip} onPress={handleFreeAccess}>
              <Text style={styles.skipText}>Explore Free Access</Text>
            </TouchableOpacity>

            {/* 🌟 FIX: Updated Support design section without explicit display of the raw telephone digits */}
            <View style={styles.supportSection}>
              <Text style={styles.supportHeading}>GET SUPPORT</Text>
              <TouchableOpacity style={styles.supportRowPill} onPress={handleSupport} activeOpacity={0.85}>
                <Ionicons name="logo-whatsapp" size={normalize(16)} color="#065F46" />
                <Text style={styles.supportRowText}>Chat with Support</Text>
              </TouchableOpacity>
            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // 🌟 FIX: Added responsive dynamic padding mapping calculated natively to push below edge statuses safely
  container: { 
    flex: 1, 
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + normalize(16) : normalize(16)
  },
  scrollContent: { 
    paddingBottom: normalize(40) 
  },
  // 🌟 FIX: Expanded spacing margins to decouple elements safely
  header: { 
    alignItems: 'center', 
    marginTop: normalize(15),
    marginBottom: normalize(28)
  },
  logoBadge: { 
    width: normalize(64), 
    height: normalize(64), 
    borderRadius: normalize(32), 
    backgroundColor: ACE_BLUE, 
    justifyContent: 'center', 
    alignItems: 'center', 
    elevation: 4, 
    marginBottom: normalize(14) 
  },
  brandTitle: { 
    fontSize: normalize(26), 
    fontWeight: '900', 
    color: ACE_BLUE, 
    letterSpacing: 1.5 
  },
  tagline: { 
    fontSize: normalize(13), 
    color: '#475569', 
    fontWeight: '700', 
    marginTop: normalize(4) 
  },
  // 🌟 FIX: Transformed layout to premium symmetric display structures
  matrixWrapper: {
    paddingHorizontal: normalize(24),
    marginBottom: normalize(26)
  },
  fChipsContainer: { 
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  fChipCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: normalize(12), 
    height: normalize(48), 
    borderRadius: normalize(14), 
    width: '48.5%',
    backgroundColor: '#F8FAFC', 
    borderWidth: 1, 
    borderColor: '#E2E8F0',
    marginBottom: normalize(10)
  },
  iconCircle: { 
    width: normalize(28), 
    height: normalize(28), 
    borderRadius: normalize(14), 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: normalize(8) 
  },
  fText: { 
    fontSize: normalize(11), 
    fontWeight: '800', 
    color: '#1E293B',
    flex: 1
  },
  form: { 
    paddingHorizontal: normalize(24) 
  },
  label: { 
    fontSize: normalize(11), 
    fontWeight: '800', 
    color: '#475569', 
    marginBottom: normalize(6),
    letterSpacing: 0.5
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
    fontWeight: '600' 
  },
  checkboxContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: normalize(24),
    marginTop: normalize(4)
  },
  termsRow: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    marginLeft: normalize(8), 
    flex: 1, 
    alignItems: 'center' 
  },
  checkboxText: { 
    fontSize: normalize(12), 
    color: '#475569', 
    fontWeight: '600' 
  },
  linkText: { 
    fontSize: normalize(12), 
    color: ACE_BLUE, 
    fontWeight: '800', 
    textDecorationLine: 'underline' 
  },
  btnActivate: { 
    backgroundColor: ACE_BLUE, 
    height: normalize(54), 
    borderRadius: normalize(14), 
    justifyContent: 'center', 
    alignItems: 'center', 
    flexDirection: 'row', 
    elevation: 2,
    shadowColor: ACE_BLUE,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5
  },
  btnText: { 
    color: '#FFFFFF', 
    fontSize: normalize(15), 
    fontWeight: '900' 
  },
  btnSkip: { 
    marginTop: normalize(18), 
    alignItems: 'center', 
    paddingVertical: normalize(6) 
  },
  skipText: { 
    color: ACE_BLUE, 
    fontSize: normalize(13), 
    fontWeight: '800', 
    textDecorationLine: 'underline' 
  },
  // 🌟 FIX: Expanded spacing separation height
  supportSection: { 
    marginTop: normalize(32), 
    alignItems: 'center', 
    borderTopWidth: 1, 
    borderTopColor: '#F1F5F9', 
    paddingTop: normalize(20) 
  },
  supportHeading: { 
    fontSize: normalize(10), 
    fontWeight: '800', 
    color: '#94A3B8', 
    marginBottom: normalize(10),
    letterSpacing: 0.8
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
    justifyContent: 'center' 
  },
  supportRowText: { 
    marginLeft: normalize(6), 
    fontSize: normalize(13), 
    fontWeight: '800', 
    color: '#065F46' 
  },
});
