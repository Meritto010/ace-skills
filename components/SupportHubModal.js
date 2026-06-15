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
  UIManager,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ACE_BLUE = '#0F4C81';

export default function SupportHubModal({
  visible,
  onClose,
  isPro,
}) {
  const [activeFaq, setActiveFaq] =
    useState(null);

  const faqs = [
    {
      q: 'What is included in Premium Membership?',
      a: 'Premium Membership includes Grammar, Speaking, and Vocabulary learning support with guided resources and structured practice.',
    },
    {
      q: 'Can I continue learning with Free Access?',
      a: 'Yes. Free Access includes selected Grammar, Speaking, and Vocabulary learning streams to support your English learning journey.',
    },
    {
      q: 'How can I get support?',
      a: 'Contact ACE Support through WhatsApp for activation help, learning guidance, or general assistance.',
    },
    {
      q: 'Will learning resources be updated?',
      a: 'Yes. ACE English may periodically add new learning resources and support materials.',
    },
  ];

  const supportChannels = [
    {
      icon: 'key-outline',
      title: 'Activation Help',
    },
    {
      icon: 'school-outline',
      title: 'Learning Guidance',
    },
    {
      icon: 'help-circle-outline',
      title: 'General Support',
    },
  ];

  const toggleFaq = (index) => {
    LayoutAnimation.configureNext(
      LayoutAnimation.Presets.easeInEaseOut
    );

    setActiveFaq(
      activeFaq === index
        ? null
        : index
    );
  };

  const openWhatsAppSupport =
    () => {
      const phone =
        '919074887447';

      const message =
        encodeURIComponent(
          'Hi ACE Support Team, I need help with my ACE English app.'
        );

      Linking.openURL(
        `https://wa.me/${phone}?text=${message}`
      ).catch(() => {
        alert(
          'WhatsApp is not installed on this device.'
        );
      });
    };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback
        onPress={onClose}
      >
        <View
          style={
            styles.modalOverlay
          }
        >
          <TouchableWithoutFeedback>
            <View
              style={
                styles.modalContainer
              }
            >
              {/* Header */}
              <View
                style={
                  styles.modalHeader
                }
              >
                <View
                  style={
                    styles.headerTitleRow
                  }
                >
                  <Ionicons
                    name="help-buoy-outline"
                    size={22}
                    color={
                      ACE_BLUE
                    }
                  />

                  <Text
                    style={
                      styles.modalTitle
                    }
                  >
                    Learning
                    Support Hub
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={
                    onClose
                  }
                  style={
                    styles.closeCircle
                  }
                >
                  <Ionicons
                    name="close"
                    size={20}
                    color="#64748B"
                  />
                </TouchableOpacity>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={
                  false
                }
                contentContainerStyle={
                  styles.scrollContent
                }
              >
                {/* Account Status */}
                <View
                  style={
                    styles.statusCard
                  }
                >
                  <View
                    style={
                      styles.statusRow
                    }
                  >
                    <Text
                      style={
                        styles.statusLabel
                      }
                    >
                      ACCOUNT
                      STATUS
                    </Text>

                    <Text
                      style={[
                        styles.statusBadge,
                        {
                          color:
                            isPro
                              ? '#10B981'
                              : '#64748B',
                        },
                      ]}
                    >
                      {isPro
                        ? 'PREMIUM ACTIVE'
                        : 'FREE ACCESS'}
                    </Text>
                  </View>

                  <Text
                    style={
                      styles.statusDescription
                    }
                  >
                    {isPro
                      ? 'You have access to premium Grammar, Speaking, and Vocabulary learning support with guided resources.'
                      : 'Explore selected Grammar, Speaking, and Vocabulary learning resources. Upgrade anytime for guided premium learning.'}
                  </Text>
                </View>

                {/* Support Channels */}
                <Text
                  style={
                    styles.sectionHeading
                  }
                >
                  SUPPORT
                  AVAILABLE
                </Text>

                <View
                  style={
                    styles.channelWrapper
                  }
                >
                  {supportChannels.map(
                    (
                      item,
                      index
                    ) => (
                      <View
                        key={
                          index
                        }
                        style={
                          styles.channelCard
                        }
                      >
                        <View
                          style={
                            styles.channelIcon
                          }
                        >
                          <Ionicons
                            name={
                              item.icon
                            }
                            size={
                              18
                            }
                            color={
                              ACE_BLUE
                            }
                          />
                        </View>

                        <Text
                          style={
                            styles.channelText
                          }
                        >
                          {
                            item.title
                          }
                        </Text>
                      </View>
                    )
                  )}
                </View>

                {/* Support Note */}
                <View
                  style={
                    styles.infoBox
                  }
                >
                  <Text
                    style={
                      styles.infoTitle
                    }
                  >
                    Need Help?
                  </Text>

                  <Text
                    style={
                      styles.infoText
                    }
                  >
                    Our support
                    team can
                    assist with
                    activation,
                    learning
                    guidance,
                    and general
                    app support.
                  </Text>
                </View>

                {/* FAQ */}
                <Text
                  style={
                    styles.sectionHeading
                  }
                >
                  FREQUENTLY
                  ASKED
                  QUESTIONS
                </Text>

                {faqs.map(
                  (
                    faq,
                    index
                  ) => {
                    const isOpen =
                      activeFaq ===
                      index;

                    return (
                      <View
                        key={
                          index
                        }
                        style={
                          styles.faqCard
                        }
                      >
                        <TouchableOpacity
                          style={
                            styles.faqHeader
                          }
                          onPress={() =>
                            toggleFaq(
                              index
                            )
                          }
                          activeOpacity={
                            0.7
                          }
                        >
                          <Text
                            style={
                              styles.questionText
                            }
                          >
                            {
                              faq.q
                            }
                          </Text>

                          <Ionicons
                            name={
                              isOpen
                                ? 'chevron-up'
                                : 'chevron-down'
                            }
                            size={
                              16
                            }
                            color="#94A3B8"
                          />
                        </TouchableOpacity>

                        {isOpen && (
                          <View
                            style={
                              styles.answerContainer
                            }
                          >
                            <Text
                              style={
                                styles.answerText
                              }
                            >
                              {
                                faq.a
                              }
                            </Text>
                          </View>
                        )}
                      </View>
                    );
                  }
                )}

                {/* CTA */}
                <TouchableOpacity
                  style={
                    styles.whatsappCTA
                  }
                  onPress={
                    openWhatsAppSupport
                  }
                  activeOpacity={
                    0.85
                  }
                >
                  <Ionicons
                    name="logo-whatsapp"
                    size={18}
                    color="#FFFFFF"
                    style={{
                      marginRight: 8,
                    }}
                  />

                  <Text
                    style={
                      styles.whatsappCTAText
                    }
                  >
                    Chat with ACE
                    Support
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles =
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor:
        'rgba(15, 23, 42, 0.4)',
      justifyContent:
        'flex-end',
      alignItems:
        'center',
    },

    modalContainer: {
      backgroundColor:
        '#FFFFFF',
      width: '100%',
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      maxHeight: '85%',
      paddingBottom:
        Platform.OS ===
        'ios'
          ? 24
          : 10,
      shadowColor:
        '#0F172A',
      shadowOffset: {
        width: 0,
        height: -4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 24,
    },

    modalHeader: {
      flexDirection:
        'row',
      alignItems:
        'center',
      justifyContent:
        'space-between',
      paddingHorizontal: 20,
      paddingVertical: 18,
      borderBottomWidth: 1,
      borderBottomColor:
        '#F1F5F9',
    },

    headerTitleRow: {
      flexDirection:
        'row',
      alignItems:
        'center',
    },

    modalTitle: {
      fontSize: 16,
      fontWeight: '800',
      color: '#1E293B',
      marginLeft: 10,
    },

    closeCircle: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor:
        '#F1F5F9',
      justifyContent:
        'center',
      alignItems:
        'center',
    },

    scrollContent: {
      padding: 20,
    },

    statusCard: {
      backgroundColor:
        '#F8FAFC',
      borderWidth: 1,
      borderColor:
        '#E2E8F0',
      borderRadius: 16,
      padding: 16,
      marginBottom: 22,
    },

    statusRow: {
      flexDirection:
        'row',
      justifyContent:
        'space-between',
      alignItems:
        'center',
      marginBottom: 8,
    },

    statusLabel: {
      fontSize: 10,
      fontWeight: '800',
      color: '#64748B',
      letterSpacing: 0.5,
    },

    statusBadge: {
      fontSize: 12,
      fontWeight: '800',
    },

    statusDescription: {
      fontSize: 12,
      lineHeight: 18,
      color: '#334155',
      fontWeight: '600',
    },

    sectionHeading: {
      fontSize: 11,
      fontWeight: '800',
      color: '#64748B',
      letterSpacing: 0.8,
      marginBottom: 12,
    },

    channelWrapper: {
      flexDirection:
        'row',
      justifyContent:
        'space-between',
      marginBottom: 20,
    },

    channelCard: {
      flex: 1,
      backgroundColor:
        '#F8FAFC',
      borderWidth: 1,
      borderColor:
        '#E2E8F0',
      borderRadius: 14,
      paddingVertical: 14,
      alignItems:
        'center',
      marginHorizontal: 4,
    },

    channelIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor:
        '#E0F2FE',
      justifyContent:
        'center',
      alignItems:
        'center',
      marginBottom: 8,
    },

    channelText: {
      fontSize: 11,
      fontWeight: '700',
      color: '#1E293B',
      textAlign:
        'center',
    },

    infoBox: {
      backgroundColor:
        '#EFF6FF',
      borderRadius: 16,
      borderWidth: 1,
      borderColor:
        '#BFDBFE',
      padding: 14,
      marginBottom: 20,
    },

    infoTitle: {
      fontSize: 13,
      fontWeight: '800',
      color: ACE_BLUE,
      marginBottom: 4,
    },

    infoText: {
      fontSize: 12,
      color: '#475569',
      lineHeight: 18,
      fontWeight: '600',
    },

    faqCard: {
      borderWidth: 1,
      borderColor:
        '#E2E8F0',
      borderRadius: 12,
      overflow:
        'hidden',
      marginBottom: 10,
      backgroundColor:
        '#FFFFFF',
    },

    faqHeader: {
      flexDirection:
        'row',
      alignItems:
        'center',
      justifyContent:
        'space-between',
      padding: 14,
    },

    questionText: {
      flex: 1,
      fontSize: 13,
      fontWeight: '700',
      color: '#1E293B',
      lineHeight: 18,
      marginRight: 10,
    },

    answerContainer: {
      borderTopWidth: 1,
      borderTopColor:
        '#E2E8F0',
      padding: 14,
      backgroundColor:
        '#F8FAFC',
    },

    answerText: {
      fontSize: 12,
      lineHeight: 18,
      color: '#475569',
      fontWeight: '600',
    },

    whatsappCTA: {
      backgroundColor:
        '#22C55E',
      height: 52,
      borderRadius: 14,
      flexDirection:
        'row',
      justifyContent:
        'center',
      alignItems:
        'center',
      marginTop: 16,
      shadowColor:
        '#22C55E',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 3,
    },

    whatsappCTAText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '800',
    },
  });