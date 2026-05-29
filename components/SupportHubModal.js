import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Linking,
  ScrollView,
  Platform,
  LayoutAnimation,
  UIManager
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ACE_BLUE = '#0F4C81';

export default function SupportHubModal({ visible, onClose, isPro }) {
  const [activeFaq, setActiveFaq] = useState(null);

  // ✅ FIXED: Updated FAQ instructions to align with your updated app architecture
  const faqs = [
    {
      q: 'How do I activate ACE Premium?',
      a: 'Enter your custom license sequence on the launch screen or tap any locked skill module to trigger the activation gateway.'
    },
    {
      q: 'How are Stream labels updated?',
      a: 'All Stream headings and content cards are dynamically updated from our cloud JSON feed.'
    },
    {
      q: 'Can ACE open external learning resources?',
      a: 'Yes. ACE supports YouTube videos, NotebookLM resources, PDFs, news portals, and curated external learning links.'
    },
    {
      q: 'What is Focus Track?',
      a: 'Focus Track helps personalize your curated learning streams via Settings without changing the core app layout.'
    }
  ];

  const toggleFaq = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveFaq(activeFaq === index ? null : index);
  };

  const openWhatsAppSupport = () => {
    const phone = '919074887447';
    const message = encodeURIComponent('Hi ACE Support Team, I need help with my ACE Skills App.');
    Linking.openURL(`https://wa.me/${phone}?text=${message}`).catch(() => {
      alert('WhatsApp is not installed on this device.');
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              
              {/* Header */}
              <View style={styles.modalHeader}>
                <View style={styles.headerTitleRow}>
                  <Ionicons name="help-buoy-outline" size={22} color={ACE_BLUE} />
                  <Text style={styles.modalTitle}>Support Hub</Text>
                </View>
                <TouchableOpacity onPress={onClose} style={styles.closeCircle}>
                  <Ionicons name="close" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                
                {/* Account Status Card */}
                <View style={styles.statusCard}>
                  <View style={styles.statusRow}>
                    <Text style={styles.statusLabel}>ACCOUNT TIER</Text>
                    {/* ✅ FIXED: Color inversion fixed (Green for PRO, Slate-Grey for FREE) */}
                    <Text style={[styles.statusBadge, { color: isPro ? '#10B981' : '#64748B' }]}>
                      {isPro ? 'PRO ACTIVE' : 'FREE ACCESS'}
                    </Text>
                  </View>
                  <Text style={styles.statusDescription}>
                    {isPro 
                      ? 'Thank you for upgrading! You have full unrestricted access to all core curriculum paths and corporate speech modules.'
                      : 'You are currently browsing free public learning streams. Unlock premium modules to activate complete course structures.'}
                  </Text>
                </View>

                {/* FAQ Section */}
                <Text style={styles.sectionHeading}>FREQUENTLY ASKED QUESTIONS</Text>
                {faqs.map((faq, index) => {
                  const isOpen = activeFaq === index;
                  return (
                    <View key={index} style={styles.faqCard}>
                      <TouchableOpacity 
                        style={styles.faqHeader} 
                        onPress={() => toggleFaq(index)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.questionText}>{faq.q}</Text>
                        <Ionicons 
                          name={isOpen ? "chevron-up" : "chevron-down"} 
                          size={16} 
                          color="#94A3B8" 
                        />
                      </TouchableOpacity>
                      {isOpen && (
                        <View style={styles.answerContainer}>
                          <Text style={styles.answerText}>{faq.a}</Text>
                        </View>
                      )}
                    </View>
                  );
                })}

                {/* Interactive CTA Support Button */}
                <TouchableOpacity 
                  style={styles.whatsappCTA} 
                  onPress={openWhatsAppSupport}
                  activeOpacity={0.85}
                >
                  <Ionicons name="logo-whatsapp" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                  <Text style={styles.whatsappCTAText}>Chat with Live Support</Text>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 24
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
    marginLeft: 10
  },
  closeCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center'
  },
  scrollContent: {
    padding: 20
  },
  statusCard: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  statusLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5
  },
  statusBadge: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  statusDescription: {
    fontSize: 12,
    lineHeight: 18,
    color: '#334155',
    fontWeight: '600'
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 12
  },
  faqCard: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 10,
    backgroundColor: '#FFFFFF'
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14
  },
  questionText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    lineHeight: 18,
    marginRight: 10
  },
  answerContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    padding: 14,
    backgroundColor: '#F8FAFC'
  },
  answerText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#475569',
    fontWeight: '600'
  },
  whatsappCTA: {
    backgroundColor: '#22C55E',
    height: 50,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3
  },
  whatsappCTAText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800'
  }
});
