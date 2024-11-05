import AppHeader from "@/components/AppHeader"
import { Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { WebView } from "react-native-webview"

const Education = () => {
  const widgetHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <script src="https://widget.gobistories.com/gwi/6" async onload="gobi.discover()"></script>
      </head>
      <body>
        <div class="gobi-collection" data-gobi-collection-id="zmorw"></div>
      </body>
    </html>
  `

  return (
    <SafeAreaView className="flex-1 bg-white">
      <AppHeader />
      <WebView originWhitelist={["*"]} source={{ html: widgetHTML }} className="flex-1" />
    </SafeAreaView>
  )
}

export default Education
