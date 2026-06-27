import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ACE_BLUE = '#0F4C81';

export default function StreamCard({

  title,

  subtitle = '',

  icon = 'apps-outline',

  accentBg = '#F8FAFC',

  actionText = 'OPEN',

  badge = '',

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
        {
          backgroundColor: accentBg,
        },
        disabled && styles.disabledCard,
      ]}
    >

      {!!badge && (

        <View style={styles.badge}>

          <Text style={styles.badgeText}>

            {badge}

          </Text>

        </View>

      )}

      <View style={styles.iconCircle}>

        <Ionicons
          name={icon}
          size={20}
          color={ACE_BLUE}
        />

      </View>

      <View style={styles.content}>

        <Text
          numberOfLines={2}
          style={styles.title}
        >

          {title}

        </Text>

        {!!subtitle && (

          <Text
            numberOfLines={2}
            style={styles.subtitle}
          >

            {subtitle}

          </Text>

        )}

      </View>

      <View style={styles.footer}>

        <Text style={styles.actionText}>

          {actionText}

        </Text>

        <Ionicons
          name="arrow-forward"
          size={14}
          color={ACE_BLUE}
        />

      </View>

    </TouchableOpacity>

  );

}

const styles = StyleSheet.create({

  card: {

    width: 150,

    height: 170,

    borderRadius: 16,

    padding: 14,

    marginRight: 12,

    justifyContent: 'space-between',

    borderWidth: 1,

    borderColor: '#E2E8F0',

    elevation: 2,

    shadowColor: '#000',

    shadowOpacity: 0.06,

    shadowRadius: 5,

    shadowOffset: {

      width: 0,

      height: 2,

    },

    position: 'relative',

  },

  disabledCard: {

    opacity: 0.55,

  },

  badge: {

    position: 'absolute',

    top: 8,

    right: 8,

    backgroundColor: ACE_BLUE,

    paddingHorizontal: 7,

    paddingVertical: 2,

    borderRadius: 8,

  },

  badgeText: {

    color: '#FFFFFF',

    fontSize: 9,

    fontWeight: '800',

  },

  iconCircle: {

    width: 42,

    height: 42,

    borderRadius: 12,

    backgroundColor: '#FFFFFF',

    justifyContent: 'center',

    alignItems: 'center',

  },

  content: {

    flex: 1,

    justifyContent: 'center',

  },

  title: {

    fontSize: 14,

    fontWeight: '800',

    color: '#1E293B',

  },

  subtitle: {

    marginTop: 6,

    fontSize: 11,

    color: '#64748B',

    lineHeight: 16,

  },

  footer: {

    flexDirection: 'row',

    alignItems: 'center',

  },

  actionText: {

    fontSize: 11,

    fontWeight: '900',

    color: ACE_BLUE,

    marginRight: 5,

  },

});