import AppHeader from "@/components/ui/AppHeader"
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
      <WebView
        originWhitelist={["*"]}
        source={{ html: htmlContent }}
        className="flex-1 z-10"
        mediaPlaybackRequiresUserAction={true} // Stops auto-play on iOS
        allowsInlineMediaPlayback={true} // Allows inline playback on iOS
        javaScriptEnabled={true}
        domStorageEnabled={true}
        scrollEnabled={false}
      />
    </SafeAreaView>
  )
}

export default Education
