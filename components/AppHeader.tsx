import React from "react"
import { View, Text, StyleSheet, Pressable, Image } from "react-native"
import Awesome5Icon from "react-native-vector-icons/FontAwesome5"
import { useRouter } from "expo-router"

const AppHeader = () => {
  const router = useRouter()

  function handleProfile(): void {
    router.navigate("/(profile)/profile")
  }

  function handleCoin(): void {
    console.log("Coins")
  }

  return (
    <View style={styles.header}>
      <Pressable style={styles.coinButton} onPress={handleCoin}>
        <Text style={styles.headerText}>2387</Text>
        <Image style={styles.coin} source={require("@/assets/images/coin.png")} />
      </Pressable>
      <Pressable onPress={handleProfile}>
        <Awesome5Icon name="user-circle" size={35} />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    height: 50,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 25,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  coinButton: {
    backgroundColor: "#52D1DC",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  coin: {
    width: 20,
    height: 20,
    resizeMode: "contain",
    marginLeft: 5,
  },
})

export default AppHeader
