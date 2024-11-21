import { Modal, Text, View, Image, Dimensions, Pressable, TextInput, FlatList } from "react-native"
import DateTimePicker from "@react-native-community/datetimepicker"
import { Chore } from "../../../backend/types/chore"
import { ScrollView } from "react-native-gesture-handler"
import ChoreList from "../chore"
import ChoresDetailedView from "../choresDetailedView"
import React, { useState } from "react"
import Button from "@/components/ui/button"
import { Timestamp } from "firebase/firestore"
import { useCreateChore, useGetChoreIcons, useGetUser, useGetUserID } from "@/hooks/useGetFirestoreData"

interface Props {
  chores: Chore[]
  onClick: () => void
}

const { height } = Dimensions.get("window")

const Requested: React.FC<Props> = ({ chores, onClick }) => {
  const [viewChore, toggleView] = React.useState(false)
  const [choreOfInterest, setChoreOfInterest] = React.useState<Chore | null>(null)

  const { data: userID } = useGetUserID()
  const { data: user } = useGetUser(userID ?? "")
  const [showModal, setShowModal] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [icon, setIcon] = useState("")
  const [isRepeatable, setIsRepeatable] = useState(false)
  const [recurrence, setRecurrence] = useState<"daily" | "weekly" | "monthly">("daily")
  const [rewardAmount, setRewardAmount] = useState("")
  const [timeLimit, setTimeLimit] = useState(new Date())

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
  }

  const setViewChore = (chore: Chore) => {
    setChoreOfInterest(chore)
    toggleModal()
  }
  const toggleModal = () => {
    toggleView((prevState) => !prevState)
  }

  const earnedCoin = chores.reduce((acc, chore) => {
    if ((chore.chore_status === "complete" && !chore.paid) || chore.chore_status === "pending") {
      return acc + chore.reward_amount
    }
    return acc
  }, 0)

  const scrollHeight = height * 0.26
  return (
    <View className="w-full flex flex-col items-center justify-center py-4 space-y-2">
      <View className="flex flex-row space-x-2">
        <View className="w-[50%] flex justify-center items-center rounded-lg bg-[#E6FDFF]">
          <Text className=" p-4 ">Så flink du har vært! Her kan du se alle gjennomførte gjøremål!</Text>
        </View>
        <View>
          <Image className="rounded-md" source={require("@/assets/images/sphare3.png")} resizeMode="contain" />
        </View>
      </View>
      <View style={{ height: scrollHeight }} className="mb-2 border-b-2 border-teal-300">
        <ScrollView>
          {chores
            .filter((chore) => (chore.chore_status === "complete" && !chore.paid) || chore.chore_status === "pending")
            .map((chore, index) => (
              <View key={index}>
                <ChoreList chore={chore} onClick={() => setViewChore(chore)} />
              </View>
            ))}
        </ScrollView>
      </View>
      {choreOfInterest && (
        <Modal visible={viewChore} animationType="slide" transparent={true} onRequestClose={toggleModal}>
          <View className="h-full w-full flex justify-center items-center">
            <View className="p-4 w-full">
              <ChoresDetailedView chore={choreOfInterest} onClick={toggleModal} refetch={() => {}} />
            </View>
          </View>
        </Modal>
      )}
      <View className="w-full flex flex-row justify-between items-center rounded-lg bg-[#E6FDFF] p-4">
        <View className="w-[50%] flex flex-col">
          <Text className="w-full text-left">Du har forespurt gjøremål for:</Text>
          <Text className="w-full text-left px-2 py-1 font-semibold text-xl text-green-600">{earnedCoin} NOK</Text>
          {/* <View className="flex flex-row w-full"> */}
          <Text className="w-full my-1">Foreslå et til så tjener du mer!</Text>
          <Button classname="py-1" text="Foreslå gjøremål" onClick={() => setShowModal(true)}></Button>
          {/* </View> */}
        </View>
        <Image className="rounded-md" source={require("@/assets/images/sphare3.png")} resizeMode="contain" />
      </View>
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
    </View>
  )
}

export default Requested
