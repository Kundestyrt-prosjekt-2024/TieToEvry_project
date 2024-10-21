import React from "react"
import { useLocalSearchParams } from "expo-router"
import { View, Text, FlatList, StyleSheet } from "react-native"
import { User } from "./(tabs)/payment"

export type Transaction = [id: string, type: string, amount: number, date: string]

const messages = [
  { id: "1", type: "send", amount: 50, date: "2024-10-01" },
  { id: "2", type: "receive", amount: 20, date: "2024-10-02" },
  { id: "3", type: "send", amount: 30, date: "2024-10-03" },
  { id: "4", type: "receive", amount: 40, date: "2024-10-04" },
]

const PaymentHistory = () => {
  const { userId, name } = useLocalSearchParams()
  console.log(userId, name)

  function fetchTransactions(userId: string): Transaction[] {
    return []
  }

  function renderItem({ item }: any) {
    return (
      <View style={[styles.messageContainer, item.type === "send" ? styles.send : styles.receive]}>
        <Text style={styles.messageText}>
          {item.type === "send" ? "Sent" : "Received"} ${item.amount} on {item.date}
        </Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList data={messages} renderItem={renderItem} keyExtractor={(item) => item.id} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  messageContainer: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  send: {
    alignSelf: "flex-end",
    backgroundColor: "#d1e7dd",
  },
  receive: {
    alignSelf: "flex-start",
    backgroundColor: "#f8d7da",
  },
  messageText: {
    fontSize: 16,
  },
})

export default PaymentHistory
