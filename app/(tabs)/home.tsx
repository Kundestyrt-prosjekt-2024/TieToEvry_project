import AppHeader from "@/components/AppHeader"
import { Text, View, Image, StyleSheet, Pressable } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import AntIcon from "react-native-vector-icons/AntDesign"

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
    <SafeAreaView style={{ backgroundColor: "white" }}>
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
        <View style={styles.horizontalLine} />
        <Pressable style={styles.transactionButton} onPress={handleTransactions}>
          <Text style={styles.transactionsText}>Mine Transaksjoner</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  cardImage: {
    width: 360,
    height: 250,
    resizeMode: "contain",
  },
  horizontalLine: {
    borderBottomColor: "#52D1DC",
    borderBottomWidth: 2,
    width: 300,
    marginVertical: 20,
  },
  balanceText: {
    fontSize: 35,
    fontWeight: "bold",
  },
  budgetHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
  },
  monthText: {
    fontSize: 25,
    fontWeight: "bold",
    marginHorizontal: 100,
  },
  budget: {
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    marginTop: 15,
    gap: 15,
  },
  budgetPost: {
    paddingHorizontal: 25,
    width: 350,
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
