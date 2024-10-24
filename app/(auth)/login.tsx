import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { loginUser } from "@/backend/src/authentication"
import { useRouter } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"

export default function Login() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async () => {
    setError(null)

    try {
      const user = await loginUser(email, password)
      if (user) {
        const userData = JSON.stringify(user)
        await AsyncStorage.setItem("userID", userData)
        router.push("/(tabs)/home")
      }
    } catch (error) {
      setError("Bruker ikke funnet eller innlogging mislyktes. Vennligst prøv igjen.")
      console.error("Error during login:", error)
    }
  }

  // Function to handle sign-up action
  const handleSignUp = () => {
    router.navigate("/(auth)/signup")
    // Add navigation to sign-up screen
  }

  return (
    <SafeAreaView className="flex-1 justify-center items-center">
      <View className="w-full items-center">
        {/* Logo */}
        <Image resizeMode="contain" className="w-2/5 h-8 mb-8" source={require("@/assets/images/Tietoevry_logo.png")} />

        {/* Welcome Text */}
        <Text className="text-2xl font-bold mb-8">Velkommen til Sphare!</Text>

        {error && <Text className="mb-4 text-red-500 w-4/5">{error}</Text>}
        {/* Email Input */}
        <TextInput
          autoCapitalize="none"
          className="border border-gray-300 w-4/5 p-4 mb-4 rounded-lg"
          placeholder="Skriv inn mail"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        {/* Password Input */}
        <TextInput
          autoCapitalize="none"
          className="border border-gray-300 w-4/5 p-4 mb-8 rounded-lg"
          placeholder="Skriv inn passord"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* Login Button */}
        <TouchableOpacity className="bg-blue-500 w-4/5 p-4 rounded-lg" onPress={handleLogin}>
          <Text className="text-white text-center text-lg font-bold">Logg inn</Text>
        </TouchableOpacity>

        {/* Sign Up Button */}
        <TouchableOpacity className="mt-4" onPress={handleSignUp}>
          <Text className="text-blue-500 text-lg font-bold">Har du ikke en konto? Registrer deg*</Text>
        </TouchableOpacity>
        <Text className="mt-8 w-4/5 text-xs">*Dersom du er et barn må dine foreldre opprette din konto for deg.</Text>
      </View>
    </SafeAreaView>
  )
}
