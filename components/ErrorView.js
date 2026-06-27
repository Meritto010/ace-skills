import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ErrorView({
  title = 'Something went wrong',
  message = 'Unable to load content.',
  buttonText = 'Try Again',
  onRetry,
}) {
  return (
    <View style={styles.container}>
      <Ionicons
        name="cloud-offline-outline"
        size={70}
        color="#EF4444"
      />

      <Text style={styles.title}>
        {title}
      </Text>

      <Text style={styles.message}>
        {message}
      </Text>

      {onRetry && (
        <TouchableOpacity
          style={styles.button}
          onPress={onRetry}
          activeOpacity={0.85}
        >
          <Ionicons
            name="refresh"
            size={18}
            color="#FFFFFF"
            style={{ marginRight: 8 }}
          />

          <Text style={styles.buttonText}>
            {buttonText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 30,
  },

  title: {
    marginTop: 18,
    fontSize: 22,
    fontWeight: '800',
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
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F4C81',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
  },

  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },

});