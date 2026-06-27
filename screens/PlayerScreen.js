import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import { Video, ResizeMode } from 'expo-av';

import ViewerScreen from '../layouts/ViewerScreen';

export default function PlayerScreen({

  navigation,
  route,

}) {

  const {

    url,
    title,
    type,

  } = route.params;

  const [loading, setLoading] = useState(
    type === 'video'
  );

  return (

    <ViewerScreen
      navigation={navigation}
      title={title}
      contentStyle={styles.content}
    >

      {type === 'video' ? (

        <View style={styles.videoContainer}>

          <Video
            source={{ uri: url }}
            style={styles.media}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            onLoad={() => setLoading(false)}
          />

          {loading && (

            <View style={styles.loader}>

              <ActivityIndicator
                size="large"
                color="#0F4C81"
              />

            </View>

          )}

        </View>

      ) : (

        <View style={styles.audioCard}>

          <Text style={styles.audioTitle}>
            {title}
          </Text>

          <ActivityIndicator
            size="large"
            color="#0F4C81"
          />

          <Text style={styles.audioHint}>
            Native audio playback is active.
          </Text>

        </View>

      )}

    </ViewerScreen>

  );

}

const styles = StyleSheet.create({

  content: {
    flex: 1,
    padding: 20,
  },

  videoContainer: {
    flex: 1,
    justifyContent: 'center',
  },

  media: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    backgroundColor: '#000',
  },

  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },

  audioCard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 24,
  },

  audioTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 20,
    textAlign: 'center',
  },

  audioHint: {
    marginTop: 20,
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
  },

});