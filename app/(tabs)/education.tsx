import AppHeader from "@/components/AppHeader"
import { View, StyleSheet, Text, Image } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import React from "react"
import { WebView } from "react-native-webview"

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
  `

  return (
    <SafeAreaView className="flex-1 bg-white relative">
      <AppHeader />
      <View className="flex flex-row absolute top-32" style={styles.centeredView}>
        <View>
          <Image className="" source={require("@/assets/images/sphare_small.png")} />
        </View>
        <View className="relative justify-center px-8 pb-6 items-center">
          <Image className="" source={require("@/assets/images/figma_bubble.png")} />
          <Text className="absolute top-7 right-9 text-sm text-black text-center">
            Her kan du lære mer om penger og sparing!
          </Text>
        </View>
      </View>
      <WebView
        originWhitelist={["*"]}
        source={{ html: htmlContent }}
        className="flex-1 top-32"
        mediaPlaybackRequiresUserAction={true} // Stops auto-play on iOS
        allowsInlineMediaPlayback={true} // Allows inline playback on iOS
        javaScriptEnabled={true}
        domStorageEnabled={true}
        scrollEnabled={false}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    left: "50%",
    transform: [{ translateX: -130 }],
  },
})

export default Education
