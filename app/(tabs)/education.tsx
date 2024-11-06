import AppHeader from "@/components/AppHeader";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from 'react';
import { WebView } from 'react-native-webview';

const Education = () => {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Gobi Education Module</title>
      </head>
      <body>
      <script src="https://widget.gobistories.com/gwi/6" async onload="gobi.discover()"></script>
      <div class="gobi-collection" data-gobi-collection-id="zmorw"></div>
      </body>
    </html>
  `;

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader />
      <View style={styles.container}>
        <WebView 
          originWhitelist={['*']}
          source={{ html: htmlContent }}
          style={styles.webview}
          mediaPlaybackRequiresUserAction={true} // Stops auto-play on iOS
          allowsInlineMediaPlayback={true}       // Allows inline playback on iOS
          javaScriptEnabled={true}
          domStorageEnabled={true}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});

export default Education;
