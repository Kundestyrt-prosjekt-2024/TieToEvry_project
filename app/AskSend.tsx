import { useLocalSearchParams } from "expo-router"
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, FlatList } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"

const AskSend = () => {
  const params = useLocalSearchParams()
  const ask = params.ask as string
  const isAsk = ask === "true"

  function handleAskSend() {
    if (isAsk) {
      console.log("Ask pressed")
    } else {
      console.log("Send pressed")
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      <View style={styles.upperContainer}>
        <TextInput
          style={styles.amountInput}
          placeholder="0"
          placeholderTextColor={"#000"}
          keyboardType="numeric"
          autoFocus
        />
        <Text style={{ fontSize: 50, fontWeight: "bold" }}> kr</Text>
      </View>
      <View style={styles.bottomContainer}>
        <TextInput style={styles.textInput} placeholder="Skriv en beskjed..." />
        <TouchableOpacity style={styles.askButton} onPress={handleAskSend}>
          <Text style={styles.askText}>{isAsk ? "Be Om" : "Send"}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "space-between",
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
})

export default AskSend
