import React, { useEffect } from "react"
import { useLocalSearchParams } from "expo-router"
import { View, Text, FlatList, StyleSheet } from "react-native"
import { Payment } from "@/types"

export type Transaction = [id: string, type: string, amount: number, date: string]

const dummyData: Payment[] = [
  {
    id: "1",
    receiver: "1",
    sender: "2",
    message: "",
    amount: 5800000,
    sentAt: new Date("2024-10-01T10:30:00"),
  },
  {
    id: "2",
    receiver: "2",
    sender: "1",
    message: "Jalla",
    amount: 4500000,
    sentAt: new Date("2024-10-01T12:45:00"),
  },
  {
    id: "3",
    receiver: "2",
    sender: "1",
    message: "Jalla",
    amount: 4500000,
    sentAt: new Date("2024-10-02T09:30:00"),
  },
]

const PaymentHistory = () => {
  const params = useLocalSearchParams()
  const userId = params.userId as string
  const name = params.name as string
  const [payments, setPayments] = React.useState<Payment[]>([])

  useEffect(() => {
    fetchTransactions(userId)
  }, [userId])

  function fetchTransactions(userId: string): void {
    setPayments(dummyData)
  }

  function renderItem(payment: Payment) {
    return (
      <View style={[styles.messageContainer, payment.sender == userId ? styles.send : styles.receive]}>
        <Text style={styles.statusText}>{payment.sender == userId ? `Du sendte ${name}` : `${name} sendte deg`}</Text>
        <Text style={styles.amountText}>{new Intl.NumberFormat("nb-NO").format(payment.amount)} kr</Text>
        {payment.message && <Text style={styles.statusText}>{payment.message}</Text>}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList data={payments} renderItem={(payment) => renderItem(payment.item)} keyExtractor={(item) => item.id} />
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
    borderRadius: 20,
    marginVertical: 6,
    alignItems: "center",
    gap: 5,
  },
  send: {
    alignSelf: "flex-end",
    backgroundColor: "#f8d7da",
    borderBottomRightRadius: 2,
  },
  receive: {
    alignSelf: "flex-start",
    backgroundColor: "#d1e7dd",
    borderBottomLeftRadius: 2,
  },
  statusText: {
    fontSize: 16,
  },
  amountText: {
    fontSize: 24,
  },
})

export default PaymentHistory
