import React, { useState } from 'react';
import {
  Modal, View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback,
  Linking, ScrollView, Platform, LayoutAnimation, UIManager,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function SupportHubModal({ visible, onClose }) {
  const [activeSection, setActiveSection] = useState(null);

  const toggleSection = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveSection(activeSection === index ? null : index);
  };

  const openWhatsAppSupport = () => {
    const phone = '919074887447';
    const message = encodeURIComponent('Hi ACE Support Team, I need help with my ACE English app.');
    Linking.openURL(`https://wa.me/${phone}?text=${message}`).catch(() => alert('WhatsApp is not installed.'));
  };

  const sections = [
    { 
      title: 'Membership & Activation', 
      icon: 'key-outline', 
      color: '#3B82F6', 
      items: [
        'Free Access allows use of selected learning streams.',
        'Premium Membership grants access to all guided resources.',
        'Navigate to the Activation screen.',
        'Enter your unique license key (ASK-XXXX-XXXX).',
        'Tap Activate Premium to complete your setup.'
      ] 
    },
    { 
      title: 'Getting Started', 
      icon: 'rocket-outline', 
      color: '#8B5CF6', 
      items: [
        'Select Grammar, Speaking, or Word Power from the Dashboard.',
        'View your current goal in the Focus Track card.'
      ] 
    },
    { 
      title: 'Learning Approach', 
      icon: 'school-outline', 
      color: '#F59E0B', 
      items: [
        'Listen to audio streams to match natural cadence.',
        'Complete interactive scenarios to build speaking skills.',
        'Use the Word Power section to learn words in context.',
        'Practice these steps daily to improve retention.'
      ] 
    },
    { 
      title: 'Program Inquiries', 
      icon: 'chatbubble-ellipses-outline', 
      color: '#EF4444', 
      items: [
        'Tap Inquire Now on the Dashboard.',
        'Enter your name and phone number.',
        'Select your preferred course.',
        'Tap Submit Inquiry to notify the team.'
      ] 
    }
  ];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Learning Support Hub</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeCircle}>
                  <Ionicons name="close" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {sections.map((section, index) => (
                  <View key={index} style={styles.card}>
                    <TouchableOpacity style={styles.header} onPress={() => toggleSection(index)} activeOpacity={0.7}>
                      <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View style={[styles.iconBox, {backgroundColor: section.color + '15'}]}>
                          <Ionicons name={section.icon} size={16} color={section.color} />
                        </View>
                        <Text style={styles.titleText}>{section.title}</Text>
                      </View>
                      <Ionicons name={activeSection === index ? 'chevron-up' : 'chevron-down'} size={16} color="#94A3B8" />
                    </TouchableOpacity>
                    {activeSection === index && (
                      <View style={styles.contentContainer}>
                        {section.items.map((item, i) => (
                          <View key={i} style={styles.bulletRow}>
                            <Text style={styles.bullet}>•</Text>
                            <Text style={styles.contentText}>{item}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                ))}

                <TouchableOpacity style={styles.whatsappCTA} onPress={openWhatsAppSupport} activeOpacity={0.85}>
                  <Ionicons name="logo-whatsapp" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                  <Text style={styles.whatsappCTAText}>Chat with ACE Support</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.4)', justifyContent: 'flex-end' },
  modalContainer: { backgroundColor: '#FFFFFF', width: '100%', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '85%' },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  modalTitle: { fontSize: 16, fontWeight: '800', color: '#1E293B' },
  closeCircle: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  card: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, marginBottom: 10, backgroundColor: '#FFFFFF', overflow: 'hidden' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14 },
  iconBox: { width: 30, height: 30, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  titleText: { fontSize: 13, fontWeight: '700', color: '#1E293B' },
  contentContainer: { borderTopWidth: 1, borderTopColor: '#E2E8F0', padding: 14, backgroundColor: '#F8FAFC' },
  bulletRow: { flexDirection: 'row', marginBottom: 6 },
  bullet: { fontSize: 12, color: '#475569', marginRight: 6, fontWeight: 'bold' },
  contentText: { fontSize: 12, lineHeight: 18, color: '#475569', fontWeight: '600', flex: 1 },
  whatsappCTA: { backgroundColor: '#22C55E', height: 52, borderRadius: 14, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 16, marginBottom: 10, marginHorizontal: 5 },
  whatsappCTAText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' }
});
