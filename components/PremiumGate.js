import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';

export default function PremiumGate({

  navigation,

  title = 'Premium Content',

  message = 'Activate Premium Membership to access this content.',

  buttonText = 'Activate Premium',

}) {

  const { isActivated } = useAuth();

  // Premium users never see this component
  if (isActivated) {
    return null;
  }

  return (

    <View style={styles.container}>

      <Ionicons
        name="lock-closed"
        size={72}
        color="#0F4C81"
      />

      <Text style={styles.title}>
        {title}
      </Text>

      <Text style={styles.message}>
        {message}
      </Text>

      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.9}
        onPress={() =>
          navigation.replace('Activation')
        }
      >

        <Ionicons
          name="key"
          size={18}
          color="#FFFFFF"
          style={styles.icon}
        />

        <Text style={styles.buttonText}>
          {buttonText}
        </Text>

      </TouchableOpacity>

    </View>

  );

}

const styles = StyleSheet.create({

  container: {

    flex: 1,

    justifyContent: 'center',

    alignItems: 'center',

    paddingHorizontal: 28,

    backgroundColor: '#FFFFFF',

  },

  title: {

    marginTop: 22,

    fontSize: 24,

    fontWeight: '700',

    color: '#1E293B',

    textAlign: 'center',

  },

  message: {

    marginTop: 12,

    fontSize: 16,

    lineHeight: 24,

    color: '#64748B',

    textAlign: 'center',

  },

  button: {

    marginTop: 32,

    backgroundColor: '#0F4C81',

    borderRadius: 14,

    paddingVertical: 15,

    paddingHorizontal: 24,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    elevation: 2,

  },

  icon: {

    marginRight: 10,

  },

  buttonText: {

    color: '#FFFFFF',

    fontWeight: '700',

    fontSize: 16,

  },

});