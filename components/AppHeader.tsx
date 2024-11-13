import React from "react"
import { View, Text, StyleSheet, Pressable, Image } from "react-native"
import { useRouter } from "expo-router"
import { useGetUser, useGetUserID } from "@/hooks/useGetFirestoreData"

const AppHeader = ({ parent = false }: { parent?: boolean }) => {
  const router = useRouter()
  const userID = useGetUserID()
  const user = useGetUser(userID.data || "")

  function handleProfile(): void {
    router.navigate("/(profile)/profile")
  }

  function handleCoin(): void {
    router.push("/Coins")
  }

  return (
    <View style={[styles.header, parent ? { justifyContent: "flex-end" } : { justifyContent: "space-between" }]}>
      {!parent && (
        <Pressable style={styles.coinButton} onPress={handleCoin}>
          <Text style={styles.headerText}>2387</Text>
          <Image style={styles.coin} source={require("@/assets/images/coin.png")} />
        </Pressable>
      )}
      <Pressable
        className="w-[35px] h-[35px] rounded-full border border-black justify-center items-center overflow-hidden"
        onPress={handleProfile}
      >
        <Image source={{ uri: user.data?.profilePicture }} className="w-full h-full" style={{ resizeMode: "cover" }} />
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
