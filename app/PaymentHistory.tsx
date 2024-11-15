import React, { useEffect } from "react"
import { useLocalSearchParams } from "expo-router"
import { View, FlatList, StyleSheet } from "react-native"
import PaymentBubble from "@/components/PaymentBubble"
import { Transaction, MoneyRequest } from "@/backend/types/transaction"
import { fetchMoneyRequests, fetchPaymentHistory, fetchPaymentTransactions } from "@/backend/src/paymentsDAO"
import { getBankAccountByUID } from "@/backend/src/bankAccountDAO"
import { useGetBankAccount } from "@/hooks/useGetFirestoreData"

const PaymentHistory = () => {
  const params = useLocalSearchParams()
  const currentUserId = params.currentUserId as string
  const userId = params.userId as string
  const name = params.name as string
  const userAccount = useGetBankAccount(currentUserId)
  const [payments, setPayments] = React.useState<any[]>([])

  useEffect(() => {
    fetchTransactions(userId)
  }, [userId])

  async function fetchTransactions(userId: string) {
    const payments = await fetchPaymentTransactions(currentUserId, userId)
    const requests = await fetchMoneyRequests(userId, currentUserId)

    const normalizedPayments = payments.map((payment) => ({
      id: payment.id,
      amount: payment.amount,
      description: payment.description,
      date: payment.date,
      fromUser: payment.account_id_from === userAccount.data?.id,
      status: "payment",
    }))
    const normalizedRequests = requests.map((request) => ({
      id: request.id,
      amount: request.amount,
      description: request.message,
      date: request.date,
      fromUser: request.sender === currentUserId,
      status: request.status,
    }))

    const allPayments = [...normalizedPayments, ...normalizedRequests]
    const allPaymentsSorted = allPayments.sort((a, b) => a.date.seconds - b.date.seconds)

    setPayments(allPaymentsSorted)
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

  function renderItem({ item, index }: { item: any; index: number }) {
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
