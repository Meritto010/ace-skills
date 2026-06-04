import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

export default function WebScreen({ route }) {
  const { url } = route.params;

  return (
    <View style={styles.container}>
      <WebView 
        source={{ uri: url }} 
        startInLoadingState={true}
        renderLoading={() => (
          <ActivityIndicator size="large" color="#0F4C81" style={styles.loader} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  loader: { position: 'absolute', top: '50%', left: '50%', marginLeft: -12 }
});