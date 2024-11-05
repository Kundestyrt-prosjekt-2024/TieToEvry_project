import TransactionCard from "@/components/TransactionCard"
import { MoneyRequest } from "@/types"
import { Text, View, StyleSheet, FlatList } from "react-native"

const dummyTransactions: MoneyRequest[] = [
  {
    id: "1",
    receiver: "1",
    sender: "2",
    message: "Hus",
    amount: -5800000,
    requestedAt: new Date(),
  },
  {
    id: "2",
    receiver: "1",
    sender: "2",
    message: "Jalla",
    amount: 5800000,
    requestedAt: new Date(),
  },
]

const Transactions = () => {
  function renderListHeader() {
    return (
      <View style={{ alignItems: "center" }}>
        <Text style={styles.balanceText}>Saldo: 1 425 503,-</Text>
        <View style={styles.horizontalLine} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.transactionList}
        data={dummyTransactions}
        renderItem={({ item }) => <TransactionCard transaction={item} />}
        ListHeaderComponent={renderListHeader}
        contentContainerStyle={{ alignItems: "center" }}
        keyExtractor={(item) => item.id.toString()}
      ></FlatList>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  horizontalLine: {
    borderBottomColor: "#52D1DC",
    borderBottomWidth: 2,
    width: "100%",
    marginTop: 30,
  },
  balanceText: {
    marginTop: 30,
    fontSize: 35,
    fontWeight: "bold",
  },
  transactionList: {
    width: "100%",
  },
})

export default Transactions
