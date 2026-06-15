import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ACE_BLUE = '#0F4C81';

const LearningCard = ({ title, type, iconName, accentBg, onPress }) => {
  // Determine icon and color based on module type
  const isFluency = type.includes('fluency');
  
  return (
    <TouchableOpacity 
      activeOpacity={0.85} 
      style={[styles.streamCard, { backgroundColor: accentBg || '#F8FAFC' }]} 
      onPress={onPress}
    >
      <View style={styles.streamTop}>
        <View style={styles.streamIconCircle}>
          <Ionicons name={iconName} size={20} color={ACE_BLUE} />
        </View>
        <View style={[styles.badge, { backgroundColor: isFluency ? '#E0F2FE' : '#FEE2E2' }]}>
          <Text style={[styles.badgeText, { color: isFluency ? '#0369A1' : '#B91C1C' }]}>
            {isFluency ? 'FLUENCY' : 'PRONOUNCE'}
          </Text>
        </View>
      </View>
      
      <View style={styles.streamBottom}>
        <Text numberOfLines={2} style={styles.streamTitle}>{title}</Text>
        <View style={styles.actionRow}>
          <Text style={styles.streamAction}>START LESSON</Text>
          <Ionicons name="play-circle" size={14} color={ACE_BLUE} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  streamCard: { width: 150, height: 160, borderRadius: 16, padding: 14, marginRight: 12, justifyContent: 'space-between', borderWidth: 1, borderColor: '#E2E8F0' },
  streamTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  streamIconCircle: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  badge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  badgeText: { fontSize: 8, fontWeight: '900' },
  streamTitle: { fontSize: 13, fontWeight: '800', color: '#1E293B', marginTop: 10 },
  actionRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  streamAction: { fontSize: 10, fontWeight: '900', color: ACE_BLUE, marginRight: 4 },
});

export default LearningCard;
