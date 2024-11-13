import { View, Text, FlatList, Pressable, Image, TextInput, Modal, Switch } from "react-native"
import React, { useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import AppHeader from "@/components/AppHeader"
import {
  useCreateChore,
  useGetChildren,
  useGetChoreIcons,
  useGetChores,
  useGetUser,
  useGetUserID,
} from "@/hooks/useGetFirestoreData"
import DataLoading from "@/components/DataLoading"
import { ScrollView } from "react-native-gesture-handler"
import Ionicons from "@expo/vector-icons/Ionicons"
import { Chore } from "@/backend/types/chore"
import { Timestamp } from "firebase/firestore"
import DateTimePicker from "@react-native-community/datetimepicker"
import { useRouter } from "expo-router"

const choresParent = () => {
  const router = useRouter()

  const parentID = useGetUserID()
  const parent = useGetUser(parentID.data || "")

  const [selectedChildIndex, setSelectedChildIndex] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState("Aktive")
  const [showModal, setShowModal] = useState(false)

  const [description, setDescription] = useState("")
  const [icon, setIcon] = useState("")
  const [isRepeatable, setIsRepeatable] = useState(false)
  const [recurrence, setRecurrence] = useState<"daily" | "weekly" | "monthly">("daily")
  const [rewardAmount, setRewardAmount] = useState("")
  const [timeLimit, setTimeLimit] = useState(new Date())

  const selectedChildID = parent.data?.children?.[selectedChildIndex]

  const children = useGetChildren(parent.data?.children || [])
  const childChores = useGetChores(selectedChildID ?? "")

  const choreIcons = useGetChoreIcons()

  const createChore = useCreateChore()

  const handleCreateChore = () => {
    setShowModal(false)
    const chore: Chore = {
      child_id: selectedChildID!,
      parent_id: parentID.data!,
      chore_description: description,
      icon: icon,
      chore_status: "approved",
      created_at: Timestamp.now(),
      is_repeatable: isRepeatable,
      recurrence: recurrence,
      reward_amount: parseInt(rewardAmount),
      time_limit: Timestamp.fromDate(timeLimit),
    }
    createChore.mutate(chore)
    setDescription("")
    setIcon("")
    setIsRepeatable(false)
    setRecurrence("daily")
    setRewardAmount("")
    setTimeLimit(new Date())
  }

  if (children.some((query) => query.isPending) || choreIcons.isPending) {
    return <DataLoading />
  }
  return (
    <SafeAreaView className="bg-white h-full">
      <AppHeader parent />
      <ScrollView>
        <View className="flex items-center mt-6">
          <FlatList
            scrollEnabled={true}
            horizontal={true}
            data={[...children.map((child) => child.data), { isSpecialItem: true, name: "dummyText" }]}
            renderItem={({ item, index }) => {
              if (!item) return null
              if ("isSpecialItem" in item) {
                return (
                  <Pressable
                    className="flex items-center justify-center mb-8 ml-4 w-16"
                    onPress={() => router.push("/signupChild")}
                  >
                    <Ionicons name="add" size={50} color="#3b82f6" />
                  </Pressable>
                )
              } else {
                const isSelected = selectedChildIndex === index
                return (
                  <Pressable
                    className="flex flex-col items-center justify-center gap-4"
                    onPress={() => setSelectedChildIndex(index)}
                  >
                    <View
                      className={`rounded-full h-20 w-20 justify-center items-center overflow-hidden ${isSelected ? "border-4 border-blue-500" : ""}`}
                    >
                      <Image
                        source={{ uri: item.profilePicture }}
                        className="w-full h-full"
                        style={{ resizeMode: "cover" }}
                      />
                    </View>
                    <Text>{item.name}</Text>
                  </Pressable>
                )
              }
            }}
            keyExtractor={(item) => item?.name || ""}
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <View className="w-8" />}
          />
        </View>
        <Text className="text-center my-10 text-lg">Her er {children[selectedChildIndex].data?.name}'s gjøremål:</Text>
        <View className="flex flex-row gap-2 justify-center">
          {["Aktive", "Forespurt godkjent", "Godkjent"].map((category) => (
            <Pressable
              key={category}
              className={`p-3 ${category === selectedCategory ? "bg-blue-400" : "bg-blue-300"} rounded-md`}
              onPress={() => setSelectedCategory(category)}
            >
              <Text>{category}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
      <Pressable className="absolute bottom-5 right-5 bg-blue-500 rounded-full p-4" onPress={() => setShowModal(true)}>
        <Ionicons name="add" size={24} color="white" />
      </Pressable>
      <Modal transparent={true} visible={showModal} onRequestClose={() => setShowModal(false)}>
        <Pressable className="flex-1 justify-center items-center bg-opacity-50" onPress={() => setShowModal(false)}>
          <Pressable className="bg-white rounded-lg w-4/5 p-6 shadow-lg" onPress={() => setShowModal(true)}>
            <Text className="text-lg font-bold mb-4">Opprett et gjøremål</Text>

            <TextInput
              placeholder="Chore Description"
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

            <View className="flex flex-row justify-between items-center mb-4">
              <Text>Is Repeatable?</Text>
              <Switch value={isRepeatable} onValueChange={(value) => setIsRepeatable(value)} />
            </View>

            {isRepeatable && (
              <TextInput
                placeholder="Recurrence (e.g., Daily, Weekly)"
                value={recurrence}
                onChangeText={(text) => setRecurrence(text as "daily" | "weekly" | "monthly")}
                className="border border-gray-300 rounded p-2 mb-4"
              />
            )}

            <TextInput
              placeholder="Reward Amount"
              value={rewardAmount}
              onChangeText={setRewardAmount}
              keyboardType="numeric"
              className="border border-gray-300 rounded p-2 mb-4"
            />

            <View className="flex items-start flex-col">
              <Text className="mb-2">Time Limit</Text>
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
                <Text>Cancel</Text>
              </Pressable>

              <Pressable className="bg-blue-500 rounded-md px-4 py-2" onPress={handleCreateChore}>
                <Text className="text-white">Create</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  )
}

export default choresParent
