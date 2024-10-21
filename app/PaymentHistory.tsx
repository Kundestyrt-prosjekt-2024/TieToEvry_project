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
    sentAt: new Date("2024-10-02T09:30:00"),
  },
  {
    id: "3",
    receiver: "2",
    sender: "1",
    message: "Jalla",
    amount: 4500000,
    sentAt: new Date("2024-10-02T12:45:00"),
  },
  {
    id: "4",
    receiver: "1",
    sender: "3",
    message: "Jalla",
    amount: 4500000,
    sentAt: new Date("2024-10-12T15:45:00"),
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

  function formatDate(date: Date) {
    return new Intl.DateTimeFormat("nb-NO", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date)
  }

  function renderItem({ item, index }: { item: Payment; index: number }) {
    const previousItem = payments[index - 1]
    const showDateDivider = !previousItem || formatDate(item.sentAt) !== formatDate(previousItem.sentAt)

    return (
      <View>
        {showDateDivider && <Text style={styles.dateDivider}>{formatDate(item.sentAt)}</Text>}
        <View style={[styles.messageContainer, item.sender == userId ? styles.send : styles.receive]}>
          <Text style={styles.statusText}>{item.sender == userId ? `Du sendte ${name}` : `${name} sendte deg`}</Text>
          <Text style={styles.amountText}>{new Intl.NumberFormat("nb-NO").format(item.amount)} kr</Text>
          {item.message && <Text style={styles.statusText}>{item.message}</Text>}
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList data={payments} renderItem={renderItem} keyExtractor={(item) => item.id} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  messageContainer: {
    padding: 10,
    borderRadius: 20,
    marginVertical: 6,
    marginHorizontal: 5,
    alignItems: "center",
    gap: 5,
    maxWidth: "70%",
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
  dateDivider: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
    color: "#555",
  },
})

export default PaymentHistory
