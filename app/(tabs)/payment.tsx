import AppHeader from "@/components/AppHeader"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Animated } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { MoneyRequest } from "@/types"
import AwesomeIcon from "react-native-vector-icons/FontAwesome"
import { useRouter } from "expo-router"
import { useRef, useState } from "react"

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
    requestedAt: new Date(),
  },
  {
    id: "2",
    receiver: "2",
    sender: "1",
    message: "Jalla",
    amount: 4500000,
    requestedAt: new Date(),
  },
  {
    id: "3",
    receiver: "2",
    sender: "1",
    message: "Jalla",
    amount: 4500000,
    requestedAt: new Date(),
  },
  {
    id: "4",
    receiver: "2",
    sender: "1",
    message: "Jalla",
    amount: 4500000,
    requestedAt: new Date(),
  },
  {
    id: "5",
    receiver: "2",
    sender: "1",
    message: "Jalla",
    amount: 4500000,
    requestedAt: new Date(),
  },
  {
    id: "6",
    receiver: "2",
    sender: "1",
    message: "Jalla",
    amount: 4500000,
    requestedAt: new Date(),
  },
  {
    id: "7",
    receiver: "1",
    sender: "2",
    message: "",
    amount: 5800000,
    requestedAt: new Date(),
  },
  {
    id: "8",
    receiver: "1",
    sender: "2",
    message: "",
    amount: 5800000,
    requestedAt: new Date(),
  },
]

const PaymentScreen = () => {
  const router = useRouter()
  const balance = 1425503
  const [lastScrollY, setLastScrollY] = useState(0)
  const [scrollDirection, setScrollDirection] = useState("up")
  const translateY = useRef(new Animated.Value(0)).current

  function handleCancel() {
    console.log("Cancel")
  }

  function handleAccept() {
    console.log("Accept")
  }

  function handleSend() {
    router.push({
      pathname: "../AskSend",
      params: {
        ask: "false",
      },
    })
  }

  function handleAsk() {
    router.push({
      pathname: "../AskSend",
      params: {
        ask: "true",
      },
    })
  }

  function handleScroll(event: any) {
    const currentY = event.nativeEvent.contentOffset.y
    const contentHeight = event.nativeEvent.contentSize.height
    const layoutHeight = event.nativeEvent.layoutMeasurement.height

    const goingDown = currentY > lastScrollY

    const threshold = 0
    const atTop = currentY <= 0
    const atBottom = currentY >= contentHeight - layoutHeight

    if (!atTop && !atBottom && Math.abs(currentY - lastScrollY) > threshold) {
      if ((goingDown && scrollDirection === "up") || (!goingDown && scrollDirection === "down")) {
        setScrollDirection(goingDown ? "down" : "up")
        Animated.timing(translateY, {
          toValue: goingDown ? 120 : 0,
          duration: 200,
          useNativeDriver: true,
        }).start()
      }
    }

    setLastScrollY(currentY)
  }

  function renderUser(user: User) {
    return (
      <TouchableOpacity
        style={styles.userContainer}
        onPress={() =>
          router.push({
            pathname: "../PaymentHistory",
            params: {
              name: user.name,
              userId: user.uid,
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
            Du ber {request.receiver} om {new Intl.NumberFormat("nb-NO").format(request.amount)} kr
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
            {request.sender} ber deg om {new Intl.NumberFormat("nb-NO").format(request.amount)} kr
          </Text>
          <TouchableOpacity onPress={handleAccept}>
            <Text style={{ ...styles.requestText, color: "green" }}>Godta</Text>
          </TouchableOpacity>
        </View>
      )
    }
  }

  function renderListHeader() {
    return (
      <View>
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
        <Text style={styles.balance}>{new Intl.NumberFormat("nb-NO").format(balance)}</Text>
      </View>
    )
  }

  return (
    <SafeAreaView className="h-full bg-white" edges={["top", "left", "right"]}>
      <AppHeader />
      <View style={styles.container}>
        <FlatList
          style={styles.requestList}
          contentContainerStyle={{ paddingBottom: 40 }}
          data={dummyData}
          renderItem={(req) => renderPayment(req.item)}
          ListHeaderComponent={renderListHeader}
          scrollEnabled={true}
          onScroll={handleScroll}
          keyExtractor={(req) => req.id}
          showsVerticalScrollIndicator={false}
        ></FlatList>
        <Animated.View style={[styles.bottomContainer, { transform: [{ translateY }] }]}>
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
        </Animated.View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  userList: {
    width: "100%",
    height: 70,
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
  },
  balance: {
    fontSize: 50,
    marginTop: 10,
    color: "#52D1DC",
    textAlign: "center",
  },
  requestList: {
    width: "100%",
    flexGrow: 1,
    alignContent: "center",
    paddingTop: 20,
  },
  request: {
    padding: 10,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginVertical: 10,
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
})

export default PaymentScreen
