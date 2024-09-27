import AppHeader from "@/components/AppHeader"
import { Text, View, Image } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
// import FastImage from 'react-native-fast-image'

const Home = () => {
  return (
    <SafeAreaView>
      <AppHeader />
      <Text>Home</Text>
      <Image />
      <Text>Balance</Text>
    </SafeAreaView>
  )
}

export default Home
