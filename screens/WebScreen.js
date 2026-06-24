import React from 'react';
import { StyleSheet, SafeAreaView, View, Platform, StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';

export default function WebScreen({ route }) {
  const { url } = route.params;

  return (
    <SafeAreaView style={styles.container}>
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
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingBottom: 10,
    paddingTop: Platform.OS === 'android'
      ? (StatusBar.currentHeight || 0) + 10
      : 10
  },

  webview: {
    flex: 1
  }
});