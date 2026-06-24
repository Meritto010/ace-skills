import React from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import Pdf from 'react-native-pdf';

export default function PdfReaderScreen({ route }) {
  const { url } = route.params;

  return (
    <View style={styles.container}>
      <Pdf
        source={{ uri: url, cache: true }}
        style={styles.pdf}
        onLoadComplete={(numberOfPages) => {
          console.log(`Number of pages: ${numberOfPages}`);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width
  }
});
