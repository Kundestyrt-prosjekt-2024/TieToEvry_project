import React from "react"
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Dimensions } from "react-native"

const coinItems: { id: string; name: string; amount: number }[] = [
  { id: "1", name: "Flaske", amount: 100 },
  { id: "2", name: "Sparegris", amount: 200 },
  { id: "3", name: "Kortstokk", amount: 300 },
  { id: "4", name: "Jalla", amount: 400 },
]

const Coins = () => {
  function renderList(coinItem: { id: string; name: string; amount: number }) {
    return (
      <TouchableOpacity style={styles.product}>
        <Text style={styles.productName}>{coinItem.name}</Text>
        <View style={styles.productPrice}>
          <Text style={styles.priceText}>{coinItem.amount}</Text>
          <Image style={styles.productCoin} source={require("@/assets/images/coin.png")} />
        </View>
      </TouchableOpacity>
    )
  }

  const coinBalance = (
    <View style={styles.coins}>
      <Text style={styles.text}>2387</Text>
      <Image style={styles.coin} source={require("@/assets/images/coin.png")} />
    </View>
  )

  const screenHeight = Dimensions.get("window").height
  return (
    <View style={styles.container}>
      <FlatList
        style={{ width: "100%" }}
        contentContainerStyle={styles.listContent}
        data={coinItems}
        ListHeaderComponent={coinBalance}
        renderItem={(coinItem) => renderList(coinItem.item)}
        numColumns={2}
        keyExtractor={(item) => item.id}
        scrollEnabled={Math.ceil(coinItems.length / 2) >= (screenHeight - 260) / 100}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  listContent: {
    alignItems: "center",
    columnGap: 20,
    paddingBottom: 50,
  },
  coins: {
    backgroundColor: "#52D1DC",
    width: "80%",
    height: 100,
    padding: 20,
    paddingHorizontal: 50,
    marginVertical: 30,
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontSize: 50,
    fontWeight: "bold",
  },
  coin: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    marginLeft: 10,
  },
  product: {
    backgroundColor: "#6DE272",
    width: 175,
    height: 85,
    padding: 10,
    gap: 5,
    marginVertical: 10,
    marginHorizontal: 5,
    borderRadius: 20,
    alignItems: "center",
  },
  productName: {
    fontSize: 25,
    fontWeight: "bold",
  },
  productCoin: {
    width: 25,
    height: 25,
    resizeMode: "contain",
  },
  productPrice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  priceText: {
    fontSize: 20,
  },
})

export default Coins
