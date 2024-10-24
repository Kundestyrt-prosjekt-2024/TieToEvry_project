import { View, Text, TextInput, Button, Pressable } from "react-native"
import { useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { TouchableOpacity } from "react-native-gesture-handler"
import { registerUser } from "@/backend/src/authentication"
import { useRouter } from "expo-router"
import Ionicons from "@expo/vector-icons/Ionicons"

const signupAdult = () => {
  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phonenumber, setPhonenumber] = useState("")
  const [birthdate, setBirthdate] = useState("")

  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)

  const handleSignUp = async () => {
    setError(null)
    setSuccess(false)

    if (!name || !email || !password || !phonenumber || !birthdate) {
      setError("Vennligst fyll ut alle feltene.")
      return
    }

    const phoneNumberNumeric = Number(phonenumber)
    const birthdateDate = new Date(birthdate)

    if (isNaN(phoneNumberNumeric)) {
      setError("Telefonnummer må være et gyldig nummer.")
      return
    }

    try {
      await registerUser(email, password, name, phoneNumberNumeric, birthdateDate)
      setSuccess(true)

      setTimeout(() => {
        router.push("/(auth)/login")
      }, 1500)
    } catch (error) {
      setError("Registreringen mislyktes. Vennligst prøv igjen.")
      console.error("Error during registration:", error)
    }
  }

  return (
    <SafeAreaView className="flex-1 justify-center items-center relative">
      <Pressable
        className="absolute top-20 left-4 flex-row items-center gap-2"
        onPress={() => router.navigate("/(auth)/login")}
      >
        <Ionicons name="chevron-back" size={24} color="#3b82f6" />
        <Text className="text-blue-500">Tilbake</Text>
      </Pressable>
      <View className="w-full items-center">
        <Text className="text-2xl font-bold mb-4">Registrer deg</Text>

        <View className="h-5 w-4/5 mb-4">
          {error ? (
            <Text className="text-red-500">{error}</Text>
          ) : success ? (
            <Text className="text-green-500">Registrering vellykket</Text>
          ) : null}
        </View>

        {/* Name Input */}
        <TextInput
          placeholder="Navn"
          value={name}
          onChangeText={setName}
          className="border border-gray-300 w-4/5 p-4 mb-4 rounded-lg"
        />

        {/* Email Input */}
        <TextInput
          placeholder="E-post"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          className="border border-gray-300 w-4/5 p-4 mb-4 rounded-lg"
        />

        {/* Password Input */}
        <TextInput
          placeholder="Passord"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          className="border border-gray-300 w-4/5 p-4 mb-4 rounded-lg"
        />

        {/* Phone Number Input */}
        <TextInput
          placeholder="Telefonnummer"
          value={phonenumber}
          onChangeText={setPhonenumber}
          keyboardType="phone-pad"
          className="border border-gray-300 w-4/5 p-4 mb-4 rounded-lg"
        />

        {/* Birthdate Input (For simplicity, using text for now) */}
        <TextInput
          placeholder="Fødselsdato (YYYY-MM-DD)"
          value={birthdate}
          onChangeText={setBirthdate}
          autoCorrect={false}
          className="border border-gray-300 w-4/5 p-4 mb-8 rounded-lg"
        />

        {/* Sign Up Button */}
        <TouchableOpacity className="bg-blue-500 w-4/5 p-4 rounded-lg" onPress={handleSignUp}>
          <Text className="text-white text-center text-lg font-bold">Registrer deg</Text>
        </TouchableOpacity>

        {/* Register child */}
        <View className="mt-4 w-4/5">
          <Text className="mt-8">Ønsker du å opprette en konto for ditt barn?</Text>
          <Pressable onPress={() => router.navigate("/(auth)/signupChild")}>
            <Text className="text-blue-500">Registrer ditt barn her!</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default signupAdult
