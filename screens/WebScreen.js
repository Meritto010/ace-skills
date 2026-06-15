import React from 'react';
import { StyleSheet, SafeAreaView, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function WebScreen({ route }) {
  const { url } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      {/* Container adds spacing so the WebView doesn't touch the edges */}
      <View style={styles.webViewContainer}>
        <WebView 
          source={{ uri: url }} 
          style={styles.webview}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFFFFF' 
  },
  webViewContainer: { 
    flex: 1, 
    padding: 10, // Adds 10px spacing around the WebView
    backgroundColor: '#FFFFFF' 
  },
  webview: { 
    flex: 1,
    borderRadius: 12, // Optional: rounds the corners of the WebView
    overflow: 'hidden' // Required for borderRadius to work on Android
  }
});
