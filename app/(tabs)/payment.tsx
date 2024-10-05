import AppHeader from "@/components/AppHeader"
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { MoneyRequest } from "@/types"
import AwesomeIcon from "react-native-vector-icons/FontAwesome"

const dummyData: MoneyRequest[] = [
  {
    id: 1,
    receiver: "1",
    sender: "2",
    message: "",
    amount: 5800000,
  },
  {
    id: 2,
    receiver: "2",
    sender: "1",
    message: "Jalla",
    amount: 4500000,
  },
  {
    id: 3,
    receiver: "2",
    sender: "1",
    message: "Jalla",
    amount: 4500000,
  },
  {
    id: 4,
    receiver: "2",
    sender: "1",
    message: "Jalla",
    amount: 4500000,
  },
  {
    id: 5,
    receiver: "2",
    sender: "1",
    message: "Jalla",
    amount: 4500000,
  },
  {
    id: 6,
    receiver: "2",
    sender: "1",
    message: "Jalla",
    amount: 4500000,
  },
  {
    id: 7,
    receiver: "1",
    sender: "2",
    message: "",
    amount: 5800000,
  },
  {
    id: 8,
    receiver: "1",
    sender: "2",
    message: "",
    amount: 5800000,
  },
]

const PaymentScreen = () => {
  function handleCancel() {
    console.log("Cancel")
  }

  function handleAccept() {
    console.log("Accept")
  }

  function handleSend() {
    console.log("Send")
  }

  function handleAsk() {
    console.log("Ask")
  }

  function renderPayment(request: MoneyRequest) {
    if (request.amount <= 0) return null
    if (request.sender === "1") {
      return (
        <View style={styles.request}>
          <Text style={styles.requestText}>
            Du ber {request.receiver} om {request.amount}
          </Text>
          <TouchableOpacity onPress={handleCancel}>
            <Text style={{ ...styles.requestText, color: "red" }}>Avbryt</Text>
          </TouchableOpacity>
        </View>
      )
    } else {
      return (
        <View style={styles.request}>
          <Text style={styles.requestText}>
            {request.sender} ber deg om {request.amount}
          </Text>
          <TouchableOpacity onPress={handleAccept}>
            <Text style={{ ...styles.requestText, color: "green" }}>Godta</Text>
          </TouchableOpacity>
        </View>
      )
    }
  }

  return (
    <SafeAreaView className="h-full bg-white" edges={["top", "left", "right"]}>
      <AppHeader />
      <View style={styles.container}>
        <Text style={styles.balance}>1 425 503,-</Text>
        <FlatList
          style={styles.requestList}
          contentContainerStyle={styles.listContent}
          data={dummyData}
          renderItem={(req) => renderPayment(req.item)}
          keyExtractor={(req) => req.id.toString()}
        ></FlatList>
        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.bottomButton} onPress={handleAsk} activeOpacity={0.5}>
            <View style={styles.iconContainer}>
              <AwesomeIcon name="money" size={30} />
              <AwesomeIcon style={styles.arrowDown} name="arrow-down" size={25} />
            </View>
            <Text style={styles.buttonText}>Be om</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomButton} onPress={handleSend} activeOpacity={0.5}>
            <View style={styles.iconContainer}>
              <AwesomeIcon name="money" size={30} />
              <AwesomeIcon style={styles.arrowUp} name="arrow-up" size={25} />
            </View>
            <Text style={styles.buttonText}>Send</Text>
          </TouchableOpacity>
          <View style={styles.buttonBackgroundLeft} />
          <View style={styles.buttonBackgroundRight} />
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  balance: {
    fontSize: 50,
    color: "#52D1DC",
  },
  requestList: {
    width: "100%",
    flexGrow: 1,
    alignContent: "center",
    marginTop: 10,
  },
  request: {
    padding: 10,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginVertical: 15,
    borderRadius: 30,
    height: 70,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#52D1DC30",
  },
  requestText: {
    fontSize: 20,
  },
  bottomContainer: {
    position: "absolute",
    width: "100%",
    bottom: 10,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  bottomButton: {
    height: 100,
    width: 100,
    padding: 10,
    paddingHorizontal: 20,
    marginHorizontal: 40,
    marginTop: 20,
    borderRadius: 50,
    backgroundColor: "#52D1DC",
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    position: "relative",
  },
  arrowUp: {
    position: "absolute",
    top: -14,
    left: 5,
    color: "red",
  },
  arrowDown: {
    position: "absolute",
    top: -14,
    left: 5,
    color: "green",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonBackgroundLeft: {
    position: "absolute",
    height: 100,
    width: 100,
    borderRadius: 50,
    left: 40,
    top: 20,
    zIndex: -1,
    backgroundColor: "#fff",
  },
  buttonBackgroundRight: {
    position: "absolute",
    height: 100,
    width: 100,
    borderRadius: 50,
    right: 40,
    top: 20,
    zIndex: -1,
    backgroundColor: "#fff",
  },
  listContent: {
    paddingBottom: 120,
  },
})

export default PaymentScreen
