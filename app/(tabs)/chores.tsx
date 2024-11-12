import AppHeader from "@/components/AppHeader"
import { View, Text, StyleSheet, Pressable, Image, Modal, Dimensions, FlatList, Animated } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Chore } from "../../backend/types/chore"
import React, { useMemo, useRef, useState } from "react"
import ChoreList from "@/components/chores/chore"
import ChoresDetailedView from "@/components/chores/choresDetailedView"
import Button from "@/components/ui/button"
import Popover from "@/components/chores/chorePopover"
import { useGetChores, useGetUserID } from "@/hooks/useGetFirestoreData"

const Chores = () => {
  const [viewChore, toggleView] = React.useState(false)
  const [choreOfInterest, setChoreOfInterest] = React.useState<Chore | null>(null)
  const [showPopover, setShowPopover] = React.useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [scrollDirection, setScrollDirection] = useState("up")
  const translateY = useRef(new Animated.Value(0)).current
  const {data: userID} = useGetUserID()
  const {data, isLoading, isError, refetch} = useGetChores(userID ?? "");

  if (isLoading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    )
  } else if (isError && !data) {
    return (
      <View>
        <Text>Error</Text>
      </View>
    )
  }


  const cashMullaCoin = {
    mulla: 14243545,
    sphareCoin: 3245,
  }

  const setViewChore = (chore: Chore) => {
    setChoreOfInterest(chore)
    toggleModal()
  }
  const toggleModal = () => {
    toggleView((prevState) => !prevState)
  }

  function renderChore(chore: Chore) {
    return <ChoreList chore={chore} onClick={() => setViewChore(chore)} />
  }

  function handleScroll(event: any) {
    const currentY = event.nativeEvent.contentOffset.y
    const contentHeight = event.nativeEvent.contentSize.height
    const layoutHeight = event.nativeEvent.layoutMeasurement.height

    const goingDown = currentY > lastScrollY

    const atTop = currentY <= 0
    const atBottom = currentY >= contentHeight - layoutHeight

    if (!atTop && !atBottom) {
      if ((goingDown && scrollDirection === "up") || (!goingDown && scrollDirection === "down")) {
        setScrollDirection(goingDown ? "down" : "up")
        Animated.timing(translateY, {
          toValue: goingDown ? 60 : 0,
          duration: 200,
          useNativeDriver: true,
        }).start()
      }
    }

    setLastScrollY(currentY)
  }

  function renderTop() {
    return (
      <>
        <View className="bg-slate-50 rounded-2xl p-4 mb-5">
          <View className="border-b border-teal-300">
            <Text className="text-lg font-regular text-center pb-2 ">Her kan du spare med Sphare!</Text>
          </View>
          <View className=" flex-row justify-center items-center py-2 space-x-6">
            <Image className="rounded-md" source={require("@/assets/images/sphare1.png")} resizeMode="contain" />
            <View className="flex flex-col h-36 justify-between items-center ">
              <Text className="text-3xl font-normal text-teal-500">Du har tjent:</Text>
              <Text className="text-2xl font-light text-center">{cashMullaCoin.mulla},-</Text>
              <View className="flex-row items-center">
                <Image
                  className="w-9 h-9 rounded-md"
                  source={require("@/assets/images/coin.png")}
                  resizeMode="contain"
                />
                <Text className="text-xl font-light">x{cashMullaCoin.sphareCoin}</Text>
              </View>
            </View>
          </View>
        </View>
        <Text className="text-lg pb-2 text-center border-b border-teal-300">Aktive gjøremål 👇</Text>
      </>
    )
  }
  return (
    <SafeAreaView className="bg-white flex-1" edges={["top"]}>
      <AppHeader />
      <View className="bg-white flex-1 flex-col px-8 ">
        <FlatList
          style={{ paddingTop: 20 }}
          contentContainerStyle={{ paddingBottom: 30 }}
          data={data}
          renderItem={(chore) => {
            if(chore.item.chore_status === "approved"){
              return renderChore(chore.item)
            }
            return null
          }}
          ListHeaderComponent={renderTop}
          scrollEnabled={true}
          onScroll={handleScroll}
          keyExtractor={(chore) => chore.chore_description}
          showsVerticalScrollIndicator={false}
        ></FlatList>
        <Animated.View
          className="absolute flex-row bottom-5 self-center space-x-8"
          style={{ transform: [{ translateY }] }}
        >
          <Button text="Se alle gjøremål" onClick={() => setShowPopover(true)} />
          <Button text="Foreslå gjøremål" onClick={() => console.log("Helloworld2")} />
        </Animated.View>
      </View>
      {choreOfInterest && (
        <Modal visible={viewChore} animationType="slide" transparent={true} onRequestClose={toggleModal}>
          <View className="h-full w-full flex justify-center items-center">
            <View className="p-4 w-full">
              <ChoresDetailedView chore={choreOfInterest} onClick={toggleModal} />
            </View>
          </View>
        </Modal>
      )}
      <Popover chore={data || []} onClick={() => setShowPopover(false)} showPopover={showPopover} />
    </SafeAreaView>
  )
}

export default Chores
