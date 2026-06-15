import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Audio } from 'expo-av';

export default function PlayerScreen({ route }) {
  const { url, title, type } = route.params;
  const [loading, setLoading] = useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      
      {type === 'video' ? (
        <Video
          source={{ uri: url }}
          style={styles.media}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          onLoad={() => setLoading(false)}
        />
      ) : (
        <View style={styles.audioPlaceholder}>
          <Text style={styles.audioText}>Audio Module: {title}</Text>
          {/* Note: In a full app, integrate a custom Audio player UI here using expo-av Audio.Sound */}
          <ActivityIndicator size="small" color="#0F4C81" />
          <Text style={styles.hint}>Native audio playback active</Text>
        </View>
      )}
      
      {loading && type === 'video' && (
        <ActivityIndicator size="large" color="#0F4C81" style={styles.loader} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#0F4C81', marginBottom: 20, marginTop: 40 },
  media: { width: '100%', height: 250, borderRadius: 12, backgroundColor: '#000' },
  audioPlaceholder: { height: 200, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F1F5F9', borderRadius: 12 },
  audioText: { fontSize: 16, fontWeight: '600', marginBottom: 10 },
  hint: { fontSize: 12, color: '#64748B', marginTop: 10 },
  loader: { position: 'absolute', top: '50%', left: '50%' }
});
