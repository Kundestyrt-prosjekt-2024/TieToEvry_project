import AppHeader from "@/components/AppHeader"
import { useRouter } from "expo-router"
import HorizontalLine from "@/components/HorizontalLine"
import { Text, View, Image, StyleSheet, Pressable, Dimensions, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import AntIcon from "react-native-vector-icons/AntDesign"
import { useGetBankAccount, useGetUserID } from "@/hooks/useGetFirestoreData"
import { useEffect, useState } from "react"
import { fetchMonthStatsFS } from "@/backend/src/transactionsDAO"

const { width, height } = Dimensions.get("window")

const Home = () => {
  const router = useRouter()
  const { data: userId } = useGetUserID()
  const account = useGetBankAccount(userId || "")
  const currentMonth = new Date().getMonth()
  const [selectedMonth, setSelectedMonth] = useState(currentMonth)
  const [monthStats, setMonthStats] = useState([0, 0, 0]) // [in, out, total]
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    if (account.data?.id) {
      setLoadingStats(true)
      fetchMonthStats()
        .then(() => setLoadingStats(false))
        .catch(() => setLoadingStats(false))
    }
  }, [selectedMonth, account.data?.id])

  function handleLastMonth(): void {
    const newMonth = selectedMonth - 1
    if (newMonth < 0) return
    setSelectedMonth(newMonth)
  }

  function handleNextMonth(): void {
    const newMonth = selectedMonth + 1
    if (newMonth > currentMonth) return
    setSelectedMonth(newMonth)
  }

  function handleTransactions(): void {
    router.push(`/Transactions?userID=${userId}`)
  }

  async function fetchMonthStats() {
    const { to, from } = await fetchMonthStatsFS(account.data?.id || "", selectedMonth)
    const moneyIn = await to.reduce((acc, transaction) => acc + transaction.transaction_amount, 0)
    const moneyOut = await from.reduce((acc, transaction) => acc + transaction.transaction_amount, 0)
    const total = moneyIn - moneyOut
    setMonthStats([moneyIn, moneyOut, total])
  }

  function getMonthName(month: number): string {
    if (month < 0 || month > 11) {
      throw new Error("Invalid month number. It should be between 0 and 11.")
    }

    const monthName = new Intl.DateTimeFormat("no-NO", { month: "long" }).format(new Date(2024, month))
    return monthName.charAt(0).toUpperCase() + monthName.slice(1)
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader />
      <View style={styles.container}>
        <Image style={styles.cardImage} source={require("@/assets/images/card.png")} testID="card-image" />
        <Text style={styles.balanceText}>{new Intl.NumberFormat("nb-NO").format(account.data?.balance || 0)} ,-</Text>
        <HorizontalLine />
        <View style={styles.budgetHeader}>
          <TouchableOpacity style={styles.monthButton} onPress={handleLastMonth} testID="left-arrow">
            <AntIcon name="left" size={30} color={selectedMonth > 0 ? "#000" : "white"} />
          </TouchableOpacity>
          <Text style={styles.monthText}>{getMonthName(selectedMonth)}</Text>
          <TouchableOpacity style={styles.monthButton} onPress={handleNextMonth} testID="right-arrow">
            <AntIcon name="right" size={30} color={selectedMonth !== currentMonth ? "#000" : "white"} />
          </TouchableOpacity>
        </View>
        <View style={styles.budget}>
          <View style={{ ...styles.budgetPost, backgroundColor: "#1A801E30" }}>
            <Text style={styles.budgetPostText}>Mottatt</Text>
            <Text style={styles.budgetPostText}>
              {loadingStats ? "..." : new Intl.NumberFormat("nb-NO").format(monthStats[0]) + " kr"}
            </Text>
          </View>
          <View style={{ ...styles.budgetPost, backgroundColor: "#FD353550" }}>
            <Text style={styles.budgetPostText}>Brukt</Text>
            <Text style={styles.budgetPostText}>
              {loadingStats ? "..." : new Intl.NumberFormat("nb-NO").format(monthStats[1]) + " kr"}
            </Text>
          </View>
          <View style={{ ...styles.budgetPost, backgroundColor: "#CBF1F4" }}>
            <Text style={styles.budgetPostText}>Total</Text>
            <Text style={{ ...styles.budgetPostText, color: "green" }}>
              {loadingStats ? "..." : new Intl.NumberFormat("nb-NO").format(monthStats[2]) + " kr"}
            </Text>
          </View>
        </View>
        <Pressable style={styles.transactionButton} onPress={handleTransactions}>
          <Text style={styles.transactionsText}>Mine Transaksjoner</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardImage: {
    width: width * 0.9,
    height: height * 0.275,
    resizeMode: "contain",
  },
  balanceText: {
    fontSize: 35,
    fontWeight: "bold",
  },
  budgetHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  monthText: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
  },
  budget: {
    flex: 1,
    justifyContent: "center",
    gap: 15,
    paddingBottom: 20,
  },
  budgetPost: {
    paddingHorizontal: 25,
    width: "90%",
    height: 50,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 20,
  },
  transactionButton: {
    padding: 10,
    paddingHorizontal: 20,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFC5D3",
    borderRadius: 20,
    marginBottom: 10,
  },
  budgetPostText: {
    fontSize: 15,
  },
  transactionsText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  monthButton: {
    width: 30,
    height: 30,
  },
})

export default Home
