import { requestMoneyFS, sendMoneyFS } from "@/backend/src/paymentsDAO"
import { User } from "@/backend/types/user"
import { useGetParents } from "@/hooks/useGetFirestoreData"
import { useLocalSearchParams } from "expo-router"
import { useState } from "react"
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, FlatList, Image } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"

const AskSend = () => {
  const params = useLocalSearchParams()
  const ask = params.ask as string
  const currentId = params.currentId as string
  const parentIds = Array.isArray(params.parentIds) ? params.parentIds : params.parentIds ? [params.parentIds] : []
  const parents = useGetParents(parentIds)
  const isAsk = ask === "true"
  const [selectedReceiver, setSelectedReveiver] = useState<string>(parents[0].data?.uid || "")
  const [amount, setAmount] = useState<number>(0)
  const [message, setMessage] = useState<string>("")

  function handleAskSend() {
    if (isAsk) {
      requestMoneyFS(selectedReceiver, currentId, amount, message)
    } else {
      sendMoneyFS(currentId, selectedReceiver, amount, message)
    }
  }

  function renderUser(user: User) {
    const isSelected = selectedReceiver === user.uid
    return (
      <TouchableOpacity
        style={[styles.userContainer, { backgroundColor: isSelected ? "#52D1DC50" : "transparent" }]}
        onPress={() => setSelectedReveiver(user.uid)}
        activeOpacity={1}
      >
        <View style={styles.userCircle}>
          <Image source={{ uri: user.profilePicture }} className="w-full h-full" style={{ resizeMode: "cover" }} />
        </View>
        <Text>{user.name}</Text>
      </TouchableOpacity>
    )
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      <View style={{ height: 100 }}>
        <FlatList
          style={styles.userList}
          scrollEnabled={true}
          horizontal={true}
          contentContainerStyle={styles.userListContent}
          data={parents}
          renderItem={(req) => renderUser(req.item.data as User)}
          keyExtractor={(req) => req.data?.uid || ""}
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
        ></FlatList>
      </View>
      <View style={styles.mainContainer}>
        <View style={styles.upperContainer}>
          <TextInput
            style={styles.amountInput}
            value={amount.toString()}
            onChangeText={(text) => setAmount(parseInt(text) || 0)}
            placeholder="0"
            placeholderTextColor={"#000"}
            keyboardType="numeric"
            autoFocus
          />
          <Text style={{ fontSize: 50, fontWeight: "bold" }}> kr</Text>
        </View>
        <View style={styles.bottomContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Skriv en beskjed..."
            value={message}
            onChangeText={setMessage}
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
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "center",
  },
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
