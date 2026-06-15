import React from 'react';

import {

  Modal,

  View,

  Text,

  StyleSheet,

  TouchableOpacity,

  ScrollView,

} from 'react-native';

import { Ionicons } from '@expo/vector-icons';



const ACE_BLUE = '#0F4C81';



export default function ActivationInstructionModal({

  visible,

  onClose,

}) {

  const premiumFeatures = [

    {

      title: 'Grammar Practice',

      desc: 'Strengthen sentence formation, usage, and accuracy.',

      icon: 'book-outline',

    },

    {

      title: 'Speaking Support',

      desc: 'Improve communication confidence through guided speaking resources.',

      icon: 'mic-outline',

    },

    {

      title: 'Vocabulary Development',

      desc: 'Build word power for better communication and understanding.',

      icon: 'library-outline',

    },

  ];



  const activationSteps = [

    {

      title: 'Step 1',

      desc: 'Enter your full name and mobile number correctly.',

    },

    {

      title: 'Step 2',

      desc: 'Enter your license key in the format: ASK-XXXX-XXXX',

    },

    {

      title: 'Step 3',

      desc: 'Read and accept the Privacy Policy and Terms of Service.',

    },

    {

      title: 'Step 4',

      desc: 'Tap "Activate Premium" to unlock your Premium Membership.',

    },

  ];



  return (

    <Modal

      visible={visible}

      transparent

      animationType="slide"

    >

      <View style={styles.overlay}>

        <View style={styles.container}>

          <ScrollView

            showsVerticalScrollIndicator={false}

          >

            <View style={styles.header}>

              <View style={styles.iconBadge}>

                <Ionicons

                  name="school-outline"

                  size={26}

                  color="#FFF"

                />

              </View>



              <Text style={styles.title}>

                ACE English Mastery

              </Text>



              <Text style={styles.price}>

                Premium Membership – ₹499

              </Text>



              <Text style={styles.subtitle}>

                Improve Grammar, Speaking,

                and Vocabulary through

                guided learning and

                structured practice designed

                to build confidence in

                English communication.

              </Text>

            </View>



            <Text style={styles.sectionTitle}>

              PREMIUM MEMBERSHIP INCLUDES

            </Text>



            {premiumFeatures.map(

              (item, index) => (

                <View

                  key={index}

                  style={styles.featureCard}

                >

                  <View

                    style={styles.featureIcon}

                  >

                    <Ionicons

                      name={item.icon}

                      size={18}

                      color={ACE_BLUE}

                    />

                  </View>



                  <View

                    style={styles.featureTextWrap}

                  >

                    <Text

                      style={

                        styles.featureTitle

                      }

                    >

                      {item.title}

                    </Text>



                    <Text

                      style={

                        styles.featureDesc

                      }

                    >

                      {item.desc}

                    </Text>

                  </View>

                </View>

              )

            )}



            <View style={styles.freeBox}>

              <Text

                style={styles.freeTitle}

              >

                FREE LEARNING RESOURCES

                AVAILABLE

              </Text>



              <Text

                style={styles.freeText}

              >

                Explore selected Grammar,

                Speaking, and Vocabulary

                streams free to support

                your English learning

                journey.

              </Text>

            </View>



            <Text style={styles.sectionTitle}>

              ACTIVATION INSTRUCTIONS

            </Text>



            {activationSteps.map(

              (step, index) => (

                <View

                  key={index}

                  style={styles.stepCard}

                >

                  <Text

                    style={styles.stepTitle}

                  >

                    {step.title}

                  </Text>



                  <Text

                    style={styles.stepDesc}

                  >

                    {step.desc}

                  </Text>

                </View>

              )

            )}



            <View style={styles.supportBox}>

              <Ionicons

                name="logo-whatsapp"

                size={18}

                color="#16A34A"

              />



              <Text

                style={styles.supportText}

              >

                Need help with activation?

                Use WhatsApp Support for

                quick assistance.

              </Text>

            </View>



            <TouchableOpacity

              style={styles.button}

              onPress={onClose}

            >

              <Text

                style={styles.buttonText}

              >

                Continue to Activation

              </Text>

            </TouchableOpacity>

          </ScrollView>

        </View>

      </View>

    </Modal>

  );

}



