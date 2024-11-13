import React, { useEffect } from "react"
import TransactionCard from "@/components/TransactionCard"
import { Transaction } from "@/types"
import { Text, View, StyleSheet, FlatList } from "react-native"
import { useGetBankAccount, useGetUserID } from "@/hooks/useGetFirestoreData"

const dummyTransactions: Transaction[] = [
  {
    id: "1",
    receiver: "1",
    sender: "2",
    message: "Hus",
    amount: -5800000,
    sentAt: new Date("2024-10-12T15:45:00"),
  },
  {
    id: "2",
    receiver: "1",
    sender: "2",
    message: "Jalla",
    amount: 5800000,
    sentAt: new Date("2024-10-12T15:46:00"),
  },
  {
    id: "3",
    receiver: "1",
    sender: "2",
    message: "Hus",
    amount: -5800000,
    sentAt: new Date("2024-10-14T15:46:00"),
  },
  {
    id: "4",
    receiver: "1",
    sender: "2",
    message: "Jalla",
    amount: 5800000,
    sentAt: new Date("2024-11-01T15:46:00"),
  },
  {
    id: "5",
    receiver: "1",
    sender: "2",
    message: "Hus",
    amount: -5800000,
    sentAt: new Date("2024-11-01T15:46:00"),
  },
  {
    id: "6",
    receiver: "1",
    sender: "2",
    message: "Jalla",
    amount: 5800000,
    sentAt: new Date("2024-11-01T15:46:00"),
  },
  {
    id: "7",
    receiver: "1",
    sender: "2",
    message: "Hus",
    amount: -5800000,
    sentAt: new Date(),
  },
  {
    id: "8",
    receiver: "1",
    sender: "2",
    message: "Jalla",
    amount: 5800000,
    sentAt: new Date(),
  },
]

const Transactions = () => {
  const [transactions, setTransactions] = React.useState<Transaction[]>([])
  const { data: userId } = useGetUserID()
  const account = useGetBankAccount(userId || "")

  useEffect(() => {
    fetchTransactions()
  }, [])

  function fetchTransactions(): void {
    const sortedTransactions = dummyTransactions.sort((a, b) => b.sentAt.getTime() - a.sentAt.getTime())
    setTransactions(sortedTransactions)
  }

  function renderListHeader() {
    return (
      <View style={{ alignItems: "center" }}>
        <Text style={styles.balanceText}>
          Saldo: {new Intl.NumberFormat("nb-NO").format(account.data?.balance || 0)}
        </Text>
        <View style={styles.horizontalLine} />
      </View>
    )
  }

  function formatDate(date: Date) {
    return new Intl.DateTimeFormat("nb-NO", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date)
  }

  function renderItem({ item, index }: { item: Transaction; index: number }) {
    const previousItem = transactions[index - 1]
    const showDateDivider = !previousItem || formatDate(item.sentAt) !== formatDate(previousItem.sentAt)

    return <TransactionCard transaction={item} showDateDivider={showDateDivider} formatDate={formatDate} />
  }

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.transactionList}
        data={dummyTransactions}
        renderItem={({ item, index }) => renderItem({ item, index })}
        ListHeaderComponent={renderListHeader}
        contentContainerStyle={{ alignItems: "center", paddingBottom: 25 }}
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
    width: "115%",
    marginVertical: 20,
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
