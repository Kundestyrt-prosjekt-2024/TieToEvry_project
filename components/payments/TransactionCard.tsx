import { Transaction } from "@/backend/types/transaction"
import { Text, View, StyleSheet } from "react-native"
import AwesomeIcon from "react-native-vector-icons/FontAwesome"

const TransactionCard = ({
  transaction,
  showDateDivider,
  formatDate,
  accountID,
}: {
  transaction: Transaction
  showDateDivider: boolean
  formatDate: (date: Date) => string
  accountID: string
}) => {
  const isPositive = transaction.account_id_to === accountID

  return (
    <View style={{ alignSelf: "center" }}>
      {showDateDivider && (
        <Text style={styles.dateDivider}>{formatDate(new Date(transaction.date.seconds * 1000))}</Text>
      )}
      <View style={styles.transaction}>
        <View style={styles.leftTransaction}>
          <View style={{ position: "relative" }}>
            <AwesomeIcon name="money" size={25} />
            {isPositive ? (
              <AwesomeIcon style={styles.arrowDown} name="arrow-down" size={20} />
            ) : (
              <AwesomeIcon style={styles.arrowUp} name="arrow-up" size={20} />
            )}
          </View>
          <Text style={{ fontSize: 20 }}>{transaction.description}</Text>
        </View>
        <Text style={{ fontSize: 20, color: isPositive ? "green" : "red" }}>
          {new Intl.NumberFormat("nb-NO").format(transaction.amount)},-
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  transaction: {
    backgroundColor: "#52D1DC30",
    width: "90%",
    padding: 20,
    marginVertical: 10,
    borderRadius: 30,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  arrowUp: {
    position: "absolute",
    top: -14,
    left: 4,
    color: "red",
  },
  arrowDown: {
    position: "absolute",
    top: -14,
    left: 4,
    color: "green",
  },
  leftTransaction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  dateDivider: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
    color: "#555",
  },
})

export default TransactionCard
