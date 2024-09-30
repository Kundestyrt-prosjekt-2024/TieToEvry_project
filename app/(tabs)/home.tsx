import AppHeader from "@/components/AppHeader"
import { Text, View, Image, StyleSheet, Pressable, Dimensions } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import AntIcon from "react-native-vector-icons/AntDesign"

const { width, height } = Dimensions.get("window")

const Home = () => {
  function handleLastMonth(): void {
    console.log("Last month")
  }

  function handleNextMonth(): void {
    console.log("Next month")
  }

  function handleTransactions(): void {
    console.log("Transactions")
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader />
      <View style={styles.container}>
        <Image style={styles.cardImage} source={require("@/assets/images/card.png")} />
        <Text style={styles.balanceText}>1 425 503,-</Text>
        <View style={styles.horizontalLine} />
        <View style={styles.budgetHeader}>
          <Pressable onPress={handleLastMonth}>
            <AntIcon name="left" size={25} color="#000" />
          </Pressable>
          <Text style={styles.monthText}>August</Text>
          <Pressable onPress={handleNextMonth}>
            <AntIcon name="right" size={25} color="#000" />
          </Pressable>
        </View>
        <View style={styles.budget}>
          <View style={{ ...styles.budgetPost, backgroundColor: "#1A801E30" }}>
            <Text style={styles.budgetPostText}>Mottatt</Text>
            <Text style={styles.budgetPostText}>500,00 kr</Text>
          </View>
          <View style={{ ...styles.budgetPost, backgroundColor: "#FD353550" }}>
            <Text style={styles.budgetPostText}>Brukt</Text>
            <Text style={styles.budgetPostText}>200,00 kr</Text>
          </View>
          <View style={{ ...styles.budgetPost, backgroundColor: "#CBF1F4" }}>
            <Text style={styles.budgetPostText}>Total</Text>
            <Text style={{ ...styles.budgetPostText, color: "green" }}>+ 300,00 kr</Text>
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
  horizontalLine: {
    borderBottomColor: "#52D1DC",
    borderBottomWidth: 2,
    width: "80%",
    marginVertical: 15,
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
})

export default Home
