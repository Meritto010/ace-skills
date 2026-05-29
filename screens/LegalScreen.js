import React from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView, 
  Linking, ScrollView, Alert, StatusBar, Dimensions, PixelRatio, Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = SCREEN_WIDTH / 375;

export function normalize(size) {
  const newSize = size * scale;
  const roundedSize = Math.round(PixelRatio.roundToNearestPixel(newSize));
  return Platform.OS === 'ios' ? roundedSize : roundedSize - 2;
}

const ACE_BLUE = '#0F4C81';

export default function LegalScreen({ navigation }) {
  const PRIVACY_URL = 'https://gist.githubusercontent.com/Meritto010/106fe9eed279743481b47dd0dc548bfe/raw/privacy-policy.md';
  const TERMS_URL = 'https://gist.githubusercontent.com/Meritto010/8f44e03d9d4d8c5eb0033d2e12f50900/raw/terms-of-service.md';
  const SUPPORT_EMAIL = 'inbox.hsn@gmail.com';
  const SUPPORT_WHATSAPP = '919074887447';

  const handleOpenLink = async (url) => {
    try {
      await Linking.openURL(url);
    } catch (e) {
      Alert.alert("Error", "Could not open the link.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backCircle}>
          <Ionicons name="arrow-back" size={normalize(24)} color={ACE_BLUE} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Legal & Support</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Compliance & Privacy</Text>
        
        <LegalCard 
          title="Privacy Policy" 
          icon="shield-checkmark" 
          color="#3B82F6" 
          onPress={() => handleOpenLink(PRIVACY_URL)} 
        />
        <LegalCard 
          title="Terms of Service" 
          icon="document-text" 
          color="#A855F7" 
          onPress={() => handleOpenLink(TERMS_URL)} 
        />

        <Text style={styles.sectionTitle}>Support Channels</Text>
        
        <LegalCard 
          title="WhatsApp Support" 
          icon="logo-whatsapp" 
          color="#22C55E" 
          onPress={() => Linking.openURL(`https://wa.me/${SUPPORT_WHATSAPP}`)} 
        />
        <LegalCard 
          title="Email Support" 
          icon="mail" 
          color="#F97316" 
          onPress={() => Linking.openURL(`mailto:${SUPPORT_EMAIL}`)} 
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Placement Prep v1.1.0</Text>
          <Text style={styles.footerText}>© 2026 • Professional Excellence</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const LegalCard = ({ title, icon, color, onPress }) => (
  <TouchableOpacity style={styles.legalCard} onPress={onPress}>
    <View style={styles.cardLeft}>
      <View style={[styles.iconBg, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={normalize(22)} color={color} />
      </View>
      <Text style={styles.cardText}>{title}</Text>
    </View>
    <Ionicons name="chevron-forward" size={normalize(18)} color="#CBD5E1" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', alignItems: 'center', padding: normalize(20), backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  backCircle: { width: normalize(40), height: normalize(40), borderRadius: normalize(20), backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  headerTitle: { fontSize: normalize(18), fontWeight: '700', color: ACE_BLUE },
  scrollBody: { padding: normalize(20), paddingBottom: 100 },
  sectionTitle: { fontSize: normalize(11), fontWeight: '800', color: '#94A3B8', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 15, marginTop: 10 },
  legalCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFF', padding: normalize(16), borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#F1F5F9' },
  cardLeft: { flexDirection: 'row', alignItems: 'center' },
  iconBg: { width: normalize(44), height: normalize(44), borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  cardText: { fontSize: normalize(15), fontWeight: '700', color: '#1E293B' },
  footer: { marginTop: 40, alignItems: 'center' },
  footerText: { fontSize: normalize(11), color: '#CBD5E1', fontWeight: '600' }
});
