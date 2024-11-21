import AppHeader from "@/components/ui/AppHeader"
import { View, Text, Pressable, Image, Modal, FlatList, Animated, TextInput, Switch } from "react-native"
import DateTimePicker from "@react-native-community/datetimepicker"
import { SafeAreaView } from "react-native-safe-area-context"
import { Chore } from "../../backend/types/chore"
import React, { useEffect, useRef, useState } from "react"
import ChoreList from "@/components/chores/chore"
import ChoresDetailedView from "@/components/chores/choresDetailedView"
import Button from "@/components/ui/button"
import Popover from "@/components/chores/chorePopover"
import {
  useCreateChore,
  useGetBankAccount,
  useGetChoreIcons,
  useGetChores,
  useGetUser,
  useGetUserID,
} from "@/hooks/useGetFirestoreData"
import { Timestamp } from "firebase/firestore"

const Chores = () => {
  const [viewChore, toggleView] = React.useState(false)
  const [choreOfInterest, setChoreOfInterest] = React.useState<Chore | null>(null)
  const [showPopover, setShowPopover] = React.useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [scrollDirection, setScrollDirection] = useState("up")
  const translateY = useRef(new Animated.Value(0)).current
  const { data: userID } = useGetUserID()
  const { data: user } = useGetUser(userID ?? "")
  const { data: balance } = useGetBankAccount(userID ?? "")
  const { data, isLoading, isError, refetch } = useGetChores(userID ?? "")

  useEffect(() => {
    const intervalId = setInterval(() => {
      refetch() // Refetch every 1 second
    }, 500)

    return () => clearInterval(intervalId) // Cleanup interval on unmount
  }, [data])

  const [showModal, setShowModal] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [icon, setIcon] = useState("")
  const [isRepeatable, setIsRepeatable] = useState(false)
  const [recurrence, setRecurrence] = useState<"daily" | "weekly" | "monthly">("daily")
  const [rewardAmount, setRewardAmount] = useState("")
  const [timeLimit, setTimeLimit] = useState(new Date())

  const sphareCoinsReceived = (data?.filter((chore) => chore.chore_status === "complete" && chore.paid).length || 0) * 3

  const moneyReceived = data
    ?.filter((chore) => chore.chore_status === "complete" && chore.paid)
    .reduce((acc, currentValue) => acc + currentValue.reward_amount, 0)

  const choreIcons = useGetChoreIcons()

  const createChore = useCreateChore()

  const handleCreateChore = () => {
    setShowModal(false)
    const chore: Chore = {
      child_id: userID!,
      parent_id: user?.parents ? user.parents[0] : "",
      chore_title: title,
      chore_description: description,
      icon: icon,
      chore_status: "pending",
      created_at: Timestamp.now(),
      is_repeatable: false,
      recurrence: recurrence,
      reward_amount: parseInt(rewardAmount),
      time_limit: Timestamp.fromDate(timeLimit),
      paid: false,
    }
    createChore.mutate(chore)
    refetch()
  }

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
    mulla: balance?.balance,
    sphareCoin: balance?.balance,
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
              <Text className="text-2xl font-light text-center">{moneyReceived},-</Text>
              <View className="flex-row items-center">
                <Image
                  className="w-9 h-9 rounded-md"
                  source={require("@/assets/images/coin.png")}
                  resizeMode="contain"
                />
                <Text className="text-xl font-light">x{sphareCoinsReceived}</Text>
              </View>
            </View>
          </View>
        </View>
        <Text className="text-lg pb-2 text-center ">Aktive gjøremål 👇</Text>
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
            if (chore.item.chore_status === "available") {
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
          <Button text="Foreslå gjøremål" onClick={() => setShowModal(true)} />
        </Animated.View>
      </View>
      {choreOfInterest && (
        <Modal visible={viewChore} animationType="slide" transparent={true} onRequestClose={toggleModal}>
          <View className="h-full w-full flex justify-center items-center">
            <View className="p-4 w-full">
              <ChoresDetailedView chore={choreOfInterest} onClick={toggleModal} refetch={refetch} />
            </View>
          </View>
        </Modal>
      )}
      <Popover chore={data || []} onClick={() => setShowPopover(false)} showPopover={showPopover} />
      <Modal transparent={true} visible={showModal} onRequestClose={() => setShowModal(false)}>
        <Pressable className="flex-1 justify-center items-center bg-opacity-50" onPress={() => setShowModal(false)}>
          <Pressable className="bg-white rounded-lg w-4/5 p-6 shadow-lg" onPress={() => setShowModal(true)}>
            <Text className="text-lg font-bold mb-4">Opprett et gjøremål</Text>

            <TextInput
              placeholder="Tittel"
              placeholderTextColor="gray"
              value={title}
              onChangeText={setTitle}
              className="border border-gray-300 rounded p-2 mb-4"
            />

            <TextInput
              placeholder="Gjøremålbeskrivelse"
              placeholderTextColor="gray"
              value={description}
              onChangeText={setDescription}
              className="border border-gray-300 rounded p-2 mb-4"
            />

            <View className="flex flex-col gap-2">
              <Text>Velg ikon</Text>
              <FlatList
                data={choreIcons.data}
                numColumns={4}
                renderItem={({ item }) => (
                  <Pressable
                    className={`w-7 h-7 mx-4 my-2 rounded-full overflow-hidden object-cover ${item === icon ? "border-2 border-blue-500" : ""}`}
                    onPress={() => setIcon(item)}
                  >
                    <Image source={{ uri: item }} className="h-full w-full" />
                  </Pressable>
                )}
                keyExtractor={(_item, index) => index.toString()}
                scrollEnabled={false}
              />
            </View>

            <View className="flex flex-row justify-between items-center mb-2">
              <Text>Repeterende?</Text>
              <Switch value={isRepeatable} onValueChange={(value) => setIsRepeatable(value)} />
            </View>

            {isRepeatable && (
              <View className="mb-4">
                <Text className="mb-2">Hvor ofte?</Text>
                <View className="flex flex-row gap-2">
                  <Pressable
                    className={`${recurrence === "daily" ? "bg-blue-300" : "border border-gray-300"} p-2 rounded-lg`}
                    onPress={() => setRecurrence("daily")}
                  >
                    <Text>Daglig</Text>
                  </Pressable>
                  <Pressable
                    className={`${recurrence === "weekly" ? "bg-blue-300" : "border border-gray-300"} p-2 rounded-lg`}
                    onPress={() => setRecurrence("weekly")}
                  >
                    <Text>Ukentlig</Text>
                  </Pressable>
                  <Pressable
                    className={`${recurrence === "monthly" ? "bg-blue-300" : "border border-gray-300"} p-2 rounded-lg`}
                    onPress={() => setRecurrence("monthly")}
                  >
                    <Text>Månedlig</Text>
                  </Pressable>
                </View>
              </View>
            )}

            <TextInput
              placeholder="Belønning"
              placeholderTextColor="gray"
              value={rewardAmount}
              onChangeText={setRewardAmount}
              keyboardType="numeric"
              className="border border-gray-300 rounded p-2 mb-4"
            />

            <View className="flex items-start flex-col">
              <Text className="mb-2">Frist</Text>
              <DateTimePicker
                value={timeLimit}
                mode="datetime"
                display="default"
                onChange={(_event, selectedDate) => {
                  if (selectedDate) {
                    setTimeLimit(selectedDate)
                  }
                }}
              />
            </View>

            <View className="flex flex-row justify-end gap-4 mt-4">
              <Pressable className="bg-gray-300 rounded-md px-4 py-2" onPress={() => setShowModal(false)}>
                <Text>Avbryt</Text>
              </Pressable>
              <Pressable className="bg-blue-500 rounded-md px-4 py-2" onPress={handleCreateChore}>
                <Text className="text-white">Lagre</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  )
}

export default Chores
