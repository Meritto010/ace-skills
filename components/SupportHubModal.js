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

  const faqs = [
    {
      q: 'How do I activate ACE PRO?',
      a: 'Open Settings → Activate License → Enter your activation key → Tap Activate.'
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
      a: 'Focus Track helps personalize your curated learning streams without changing the app layout.'
    }
  ];

  const toggleFaq = (index) => {
    LayoutAnimation.configureNext(
      LayoutAnimation.Presets.easeInEaseOut
    );

    setActiveFaq(activeFaq === index ? null : index);
  };

  const openWhatsAppSupport = async () => {
    const phone = '919074887447';

    const message = encodeURIComponent(
      'Hi ACE Support Team, I need help with my Skills App.'
    );

    const url = `https://wa.me/${phone}?text=${message}`;

    try {
      await Linking.openURL(url);
    } catch (e) {
      console.log('WhatsApp Error:', e);
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >

      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>

          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>

              {/* HEADER */}
              <View style={styles.header}>

                <View style={styles.headerLeft}>
                  <Ionicons
                    name="chatbubbles-outline"
                    size={20}
                    color={ACE_BLUE}
                  />

                  <Text style={styles.headerTitle}>
                    ACE Support Desk
                  </Text>
                </View>

                <TouchableOpacity onPress={onClose}>
                  <Ionicons
                    name="close"
                    size={22}
                    color="#64748B"
                  />
                </TouchableOpacity>

              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollBody}
              >

                {/* ACCOUNT STATUS */}
                <View style={[
                  styles.statusCard,
                  isPro ? styles.proCard : styles.freeCard
                ]}>

                  <View style={styles.statusRow}>
                    <Ionicons
                      name={isPro ? 'ribbon-outline' : 'lock-closed-outline'}
                      size={18}
                      color={isPro ? '#15803D' : '#DC2626'}
                    />

                    <Text style={[
                      styles.statusTitle,
                      {
                        color: isPro
                          ? '#15803D'
                          : '#DC2626'
                      }
                    ]}>
                      {isPro ? 'ACE PRO ACTIVE' : 'FREE VERSION'}
                    </Text>
                  </View>

                  <Text style={styles.statusDescription}>
                    {isPro
                      ? 'You have access to premium curated skills streams and learning assets.'
                      : 'Upgrade to ACE PRO to unlock premium stream resources and curated content.'}
                  </Text>

                </View>

                {/* FAQ SECTION */}
                <Text style={styles.sectionHeading}>
                  SUPPORT FAQ
                </Text>

                {faqs.map((faq, index) => (
                  <View key={index} style={styles.faqCard}>

                    <TouchableOpacity
                      style={styles.faqHeader}
                      activeOpacity={0.8}
                      onPress={() => toggleFaq(index)}
                    >

                      <Text style={styles.questionText}>
                        {faq.q}
                      </Text>

                      <Ionicons
                        name={
                          activeFaq === index
                            ? 'chevron-up'
                            : 'chevron-down'
                        }
                        size={18}
                        color="#64748B"
                      />

                    </TouchableOpacity>

                    {activeFaq === index && (
                      <View style={styles.answerContainer}>
                        <Text style={styles.answerText}>
                          {faq.a}
                        </Text>
                      </View>
                    )}

                  </View>
                ))}

              </ScrollView>

              {/* FOOTER */}
              <View style={styles.footer}>

                <TouchableOpacity
                  style={styles.whatsappButton}
                  onPress={openWhatsAppSupport}
                >

                  <Ionicons
                    name="logo-whatsapp"
                    size={18}
                    color="#FFFFFF"
                    style={{ marginRight: 8 }}
                  />

                  <Text style={styles.whatsappText}>
                    Chat with Support
                  </Text>

                </TouchableOpacity>

                <Text style={styles.footerNote}>
                  Monday - Saturday • 9 AM to 6 PM
                </Text>

              </View>

            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>

    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18
  },

  modalContainer: {
    width: '100%',
    maxHeight: '86%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden'
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0'
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },

  headerTitle: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B'
  },

  scrollBody: {
    padding: 18,
    paddingBottom: 30
  },

  statusCard: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 22,
    borderWidth: 1
  },

  proCard: {
    backgroundColor: '#ECFDF3',
    borderColor: '#BBF7D0'
  },

  freeCard: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA'
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },

  statusTitle: {
    fontSize: 13,
    fontWeight: '800',
    marginLeft: 6
  },

  statusDescription: {
    fontSize: 12,
    lineHeight: 18,
    color: '#334155',
    fontWeight: '500'
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
    color: '#475569',
    lineHeight: 18,
    fontWeight: '500'
  },

  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#FFFFFF'
  },

  whatsappButton: {
    backgroundColor: '#25D366',
    borderRadius: 12,
    height: 48,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },

  whatsappText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800'
  },

  footerNote: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600'
  }
});