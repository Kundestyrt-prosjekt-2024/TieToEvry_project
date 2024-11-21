import React, { useCallback, useRef, useState } from "react"
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Dimensions, Pressable } from "react-native"
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet"
import FeatherIcon from "react-native-vector-icons/Feather"
import { useGetUser, useGetUserID } from "@/hooks/useGetFirestoreData"
import { adjustSphareCoins } from "@/backend/src/UserDAO"

const coinItems: { id: string; name: string; amount: number; image: string }[] = [
  { id: "1", name: "Flaske", amount: 249, image: "bottle.png" },
  { id: "2", name: "Sparegris", amount: 349, image: "piggybank.jpg" },
  { id: "3", name: "Kortstokk", amount: 149, image: "carddeck.png" },
  { id: "4", name: "Refleks", amount: 100, image: "refleks.jpg" },
]

const imageMap = {
  "bottle.png": require("@/assets/images/bottle.png"),
  "piggybank.jpg": require("@/assets/images/piggybank.jpg"),
  "carddeck.png": require("@/assets/images/carddeck.png"),
  "refleks.jpg": require("@/assets/images/refleks.jpg"),
}

const Coins = () => {
  const bottomSheetRef = useRef<BottomSheet>(null)
  const [expandedItem, setExpandedItem] = React.useState<{
    id: string
    name: string
    amount: number
    image: string
  } | null>(null)

  const userID = useGetUserID()
  const user = useGetUser(userID.data || "")

  const [errorMessage, setErrorMessage] = useState("")

  function renderList(coinItem: { id: string; name: string; amount: number; image: string }) {
    return (
      <TouchableOpacity style={styles.product} onPress={() => handleExpandItem(coinItem)}>
        <Text style={styles.productName}>{coinItem.name}</Text>
        <View style={styles.productPrice}>
          <Text style={{ fontSize: 20 }}>{coinItem.amount}</Text>
          <Image style={styles.coin2} source={require("@/assets/images/coin.png")} />
        </View>
      </TouchableOpacity>
    )
  }

  const handleExpandItem = useCallback((coinItem: { id: string; name: string; amount: number; image: string }) => {
    setExpandedItem(coinItem)
    bottomSheetRef.current?.expand()
  }, [])

  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />,
    []
  )

  const coinBalance = (
    <View style={styles.coins}>
      <Text style={styles.text1}>{user.data?.sphareCoins || 0}</Text>
      <Image style={styles.coin1} source={require("@/assets/images/coin.png")} />
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
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={["70%"]}
        enablePanDownToClose={true}
        backdropComponent={renderBackdrop}
        index={-1}
      >
        <View style={styles.sheetContainer}>
          <View style={styles.sheetHeader}>
            <Text style={styles.text1}>{expandedItem?.name}</Text>
            <Pressable
              style={styles.x}
              onPress={() => {
                bottomSheetRef.current?.close()
                setErrorMessage("")
              }}
            >
              <FeatherIcon name="x" size={50} />
            </Pressable>
          </View>
          <Image
            style={styles.bottle}
            source={expandedItem ? imageMap[expandedItem.image as keyof typeof imageMap] : null}
          />
          <View style={styles.priceContainer}>
            <Text style={styles.text3}>Pris: {expandedItem?.amount}</Text>
            <Image style={styles.coin3} source={require("@/assets/images/coin.png")} />
          </View>
          <TouchableOpacity
            style={styles.buyButton}
            onPress={async () => {
              try {
                await adjustSphareCoins(userID.data!, -expandedItem?.amount!)
                bottomSheetRef.current?.close()
                user.refetch()
              } catch (error) {
                setErrorMessage("Du har ikke nok gullrøtter til dette kjøpet")
              }
            }}
          >
            <Text style={styles.text3}>Kjøp</Text>
          </TouchableOpacity>
          {errorMessage.length !== 0 && <Text className="text-red-500 text-xl">{errorMessage}</Text>}
        </View>
      </BottomSheet>
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
    backgroundColor: "white",
    width: "80%",
    height: 100,
    marginVertical: 30,
    flexDirection: "row",
    alignItems: "center",
  },
  text1: {
    fontSize: 50,
    fontWeight: "bold",
  },
  coin1: {
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
  coin2: {
    width: 25,
    height: 25,
    resizeMode: "contain",
  },
  productPrice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  sheetContainer: {
    width: "100%",
    alignItems: "center",
    gap: 20,
  },
  sheetHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  x: {
    position: "absolute",
    right: 20,
  },
  buyButton: {
    width: 120,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#52D1DC",
    padding: 10,
    borderRadius: 30,
    marginVertical: 20,
  },
  text3: {
    fontSize: 30,
    fontWeight: "bold",
  },
  bottle: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  coin3: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
})

export default Coins
