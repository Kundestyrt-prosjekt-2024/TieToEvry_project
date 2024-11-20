import { getAllowance, sendMoneyRequest, setAllowance } from "@/backend/src/moneyRequestsDAO"
import { transferMoney } from "@/backend/src/transactionsDAO"
import DataLoading from "@/components/ui/DataLoading"
import { useGetChildren, useGetParents, useGetUser, useGetUserID } from "@/hooks/useGetFirestoreData"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useEffect, useState } from "react"
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Image,
  Keyboard,
} from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { Picker } from "react-native-wheel-pick"

const AskSend = () => {
  const router = useRouter()

  const params = useLocalSearchParams()
  const page = params.page as string
  const isAsk = page === "ask"
  const isSend = page === "send"
  const isAll = page === "allowance"

  const userID = useGetUserID()
  const user = useGetUser(userID.data || "")

  const parentsQuery = useGetParents(user.data?.parents || [])
  const childrenQuery = useGetChildren(user.data?.children || [])
  const siblingsQuery = useGetChildren(
    parentsQuery[0]?.data?.children?.filter((childID) => childID !== userID.data) || []
  )

  const parents = parentsQuery.map((query) => query.data)
  const children = childrenQuery.map((query) => query.data)
  const siblings = siblingsQuery.map((query) => query.data)

  const users = [...parents, ...children, ...siblings]

  const [selectedReceiver, setSelectedReceiver] = useState(0)
  const [amount, setAmount] = useState("")
  const [message, setMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const isParent = parents.length == 0
  const [showDayPicker, setShowDayPicker] = useState(false)
  const [showRepeatPicker, setShowRepeatPicker] = useState(false)
  const [dayValue, setDayValue] = useState("Velg dag")
  const [repeatValue, setRepeatValue] = useState("Velg gjentakelse")
  const dayArray = ["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag", "Søndag"]
  const recurrenceArray = ["Daglig", "Ukentlig", "Hver 2. Uke", "Månedlig"]

  useEffect(() => {
    async function fetchAllowance() {
      if (isParent && isAll) {
        const selectedChildID = children[selectedReceiver]?.id ?? ""
        const allowance = await getAllowance(selectedChildID)
        if (!allowance) {
          setAmount("0")
          setDayValue("Velg dag")
          setRepeatValue("Velg gjentakelse")
        } else {
          setAmount(allowance.amount.toString())
          setDayValue(dayArray[allowance.day])
          setRepeatValue(recurrenceArray[allowance.recurrence])
        }
      }
    }
    fetchAllowance()
  }, [selectedReceiver])

  async function handleAskSend() {
    if (parseInt(amount) <= 0) return
    if (isAsk) {
      sendMoneyRequest(userID.data ?? "", users[selectedReceiver]?.id ?? "", message, parseInt(amount))
      router.back()
    } else if (isSend) {
      try {
        await transferMoney(userID.data ?? "", users[selectedReceiver]?.id ?? "", parseInt(amount), message)
        router.back()
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
        console.log(errorMessage)
        if (errorMessage === "Amount exceeds spending limit per purchase") {
          setErrorMessage("Beløpet overgår grense for overføring")
        } else if (errorMessage === "Cumulative spending exceeds spending limit for the specified period") {
          setErrorMessage("Du har brukt opp grensen din for tidsperioden")
        } else if (errorMessage === "Insufficient funds") {
          setErrorMessage("Ikke nok penger på konto")
        }
      }
    } else {
      const dayIndex = dayArray.indexOf(dayValue)
      const recurrenceIndex = recurrenceArray.indexOf(repeatValue)
      if (dayIndex < 0 || recurrenceIndex < 0) return
      try {
        setAllowance(
          users[selectedReceiver]?.id ?? "",
          recurrenceArray.indexOf(repeatValue),
          dayArray.indexOf(dayValue),
          parseInt(amount),
          message
        )
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

  function renderAllowanceInput() {
    return (
      <View style={styles.allowanceContainer}>
        <View style={styles.pickerContainer}>
          <TouchableOpacity
            style={styles.allowanceInput}
            onPress={() => {
              Keyboard.dismiss()
              setShowRepeatPicker(false)
              setShowDayPicker((prev) => !prev)
            }}
          >
            <Text>Ukedag: {dayValue}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.allowanceInput}
            onPress={() => {
              Keyboard.dismiss()
              setShowDayPicker(false)
              setShowRepeatPicker((prev) => !prev)
            }}
          >
            <Text>Gjenta: {repeatValue}</Text>
          </TouchableOpacity>
        </View>
        {(showDayPicker || showRepeatPicker) && (
          <Picker
            style={{ backgroundColor: "white", width: 300, height: 215 }}
            selectedValue={showDayPicker ? dayValue : repeatValue}
            pickerData={showDayPicker ? dayArray : recurrenceArray}
            onValueChange={(value: string) => {
              showDayPicker ? setDayValue(value) : setRepeatValue(value)
            }}
          />
        )}
      </View>
    )
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
      {errorMessage.length > 0 ? (
        <Text className="text-red-500 mt-10 text-center">{errorMessage}</Text>
      ) : (
        <Text className="mt-10"></Text>
      )}
      <View style={styles.mainContainer}>
        <View style={{ ...styles.upperContainer, marginTop: isAll ? 50 : 60 }}>
          <TextInput
            style={styles.amountInput}
            placeholder="0"
            placeholderTextColor={"#000"}
            keyboardType="numeric"
            value={amount}
            onChangeText={handleAmountChange}
            onFocus={() => {
              setShowDayPicker(false), setShowRepeatPicker(false)
            }}
            autoFocus
          />
          <Text style={{ fontSize: 50, fontWeight: "bold" }}> kr</Text>
        </View>
        {isAll && renderAllowanceInput()}
        <View style={styles.bottomContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Skriv en beskjed..."
            onChangeText={(text) => setMessage(text)}
            onFocus={() => {
              setShowDayPicker(false), setShowRepeatPicker(false)
            }}
          />
          <TouchableOpacity style={styles.askButton} onPress={handleAskSend}>
            <Text style={styles.askText}>{isAsk ? "Be Om" : isSend ? "Send" : "Aktiver"}</Text>
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
  allowanceInput: {
    height: 50,
    width: 180,
    backgroundColor: "#52D1DC30",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  allowanceContainer: {
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  pickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 10,
  },
})

export default AskSend
