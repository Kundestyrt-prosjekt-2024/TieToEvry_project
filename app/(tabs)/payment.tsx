import AppHeader from "@/components/AppHeader"
import { View, Text, StyleSheet, TouchableOpacity, Animated, Pressable, Image, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import AwesomeIcon from "react-native-vector-icons/FontAwesome"
import { useRouter } from "expo-router"
import { useEffect, useRef, useState } from "react"
import {
  useGetBankAccount,
  useGetBankAccounts,
  useGetChildren,
  useGetMoneyRequests,
  useGetParents,
  useGetUser,
  useGetUserID,
} from "@/hooks/useGetFirestoreData"
import DataLoading from "@/components/DataLoading"
import {
  acceptMoneyRequest,
  deleteMoneyRequest,
  getAllowance,
  rejectMoneyRequest,
} from "@/backend/src/moneyRequestsDAO"
import { Allowance } from "@/backend/types/moneyRequest"

const PaymentScreen = () => {
  const router = useRouter()

  const userID = useGetUserID()
  const user = useGetUser(userID.data || "")

  const bankAccount = useGetBankAccount(userID.data || "")
  const moneyRequests = useGetMoneyRequests(bankAccount.data?.id || "")

  const parentsQuery = useGetParents(user.data?.parents || [])
  const childrenQuery = useGetChildren(user.data?.children || [])
  const siblingsQuery = useGetChildren(
    parentsQuery[0]?.data?.children?.filter((childID) => childID !== userID.data) || []
  )

  const parents = parentsQuery.map((query) => query.data)
  const children = childrenQuery.map((query) => query.data)
  const siblings = siblingsQuery.map((query) => query.data)

  const users = [...parents, ...children, ...siblings]

  const isParent = parents.length == 0
  const buttons = isParent ? ["ask", "allowance", "send"] : ["ask", "send"]

  const bankAccountsQuery = useGetBankAccounts(users.map((user) => user?.id ?? ""))
  const bankAccounts = bankAccountsQuery.map((query) => query.data)

  const [lastScrollY, setLastScrollY] = useState(0)
  const [scrollDirection, setScrollDirection] = useState("up")
  const translateY = useRef(new Animated.Value(0)).current

  const [allowance, setAllowance] = useState<Allowance>()
  const dayArray = ["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag", "Søndag"]
  const recurrenceArray = ["Daglig", "Ukentlig", "Hver 2. Uke", "Månedlig"]

  useEffect(() => {
    async function fetchAllowance() {
      if (!isParent) {
        const allowance = await getAllowance(userID.data!)
        setAllowance(allowance)
      }
    }
    fetchAllowance()
  }, [userID.data])

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
    bankAccount.isPending ||
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
          {users.map((user) => (
            <Pressable
              key={user?.name}
              className="flex-col items-center mx-3"
              onPress={() => router.push(`/PaymentHistory?otherUserID=${user?.id}`)}
            >
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
        <Text className="text-center text-cyan-400 text-3xl mt-5">{bankAccount.data?.balance} kr</Text>
        {allowance && (
          <View style={styles.allowanceContainer}>
            <Text className="text-lg">Ukepenger: {allowance.amount} kr</Text>
            <Text className="text-lg">
              Utbetaling: {dayArray[allowance.day]} ({recurrenceArray[allowance.recurrence]})
            </Text>
          </View>
        )}
        <View className="flex flex-col items-center gap-4 mt-1">
          {moneyRequests.data
            ?.filter((moneyReq) => moneyReq.status === "pending")
            .map((moneyReq) => (
              <View key={moneyReq.id} className="rounded-[32px] bg-blue-100 p-6 flex flex-row justify-between w-[90%]">
                {moneyReq.sender === bankAccount.data?.id ? (
                  <>
                    <Text className="text-lg">
                      Du ber{" "}
                      {
                        users[bankAccounts.findIndex((bankAcc) => bankAcc?.id === moneyReq.receiver)]?.name.split(
                          " "
                        )[0]
                      }{" "}
                      om {moneyReq.amount} kr
                    </Text>
                    <Pressable onPress={() => deleteMoneyRequest(moneyReq.id!)}>
                      <Text className="text-red-500 text-lg">Avbryt</Text>
                    </Pressable>
                  </>
                ) : (
                  <>
                    <Text className="text-lg">
                      {users[bankAccounts.findIndex((bankAcc) => bankAcc?.id === moneyReq.sender)]?.name.split(" ")[0]}{" "}
                      ber deg om {moneyReq.amount} kr
                    </Text>
                    <View className="flex flex-row gap-2">
                      <Pressable onPress={() => acceptMoneyRequest(moneyReq.id!)}>
                        <Text className="text-green-700 text-lg">Godta</Text>
                      </Pressable>
                      <Pressable onPress={() => rejectMoneyRequest(moneyReq.id!)}>
                        <Text className="text-red-500 text-lg">Avslå</Text>
                      </Pressable>
                    </View>
                  </>
                )}
              </View>
            ))}
        </View>
      </ScrollView>
      <Animated.View style={[styles.bottomContainer, { transform: [{ translateY }] }]}>
        {buttons.map((action, index) => (
          <View key={action} style={styles.buttonContainer}>
            <View style={styles.buttonBackground} />
            <TouchableOpacity
              style={styles.bottomButton}
              onPress={() => router.push(`/AskSend?page=${action}`)}
              activeOpacity={0.5}
            >
              {action === "ask" || action === "send" ? (
                <View style={styles.iconContainer}>
                  <AwesomeIcon name="money" size={30} />
                  <AwesomeIcon
                    style={action === "ask" ? styles.arrowDown : styles.arrowUp}
                    name={action === "ask" ? "arrow-down" : "arrow-up"}
                    size={25}
                  />
                </View>
              ) : (
                <AwesomeIcon name="calendar" size={30} />
              )}
              <Text style={styles.buttonText}>
                {action === "ask" ? "Be om" : action === "allowance" ? "Ukepenger" : "Send"}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
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
    justifyContent: "space-evenly",
    flexDirection: "row",
  },
  buttonBackground: {
    position: "absolute",
    height: 100,
    width: 100,
    borderRadius: 50,
    backgroundColor: "#fff",
    zIndex: -1,
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
    borderRadius: 50,
    backgroundColor: "#52D1DC",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    position: "relative",
    marginHorizontal: 10,
  },
  allowanceContainer: {
    alignSelf: "center",
    alignItems: "center",
    padding: 10,
    margin: 10,
    borderRadius: 10,
    backgroundColor: "#cbffc4",
  },
})

export default PaymentScreen
