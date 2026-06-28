import React from 'react';
import { StyleSheet, SafeAreaView, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function PdfReaderScreen({ route }) {
  // Ensure you are passing 'url' when navigating to this screen
  const { url } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.webViewContainer}>
        <WebView 
          source={{ uri: url }} 
          style={styles.webview}
          // The following props improve PDF handling in WebView
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
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
    padding: 10, 
    backgroundColor: '#FFFFFF' 
  },
  webview: { 
    flex: 1,
    borderRadius: 12, 
    overflow: 'hidden' 
  }
});
