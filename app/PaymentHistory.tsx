import React, { useEffect } from "react"
import { useLocalSearchParams } from "expo-router"
import { View, FlatList, StyleSheet } from "react-native"
import PaymentBubble from "@/components/PaymentBubble"
import { Transaction } from "@/backend/types/transaction"
import { fetchPaymentHistory } from "@/backend/src/paymentsDAO"

const PaymentHistory = () => {
  const params = useLocalSearchParams()
  const currentUserId = params.userId as string
  const userId = params.userId as string
  const name = params.name as string
  const [payments, setPayments] = React.useState<Transaction[]>([])

  useEffect(() => {
    fetchTransactions(userId)
  }, [userId])

  async function fetchTransactions(userId: string) {
    const payments = await fetchPaymentHistory(currentUserId, userId)
    const sortedPayments = payments.sort((a, b) => a.date.seconds - b.date.seconds)
    setPayments(sortedPayments)
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

  function renderItem({ item, index }: { item: Transaction; index: number }) {
    const previousItem = payments[index - 1]
    const showDateDivider =
      !previousItem || formatDate(new Date(item.date.seconds)) !== formatDate(new Date(previousItem.date.seconds))

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
