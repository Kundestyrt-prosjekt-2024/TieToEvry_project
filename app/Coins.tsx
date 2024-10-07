import React, { useCallback, useRef } from "react"
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Dimensions, Pressable } from "react-native"
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet"
import FeatherIcon from "react-native-vector-icons/Feather"

const coinItems: { id: string; name: string; amount: number }[] = [
  { id: "1", name: "Flaske", amount: 249 },
  { id: "2", name: "Sparegris", amount: 349 },
  { id: "3", name: "Kortstokk", amount: 149 },
  { id: "4", name: "Jalla", amount: 999 },
]

const Coins = () => {
  const bottomSheetRef = useRef<BottomSheet>(null)
  const [expandedItem, setExpandedItem] = React.useState<{ id: string; name: string; amount: number } | null>(null)

  function renderList(coinItem: { id: string; name: string; amount: number }) {
    return (
      <TouchableOpacity style={styles.product} onPress={() => handleExpandItem(coinItem)}>
        <Text style={styles.productName}>{coinItem.name}</Text>
        <View style={styles.productPrice}>
          <Text style={styles.text2}>{coinItem.amount}</Text>
          <Image style={styles.coin2} source={require("@/assets/images/coin.png")} />
        </View>
      </TouchableOpacity>
    )
  }

  const handleExpandItem = useCallback((coinItem: { id: string; name: string; amount: number }) => {
    setExpandedItem(coinItem)
    bottomSheetRef.current?.expand()
  }, [])

  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />,
    []
  )

  const coinBalance = (
    <View style={styles.coins}>
      <Text style={styles.text1}>2387</Text>
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
            <Pressable style={styles.x} onPress={() => bottomSheetRef.current?.close()}>
              <FeatherIcon name="x" size={50} />
            </Pressable>
          </View>
          <Image style={styles.bottle} source={require("@/assets/images/bottle.png")} />
          <View style={styles.priceContainer}>
            <Text style={styles.text3}>Pris: {expandedItem?.amount}</Text>
            <Image style={styles.coin3} source={require("@/assets/images/coin.png")} />
          </View>
          <TouchableOpacity style={styles.buyButton}>
            <Text style={styles.text3}>Kjøp</Text>
          </TouchableOpacity>
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
  text2: {
    fontSize: 20,
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
