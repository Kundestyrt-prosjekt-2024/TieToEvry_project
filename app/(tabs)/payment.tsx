import AppHeader from "@/components/AppHeader"
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { MoneyRequest } from "@/types"
import AwesomeIcon from "react-native-vector-icons/FontAwesome"
import { useRouter } from "expo-router"

export type User = {
  uid: string
  name: string
  image: string
}

const dummyData2: User[] = [
  {
    uid: "1",
    name: "Geir",
    image: "user",
  },
  {
    uid: "2",
    name: "Jalla",
    image: "user",
  },
  {
    uid: "3",
    name: "Magne",
    image: "user",
  },
]

const dummyData: MoneyRequest[] = [
  {
    id: "1",
    receiver: "1",
    sender: "2",
    message: "",
    amount: 5800000,
  },
  {
    id: "2",
    receiver: "2",
    sender: "1",
    message: "Jalla",
    amount: 4500000,
  },
  {
    id: "3",
    receiver: "2",
    sender: "1",
    message: "Jalla",
    amount: 4500000,
  },
  {
    id: "4",
    receiver: "2",
    sender: "1",
    message: "Jalla",
    amount: 4500000,
  },
  {
    id: "5",
    receiver: "2",
    sender: "1",
    message: "Jalla",
    amount: 4500000,
  },
  {
    id: "6",
    receiver: "2",
    sender: "1",
    message: "Jalla",
    amount: 4500000,
  },
  {
    id: "7",
    receiver: "1",
    sender: "2",
    message: "",
    amount: 5800000,
  },
  {
    id: "8",
    receiver: "1",
    sender: "2",
    message: "",
    amount: 5800000,
  },
]

const PaymentScreen = () => {
  const router = useRouter()

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

  function renderUser(user: User) {
    return (
      <TouchableOpacity
        style={styles.userContainer}
        onPress={() =>
          router.push({
            pathname: "/PaymentHistory",
            params: {
              name: user.name,
              id: user.uid,
            },
          })
        }
      >
        <View style={styles.userCircle}>
          <AwesomeIcon name={user.image} size={30}></AwesomeIcon>
        </View>
        <Text>{user.name}</Text>
      </TouchableOpacity>
    )
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
        <FlatList
          style={styles.userList}
          scrollEnabled={true}
          horizontal={true}
          contentContainerStyle={styles.userListContent}
          data={dummyData2}
          renderItem={(req) => renderUser(req.item)}
          keyExtractor={(req) => req.uid}
          showsHorizontalScrollIndicator={false}
        ></FlatList>
        <Text style={styles.balance}>1 425 503,-</Text>
        <FlatList
          style={styles.requestList}
          contentContainerStyle={styles.listContent}
          data={dummyData}
          renderItem={(req) => renderPayment(req.item)}
          keyExtractor={(req) => req.id}
          showsVerticalScrollIndicator={false}
        ></FlatList>
        <View style={styles.bottomContainer}>
          <View style={styles.combinedButtonContainer}>
            <TouchableOpacity style={styles.leftButton} onPress={handleAsk} activeOpacity={0.7}>
              <View style={styles.iconContainer}>
                <AwesomeIcon name="money" color={"#363534"} size={30} />
                <AwesomeIcon style={styles.arrowDown} name="arrow-down" size={25} />
              </View>
              <Text style={styles.buttonText}>Be om</Text>
            </TouchableOpacity>

            <View style={styles.verticalDivider} />

            <TouchableOpacity style={styles.rightButton} onPress={handleSend} activeOpacity={0.7}>
              <View style={styles.iconContainer}>
                <AwesomeIcon name="money" color={"#363534"} size={30} />
                <AwesomeIcon style={styles.arrowUp} name="arrow-up" size={25} />
              </View>
              <Text style={styles.buttonText}>Send</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonBackground} />
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
  userList: {
    width: "100%",
    height: 100,
    flexGrow: 1,
    alignContent: "center",
  },
  userContainer: {
    height: 70,
    width: 70,
    alignItems: "center",
    justifyContent: "center",
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
    // paddingBottom: 10,
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
    alignItems: "flex-end",
    bottom: 15,
    right: 15,
  },
  combinedButtonContainer: {
    flexDirection: "row",
    borderRadius: 50,
    width: 160,
    height: 100,
  },
  leftButton: {
    flex: 1,
    backgroundColor: "#52D1DC",
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    paddingLeft: 8,
    paddingTop: 20,
  },
  rightButton: {
    flex: 1,
    backgroundColor: "#52D1DC",
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    paddingRight: 8,
    paddingTop: 20,
  },
  buttonBackground: {
    position: "absolute",
    zIndex: -1,
    backgroundColor: "#fff",
    width: 160,
    height: 100,
    borderRadius: 50,
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
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },
  verticalDivider: {
    width: 1,
    height: "100%",
    backgroundColor: "#000",
    alignSelf: "center",
  },
  listContent: {
    paddingBottom: 120,
  },
})

export default PaymentScreen
