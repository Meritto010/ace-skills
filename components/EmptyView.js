import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function EmptyView({
  title = 'No Content',
  message = 'There is nothing to display yet.',
}) {
  return (
    <View style={styles.container}>
      <Ionicons
        name="folder-open-outline"
        size={70}
        color="#94A3B8"
      />

      <Text style={styles.title}>
        {title}
      </Text>

      <Text style={styles.message}>
        {message}
      </Text>
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

});