import AppHeader from "@/components/AppHeader"
import { Text } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const Chores = () => {
  return (
    <SafeAreaView>
      <AppHeader />
      <Text>Chores</Text>
    </SafeAreaView>
  )
}

export default Chores
