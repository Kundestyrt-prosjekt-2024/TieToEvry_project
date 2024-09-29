import { Text, View, StyleSheet, Dimensions, ScrollView } from "react-native"
import AwesomeIcon from "react-native-vector-icons/FontAwesome"

const { width } = Dimensions.get("window")

const Transactions = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.balanceText}>Saldo: 1 425 503,-</Text>
      <View style={styles.horizontalLine} />
      <ScrollView style={styles.transactionContainer}>
        <View style={styles.transaction}>
          <View style={styles.leftTransaction}>
            <View style={styles.iconContainer}>
              <AwesomeIcon name="money" size={25} />
              <AwesomeIcon style={styles.arrowUp} name="arrow-up" size={20} />
            </View>
            <Text style={styles.transactionText}>Hus</Text>
          </View>
          <Text style={{ ...styles.transactionText, color: "red" }}>- 5 800 000,00</Text>
        </View>
        <View style={styles.transaction}>
          <View style={styles.leftTransaction}>
            <View style={styles.iconContainer}>
              <AwesomeIcon name="money" size={25} />
              <AwesomeIcon style={styles.arrowDown} name="arrow-down" size={20} />
            </View>
            <Text style={styles.transactionText}>Lønn</Text>
          </View>
          <Text style={{ ...styles.transactionText, color: "green" }}>4 500 000,00</Text>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: 30,
  },
  horizontalLine: {
    borderBottomColor: "#52D1DC",
    borderBottomWidth: 2,
    width: "80%",
    marginTop: 30,
  },
  balanceText: {
    fontSize: 35,
    fontWeight: "bold",
  },
  transactionContainer: {
    paddingTop: 30,
    height: 400,
  },
  transaction: {
    backgroundColor: "#52D1DC30",
    width: width * 0.9,
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
})

export default Transactions
