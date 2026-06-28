import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import Pdf from 'react-native-pdf';

import ViewerScreen from '../layouts/ViewerScreen';

const ACE_BLUE = '#0F4C81';

export default function PdfReaderScreen({
  navigation,
  route,
}) {
  const {
    url,
    title = 'PDF Viewer',
  } = route.params;

  const [loading, setLoading] = useState(true);

  const [loadError, setLoadError] = useState(false);

  return (
    <ViewerScreen
      navigation={navigation}
      title={title}
      contentStyle={styles.content}
    >
      <View style={styles.container}>
        <Pdf
          source={{
            uri: url,
            cache: true,
          }}
          style={styles.pdf}
          trustAllCerts={false}
          onLoadComplete={() => {
            setLoading(false);
            setLoadError(false);
          }}
          onError={(error) => {
            console.log('PDF Error:', error);
            setLoading(false);
            setLoadError(true);
          }}
        />

        {loading && (
          <View style={styles.loader}>
            <ActivityIndicator
              size="large"
              color={ACE_BLUE}
            />
          </View>
        )}

        {loadError && (
          <View style={styles.errorOverlay}>
            <ActivityIndicator
              size="small"
              color={ACE_BLUE}
            />
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
    backgroundColor: '#FFFFFF',
  },

  pdf: {
    flex: 1,
    width: '100%',
    backgroundColor: '#FFFFFF',
  },

  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },

  errorOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});