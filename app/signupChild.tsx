import { View, Text, TextInput, Pressable } from "react-native"
import React, { useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { registerChild } from "@/backend/src/authentication"
import { TouchableOpacity } from "react-native-gesture-handler"
import { useRouter } from "expo-router"
import Ionicons from "@expo/vector-icons/Ionicons"
import { useGetUserID } from "@/hooks/useGetFirestoreData"

const signupChild = () => {
  const router = useRouter()
  const userID = useGetUserID()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
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

    const birthdateTimestamp = {
      seconds: Math.floor(birthdateDate.getTime() / 1000),
      nanoseconds: 0,
    }

    if (isNaN(phoneNumberNumeric)) {
      setError("Telefonnummer må være et gyldig nummer.")
      return
    }

    if (!userID.data) {
      setError("Bruker-ID kunne ikke hentes. Vennligst prøv igjen senere.")
      return
    }

    try {
      await registerChild(email, password, name, phoneNumberNumeric, birthdateTimestamp, userID.data)
      setSuccess(true)

      setTimeout(() => {
        router.back()
      }, 1500)
    } catch (error) {
      setError("Registreringen mislyktes. Vennligst prøv igjen.")
      console.error("Error during registration:", error)
    }
  }

  return (
    <SafeAreaView className="flex-1 items-center">
      <View className="w-full items-center">
        <Text className="mb-8 text-xl font-bold">Registrer ditt barn</Text>

        <View className="min-h-[36px] w-4/5 mb-4">
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
          <Text className="text-white text-center text-lg font-bold">Registrer ditt barn</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default signupChild
