import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AppHeader({
  title,
  navigation,
  showBack = true,
  rightComponent = null,
}) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.left}>
          {showBack ? (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              hitSlop={{
                top: 10,
                bottom: 10,
                left: 10,
                right: 10,
              }}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color="#1E293B"
              />
            </TouchableOpacity>
          ) : (
            <View style={{ width: 24 }} />
          )}
        </View>

        <View style={styles.center}>
          <Text
            numberOfLines={1}
            style={styles.title}
          >
            {title}
          </Text>
        </View>

        <View style={styles.right}>
          {rightComponent}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },

  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  left: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  right: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },

  title: {
    fontSize: 19,
    fontWeight: '900',
    color: '#1E293B',
  },
});