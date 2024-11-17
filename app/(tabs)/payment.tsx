import AppHeader from "@/components/AppHeader"
import { View, Text, StyleSheet, TouchableOpacity, Animated, Pressable, Image, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import AwesomeIcon from "react-native-vector-icons/FontAwesome"
import { useRouter } from "expo-router"
import { useRef, useState } from "react"
import {
  useGetBankAccount,
  useGetChildren,
  useGetMoneyRequests,
  useGetParents,
  useGetUser,
  useGetUserID,
} from "@/hooks/useGetFirestoreData"
import DataLoading from "@/components/DataLoading"

const PaymentScreen = () => {
  const router = useRouter()

  const userID = useGetUserID()
  const user = useGetUser(userID.data || "")

  const account = useGetBankAccount(userID.data || "")
  const moneyRequests = useGetMoneyRequests(account.data?.id || "")

  const parentsQuery = useGetParents(user.data?.parents || [])
  const childrenQuery = useGetChildren(user.data?.children || [])
  const siblingsQuery = useGetChildren(
    parentsQuery[0].data?.children?.filter((childID) => childID !== userID.data) || []
  )

  const parents = parentsQuery.map((query) => query.data)
  const children = childrenQuery.map((query) => query.data)
  const siblings = siblingsQuery.map((query) => query.data)

  const [lastScrollY, setLastScrollY] = useState(0)
  const [scrollDirection, setScrollDirection] = useState("up")
  const translateY = useRef(new Animated.Value(0)).current

  function handleScroll(event: any) {
    const currentY = event.nativeEvent.contentOffset.y
    const contentHeight = event.nativeEvent.contentSize.height
    const layoutHeight = event.nativeEvent.layoutMeasurement.height

    const goingDown = currentY > lastScrollY

    const atTop = currentY <= 0
    const atBottom = currentY >= contentHeight - layoutHeight

    if (!atTop && !atBottom) {
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

  if (
    userID.isPending ||
    user.isPending ||
    account.isPending ||
    parentsQuery.some((query) => query.isPending) ||
    childrenQuery.some((query) => query.isPending) ||
    siblingsQuery.some((query) => query.isPending)
  ) {
    return <DataLoading />
  }

  return (
    <SafeAreaView className="h-full bg-white" edges={["top"]}>
      <AppHeader />
      <ScrollView onScroll={handleScroll}>
        <View className="flex flex-row justify-center mt-6">
          {[...parents, ...children, ...siblings].map((user, index) => (
            <Pressable key={user?.name} className="flex-col items-center mx-3" onPress={() => console.log("navigate!")}>
              <View className="rounded-full h-12 w-12 items-center overflow-hidden">
                <Image
                  source={{ uri: user?.profilePicture }}
                  className="w-full h-full"
                  style={{ resizeMode: "cover" }}
                />
              </View>
              <Text className="mt-2 text-sm">{user?.name}</Text>
            </Pressable>
          ))}
        </View>
        <Text className="text-center text-blue-500 text-2xl mt-5">Saldo: {account.data?.balance},-</Text>
      </ScrollView>
      <Animated.View style={[styles.bottomContainer, { transform: [{ translateY }] }]}>
        <TouchableOpacity
          style={styles.bottomButton}
          onPress={() => router.push(`/AskSend?ask=true`)}
          activeOpacity={0.5}
        >
          <View style={styles.iconContainer}>
            <AwesomeIcon name="money" size={30} />
            <AwesomeIcon style={styles.arrowDown} name="arrow-down" size={25} />
          </View>
          <Text style={styles.buttonText}>Be om</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomButton}
          onPress={() => router.push(`/AskSend?ask=false`)}
          activeOpacity={0.5}
        >
          <View style={styles.iconContainer}>
            <AwesomeIcon name="money" size={30} />
            <AwesomeIcon style={styles.arrowUp} name="arrow-up" size={25} />
          </View>
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
        <View style={styles.buttonBackgroundLeft} />
        <View style={styles.buttonBackgroundRight} />
      </Animated.View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
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
