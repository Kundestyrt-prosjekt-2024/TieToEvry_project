import { View, Text, TextInput, Pressable } from "react-native"
import React, { useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { loginUser, registerChild, registerUser } from "@/backend/src/authentication"
import { TouchableOpacity } from "react-native-gesture-handler"
import { useRouter } from "expo-router"
import Ionicons from "@expo/vector-icons/Ionicons"

const signupChild = () => {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [phonenumber, setPhonenumber] = useState("")
  const [birthdate, setBirthdate] = useState("")
  const [parentID, setParentID] = useState("")

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)

  const handleLogin = async () => {
    setError(null)
    setIsLoggedIn(false)

    try {
      const userID = await loginUser(email, password)
      if (userID) {
        setParentID(userID)
        setIsLoggedIn(true)

        setEmail("")
        setPassword("")
      }
    } catch (error) {
      setError("Bruker ikke funnet eller innlogging mislyktes. Vennligst prøv igjen.")
      console.error("Error during login:", error)
    }
  }

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
      await registerChild(email, password, name, phoneNumberNumeric, birthdateDate, parentID)
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
        onPress={() => router.navigate("/(auth)/signupAdult")}
      >
        <Ionicons name="chevron-back" size={24} color="#3b82f6" />
        <Text className="text-blue-500">Tilbake</Text>
      </Pressable>
      <View className="w-full items-center">
        {!isLoggedIn ? (
          <>
            <Text className="mb-8">Før du kan registrere ditt barn må du logge inn selv.</Text>
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
          </>
        ) : (
          <>
            <Text className="mb-8 text-xl font-bold">Registrer ditt barn</Text>

            {error && <Text className="text-red-500 mb-4">{error}</Text>}

            {/* Display success message if registration is successful */}
            {success && <Text className="text-green-500 mb-4">Registrering vellykket</Text>}

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
          </>
        )}
      </View>
    </SafeAreaView>
  )
}

export default signupChild
