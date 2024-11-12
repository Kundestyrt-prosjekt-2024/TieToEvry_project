import { MoneyRequest, Transaction } from "@/types"
import { Text, View, StyleSheet } from "react-native"
import AwesomeIcon from "react-native-vector-icons/FontAwesome"

const TransactionCard = ({
  transaction,
  showDateDivider,
  formatDate,
}: {
  transaction: Transaction
  showDateDivider: boolean
  formatDate: (date: Date) => string
}) => {
  const isPositive = transaction.amount > 0
  console.log(showDateDivider)
  return (
    <View style={{ alignSelf: "center" }}>
      {showDateDivider && <Text style={styles.dateDivider}>{formatDate(transaction.sentAt)}</Text>}
      <View style={styles.transaction}>
        <View style={styles.leftTransaction}>
          <View style={styles.iconContainer}>
            <AwesomeIcon name="money" size={25} />
            {isPositive ? (
              <AwesomeIcon style={styles.arrowDown} name="arrow-down" size={20} />
            ) : (
              <AwesomeIcon style={styles.arrowUp} name="arrow-up" size={20} />
            )}
          </View>
          <Text style={styles.transactionText}>{transaction.message}</Text>
        </View>
        <Text style={{ ...styles.transactionText, color: isPositive ? "green" : "red" }}>
          {new Intl.NumberFormat("nb-NO").format(transaction.amount)}
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
  transactionText: {
    fontSize: 20,
  },
  iconContainer: {
    position: "relative",
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