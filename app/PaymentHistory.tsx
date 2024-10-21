import React, { useEffect } from "react"
import { useLocalSearchParams } from "expo-router"
import { View, FlatList, StyleSheet } from "react-native"
import { Payment } from "@/types"
import PaymentBubble from "@/components/PaymentBubble"

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

  function formatTime(date: Date) {
    return new Intl.DateTimeFormat("nb-NO", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  function renderItem({ item, index }: { item: Payment; index: number }) {
    const previousItem = payments[index - 1]
    const showDateDivider = !previousItem || formatDate(item.sentAt) !== formatDate(previousItem.sentAt)

    return (
      <PaymentBubble
        payment={item}
        userId={userId}
        name={name}
        showDateDivider={showDateDivider}
        formatDate={formatDate}
        formatTime={formatTime}
      />
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.listContent}
        data={payments}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  listContent: {
    paddingBottom: 20,
  },
})

export default PaymentHistory
