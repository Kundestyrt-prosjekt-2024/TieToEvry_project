import { sendMoneyRequest } from "@/backend/src/moneyRequestsDAO"
import { transferMoney } from "@/backend/src/transactionsDAO"
import DataLoading from "@/components/DataLoading"
import {
  useGetChildren,
  useGetMoneyRequests,
  useGetParents,
  useGetUser,
  useGetUserID,
} from "@/hooks/useGetFirestoreData"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useState } from "react"
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, Pressable, Image } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"

const AskSend = () => {
  const router = useRouter()

  const params = useLocalSearchParams()
  const ask = params.ask as string
  const isAsk = ask === "true"

  const userID = useGetUserID()
  const user = useGetUser(userID.data || "")

  const parentsQuery = useGetParents(user.data?.parents || [])
  const childrenQuery = useGetChildren(user.data?.children || [])
  const siblingsQuery = useGetChildren(
    parentsQuery[0].data?.children?.filter((childID) => childID !== userID.data) || []
  )

  const parents = parentsQuery.map((query) => query.data)
  const children = childrenQuery.map((query) => query.data)
  const siblings = siblingsQuery.map((query) => query.data)

  const users = [...parents, ...children, ...siblings]

  const [selectedReceiver, setSelectedReceiver] = useState(0)
  const [amount, setAmount] = useState("")
  const [message, setMessage] = useState("")

  function handleAskSend() {
    if (isAsk) {
      sendMoneyRequest(userID.data ?? "", users[selectedReceiver]?.id ?? "", message, parseInt(amount))
      router.back()
    } else {
      try {
        transferMoney(userID.data ?? "", users[selectedReceiver]?.id ?? "", parseInt(amount), message)
        router.back()
      } catch {
        console.log("Inne nok på konto / Gått over spending limit") // TODO: Gjør noe her
      }
    }
  }

  const handleAmountChange = (text: string) => {
    // Remove any non-numeric characters
    const numericValue = text.replace(/[^0-9]/g, "")
    setAmount(numericValue)
  }

  if (
    userID.isPending ||
    user.isPending ||
    parentsQuery.some((query) => query.isPending) ||
    childrenQuery.some((query) => query.isPending) ||
    siblingsQuery.some((query) => query.isPending)
  ) {
    return <DataLoading />
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 items-center p-5 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      <View className="flex flex-row justify-center mt-6">
        {users.map((user, index) => (
          <Pressable key={user?.name} className="flex-col items-center mx-3" onPress={() => setSelectedReceiver(index)}>
            <View
              className={`rounded-full h-12 w-12 items-center overflow-hidden ${selectedReceiver === index ? "border-2 border-blue-500" : ""}`}
            >
              <Image source={{ uri: user?.profilePicture }} className="w-full h-full" style={{ resizeMode: "cover" }} />
            </View>
            <Text className={`mt-2 ${selectedReceiver === index ? "font-bold" : ""} text-sm`}>{user?.name}</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.mainContainer}>
        <View style={styles.upperContainer}>
          <TextInput
            style={styles.amountInput}
            placeholder="0"
            placeholderTextColor={"#000"}
            keyboardType="numeric"
            value={amount}
            onChangeText={handleAmountChange}
            autoFocus
          />
          <Text style={{ fontSize: 50, fontWeight: "bold" }}> kr</Text>
        </View>
        <View style={styles.bottomContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Skriv en beskjed..."
            onChangeText={(text) => setMessage(text)}
          />
          <TouchableOpacity style={styles.askButton} onPress={handleAskSend}>
            <Text style={styles.askText}>{isAsk ? "Be Om" : "Send"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  amountInput: {
    fontSize: 50,
    fontWeight: "bold",
    alignContent: "center",
  },
  upperContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 100,
  },
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 20,
  },
  textInput: {
    flex: 1,
    height: 60,
    backgroundColor: "#F5F5F5",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 30,
    paddingHorizontal: 20,
  },
  askButton: {
    width: 115,
    height: 60,
    backgroundColor: "#52D1DC",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  askText: {
    fontSize: 22,
  },
  userList: {
    width: "100%",
    alignContent: "center",
  },
  userContainer: {
    height: 90,
    width: 70,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
  },
  userCircle: {
    width: 50,
    height: 50,
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  userListContent: {
    flex: 1,
    justifyContent: "center",
    gap: 10,
  },
})

export default AskSend
