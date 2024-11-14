import { View, Text, TextInput, Button, Pressable, KeyboardAvoidingView, Platform } from "react-native"
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

    const eighteenYearsAgo = new Date()
    eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18)

    const isUnder18 = birthdateDate > eighteenYearsAgo

    if (isUnder18) {
      setError("Du må være over 18 år for å opprette en konto")
      return
    }

    const birthdateTimestamp = {
      seconds: Math.floor(birthdateDate.getTime() / 1000),
      nanoseconds: 0,
    }

    if (isNaN(phoneNumberNumeric)) {
      setError("Telefonnummer må være et gyldig nummer.")
      return
    }

    try {
      await registerUser(email, password, name, phoneNumberNumeric, birthdateTimestamp)
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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="w-full flex-col">
        <View className="w-full items-center flex flex-col">
          <View className="w-full">
            <Pressable
              className="items-center flex-row"
              onPress={() => router.navigate("/(auth)/login")}
            >
              <Ionicons name="chevron-back" size={24} color="#3b82f6" />
              <Text className="text-blue-500 ml-2 text-lg">Tilbake</Text>
            </Pressable>
            <Text className="text-2xl font-bold mb-4 w-full text-center">Registrer deg</Text>
          </View>

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
            placeholderTextColor={"gray"}
            value={name}
            onChangeText={setName}
            className="border border-gray-300 w-4/5 p-4 mb-4 rounded-lg"
          />

          {/* Email Input */}
          <TextInput
            placeholder="E-post"
            placeholderTextColor={"gray"}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            className="border border-gray-300 w-4/5 p-4 mb-4 rounded-lg"
          />

          {/* Password Input */}
          <TextInput
            placeholder="Passord"
            placeholderTextColor={"gray"}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            className="border border-gray-300 w-4/5 p-4 mb-4 rounded-lg"
          />

          {/* Phone Number Input */}
          <TextInput
            placeholder="Telefonnummer"
            placeholderTextColor={"gray"}
            value={phonenumber}
            onChangeText={setPhonenumber}
            keyboardType="phone-pad"
            className="border border-gray-300 w-4/5 p-4 mb-4 rounded-lg"
          />

          {/* Birthdate Input (For simplicity, using text for now) */}
          <TextInput
            placeholder="Fødselsdato (YYYY-MM-DD)"
            placeholderTextColor={"gray"}
            value={birthdate}
            onChangeText={setBirthdate}
            autoCorrect={false}
            className="border border-gray-300 w-4/5 p-4 mb-8 rounded-lg"
          />

          {/* Sign Up Button */}
          <TouchableOpacity className="bg-blue-500 w-4/5 p-4 rounded-lg" onPress={handleSignUp}>
            <Text className="text-white text-center text-lg font-bold">Registrer deg</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default signupAdult