const styles = StyleSheet.create({

  overlay: {

    flex: 1,

    backgroundColor:

      'rgba(15,23,42,0.55)',

    justifyContent: 'center',

    padding: 20,

  },



  container: {

    backgroundColor: '#FFFFFF',

    borderRadius: 24,

    padding: 22,

    maxHeight: '85%',

  },



  header: {

    alignItems: 'center',

    marginBottom: 20,

  },



  iconBadge: {

    width: 58,

    height: 58,

    borderRadius: 29,

    backgroundColor: ACE_BLUE,

    justifyContent: 'center',

    alignItems: 'center',

    marginBottom: 12,

  },



  title: {

    fontSize: 22,

    fontWeight: '900',

    color: ACE_BLUE,

    textAlign: 'center',

  },



  price: {

    fontSize: 15,

    fontWeight: '800',

    color: '#1E293B',

    marginTop: 6,

  },



  subtitle: {

    marginTop: 12,

    fontSize: 13,

    color: '#475569',

    textAlign: 'center',

    lineHeight: 20,

  },



  sectionTitle: {

    fontSize: 11,

    fontWeight: '900',

    color: '#94A3B8',

    letterSpacing: 1,

    marginBottom: 12,

    marginTop: 8,

  },



  featureCard: {

    flexDirection: 'row',

    alignItems: 'flex-start',

    backgroundColor: '#F8FAFC',

    borderRadius: 16,

    borderWidth: 1,

    borderColor: '#E2E8F0',

    padding: 14,

    marginBottom: 10,

  },



  featureIcon: {

    width: 38,

    height: 38,

    borderRadius: 19,

    backgroundColor: '#E0F2FE',

    justifyContent: 'center',

    alignItems: 'center',

    marginRight: 12,

  },



  featureTextWrap: {

    flex: 1,

  },



  featureTitle: {

    fontSize: 14,

    fontWeight: '800',

    color: '#1E293B',

  },



  featureDesc: {

    fontSize: 12,

    color: '#64748B',

    marginTop: 3,

    lineHeight: 18,

  },



  freeBox: {

    backgroundColor: '#EFF6FF',

    borderWidth: 1,

    borderColor: '#BFDBFE',

    borderRadius: 16,

    padding: 15,

    marginTop: 8,

    marginBottom: 10,

  },



  freeTitle: {

    fontSize: 12,

    fontWeight: '900',

    color: ACE_BLUE,

    marginBottom: 6,

  },



  freeText: {

    fontSize: 12,

    color: '#475569',

    lineHeight: 18,

  },



  stepCard: {

    backgroundColor: '#FFFFFF',

    borderWidth: 1,

    borderColor: '#E2E8F0',

    borderRadius: 14,

    padding: 14,

    marginBottom: 10,

  },



  stepTitle: {

    fontSize: 13,

    fontWeight: '900',

    color: '#1E293B',

    marginBottom: 4,

  },



  stepDesc: {

    fontSize: 12,

    color: '#64748B',

    lineHeight: 18,

  },



  supportBox: {

    flexDirection: 'row',

    alignItems: 'center',

    backgroundColor: '#DCFCE7',

    borderRadius: 14,

    borderWidth: 1,

    borderColor: '#86EFAC',

    padding: 14,

    marginTop: 6,

  },



  supportText: {

    flex: 1,

    marginLeft: 8,

    fontSize: 12,

    fontWeight: '600',

    color: '#166534',

    lineHeight: 18,

  },



  button: {

    backgroundColor: ACE_BLUE,

    borderRadius: 16,

    paddingVertical: 16,

    alignItems: 'center',

    marginTop: 18,

  },



  buttonText: {

    color: '#FFFFFF',

    fontSize: 15,

    fontWeight: '900',

  },

});
