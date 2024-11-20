import React from "react"
import { useLocalSearchParams } from "expo-router"
import { View, FlatList, StyleSheet } from "react-native"
import { Transaction } from "@/backend/types/transaction"
import PaymentBubble from "@/components/payments/PaymentBubble"
import {
  useGetBankAccount,
  useGetTransactionHistoryBetweenAccounts,
  useGetUser,
  useGetUserID,
} from "@/hooks/useGetFirestoreData"

const PaymentHistory = () => {
  const params = useLocalSearchParams()
  const otherUserID = params.otherUserID as string

  const userID = useGetUserID()
  const user = useGetUser(userID.data || "")
  const otherUser = useGetUser(otherUserID)

  const userBankAccount = useGetBankAccount(userID.data || "")
  const otherUserBankAccount = useGetBankAccount(otherUserID)

  const transactionHistory = useGetTransactionHistoryBetweenAccounts(
    userBankAccount.data?.id || "",
    otherUserBankAccount.data?.id || ""
  )

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
    const previousItem = transactionHistory.data?.[index - 1]
    const showDateDivider =
      !previousItem ||
      formatDate(new Date(item.date.seconds * 1000)) !== formatDate(new Date(previousItem.date.seconds * 1000))

    return (
      <PaymentBubble
        payment={item}
        accountID={userBankAccount.data?.id || ""}
        name={otherUser.data?.name || ""}
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
        data={transactionHistory.data}
        renderItem={renderItem}
        keyExtractor={(item) => item.date.seconds.toString()}
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
