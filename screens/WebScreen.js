import React, { useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

import ViewerScreen from '../layouts/ViewerScreen';

const ACE_BLUE = '#0F4C81';

export default function WebScreen({ navigation, route }) {

  const {
    url,
    title = 'Web View',
  } = route.params;

  const [loading, setLoading] = useState(true);

  return (
    <ViewerScreen
      navigation={navigation}
      title={title}
      contentStyle={styles.content}
    >
      <View style={styles.container}>

        <WebView
          source={{ uri: url }}
          onLoadEnd={() => setLoading(false)}
        />

        {loading && (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={ACE_BLUE} />
          </View>
        )}

      </View>
    </ViewerScreen>
  );
}

const styles = StyleSheet.create({

  content: {
    flex: 1,
    padding: 0,
  },

  container: {
    flex: 1,
  },

  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },

});