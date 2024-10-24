import { Text, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useRouter } from "expo-router"

const Signup = () => {
  const router = useRouter()

  return (
    <SafeAreaView className="flex-1 justify-center items-center">
      <Text className="text-2xl font-bold mb-8">Velg registreringstype</Text>

      {/* Option for registering a child */}
      <TouchableOpacity
        className="bg-blue-500 w-4/5 p-4 rounded-lg mb-4"
        onPress={() => router.push("/signupChild")} // Navigate to the child sign-up page
      >
        <Text className="text-white text-center text-lg font-bold">Registrer barn</Text>
      </TouchableOpacity>

      {/* Option for normal registration */}
      <TouchableOpacity
        className="bg-blue-500 w-4/5 p-4 rounded-lg"
        onPress={() => router.push("/signupAdult")} // Navigate to the adult sign-up page
      >
        <Text className="text-white text-center text-lg font-bold">Registrer deg selv</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default Signup
