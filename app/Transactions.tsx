import React from "react"
import TransactionCard from "@/components/payments/TransactionCard"
import { Text, View, StyleSheet, FlatList } from "react-native"
import { useGetBankAccount, useGetTransactionHistory } from "@/hooks/useGetFirestoreData"
import { useLocalSearchParams } from "expo-router"
import { Transaction } from "@/backend/types/transaction"

const Transactions = () => {
  const searchParams = useLocalSearchParams()
  const userID = searchParams.userID as string
  const account = useGetBankAccount(userID)

  const transactionHistory = useGetTransactionHistory(account.data?.id ?? "")

  function renderListHeader() {
    return (
      <View style={{ alignItems: "center" }}>
        <Text style={styles.balanceText}>
          Saldo: {new Intl.NumberFormat("nb-NO").format(account.data?.balance || 0)}
        </Text>
        <View style={styles.horizontalLine} />
        {transactionHistory.isSuccess && transactionHistory.data.length === 0 && (
          <Text className="mt-20">Her var det tomt.</Text>
        )}
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
    const previousItem = transactionHistory.data?.[index - 1]
    const showDateDivider =
      !previousItem ||
      formatDate(new Date(item.date.seconds * 1000)) !== formatDate(new Date(previousItem.date.seconds * 1000))

    return (
      <TransactionCard
        transaction={item}
        showDateDivider={showDateDivider}
        formatDate={formatDate}
        accountID={account.data?.id || ""}
      />
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.transactionList}
        data={transactionHistory.data}
        renderItem={({ item, index }) => renderItem({ item, index })}
        ListHeaderComponent={renderListHeader}
        contentContainerStyle={{ alignItems: "center", paddingBottom: 25 }}
        keyExtractor={(item) => item.date.seconds.toString()}
      />
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
