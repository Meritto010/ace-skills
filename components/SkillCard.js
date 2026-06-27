import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const ACE_BLUE = '#0F4C81';

export default function SkillCard({

  title,

  subtitle = '',

  icon = 'apps-outline',

  badge = '',

  locked = false,

  disabled = false,

  onPress,

}) {

  return (

    <TouchableOpacity
      activeOpacity={0.85}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.card,
        disabled && styles.disabledCard,
      ]}
    >

      {/* Lock Badge */}

      {locked && (

        <View style={styles.lockBadge}>

          <Ionicons
            name="lock-closed"
            size={11}
            color="#EF4444"
          />

        </View>

      )}

      {/* Optional Badge */}

      {!!badge && (

        <View style={styles.badge}>

          <Text style={styles.badgeText}>

            {badge}

          </Text>

        </View>

      )}

      {/* Icon */}

      <View style={styles.iconContainer}>

        <Ionicons
          name={icon}
          size={22}
          color={ACE_BLUE}
        />

      </View>

      {/* Title */}

      <Text
        numberOfLines={2}
        style={styles.title}
      >

        {title}

      </Text>

      {/* Subtitle */}

      {!!subtitle && (

        <Text
          numberOfLines={1}
          style={styles.subtitle}
        >

          {subtitle}

        </Text>

      )}

    </TouchableOpacity>

  );

}

const styles = StyleSheet.create({

  card: {

    width: (width - 64) / 3,

    minHeight: 150,

    backgroundColor: '#FFFFFF',

    borderRadius: 16,

    paddingVertical: 18,

    paddingHorizontal: 8,

    alignItems: 'center',

    justifyContent: 'center',

    borderWidth: 1,

    borderColor: '#E2E8F0',

    position: 'relative',

    elevation: 2,

    shadowColor: '#000',

    shadowOpacity: 0.06,

    shadowRadius: 5,

    shadowOffset: {

      width: 0,

      height: 2,

    },

  },

  disabledCard: {

    opacity: 0.55,

  },

  iconContainer: {

    width: 48,

    height: 48,

    borderRadius: 14,

    backgroundColor: '#F0F7FF',

    justifyContent: 'center',

    alignItems: 'center',

    marginBottom: 12,

  },

  title: {

    fontSize: 13,

    fontWeight: '800',

    color: '#1E293B',

    textAlign: 'center',

    minHeight: 34,

  },

  subtitle: {

    marginTop: 6,

    fontSize: 11,

    color: '#64748B',

    textAlign: 'center',

  },

  lockBadge: {

    position: 'absolute',

    top: 8,

    right: 8,

    width: 22,

    height: 22,

    borderRadius: 11,

    backgroundColor: '#FEF2F2',

    justifyContent: 'center',

    alignItems: 'center',

    borderWidth: 1,

    borderColor: '#FECACA',

  },

  badge: {

    position: 'absolute',

    top: 8,

    left: 8,

    backgroundColor: '#0F4C81',

    paddingHorizontal: 6,

    paddingVertical: 2,

    borderRadius: 8,

  },

  badgeText: {

    color: '#FFFFFF',

    fontSize: 9,

    fontWeight: '800',

  },

});