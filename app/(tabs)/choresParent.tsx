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
import AntDesign from "@expo/vector-icons/AntDesign"
import ChoreList from "@/components/chores/chore"
import ChoresDetailedView from "@/components/chores/choresDetailedView"

const choresParent = () => {
  const router = useRouter()

  const parentID = useGetUserID()
  const parent = useGetUser(parentID.data || "")

  const [selectedChildIndex, setSelectedChildIndex] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState("Aktive")
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [icon, setIcon] = useState("")
  const [isRepeatable, setIsRepeatable] = useState(false)
  const [recurrence, setRecurrence] = useState<"daily" | "weekly" | "monthly">("daily")
  const [rewardAmount, setRewardAmount] = useState("")
  const [timeLimit, setTimeLimit] = useState(new Date())

  const [viewChore, toggleView] = useState(false)
  const [choreOfInterest, setChoreOfInterest] = useState<Chore | null>(null)

  const selectedChildID = parent.data?.children?.[selectedChildIndex]

  const children = useGetChildren(parent.data?.children || [])
  const childChores = useGetChores(selectedChildID ?? "")

  const choreIcons = useGetChoreIcons()

  const createChore = useCreateChore()

  const setViewChore = (chore: Chore) => {
    setChoreOfInterest(chore)
    toggleModal()
  }

  const toggleModal = () => {
    toggleView((prevState) => !prevState)
  }

  const handleCreateChore = () => {
    setShowModal(false)
    const chore: Chore = {
      child_id: selectedChildID!,
      parent_id: parentID.data!,
      chore_title: title,
      chore_description: description,
      icon: icon,
      chore_status: "available",
      created_at: Timestamp.now(),
      is_repeatable: isRepeatable,
      recurrence: recurrence,
      reward_amount: parseInt(rewardAmount),
      time_limit: Timestamp.fromDate(timeLimit),
      paid: false,
    }
    createChore.mutate(chore)
    setDescription("")
    setIcon("")
    setIsRepeatable(false)
    setRecurrence("daily")
    setRewardAmount("")
    setTimeLimit(new Date())
  }

  const handleCategoryChange = (category: string) => {
    if (category === "Aktive") {
      setSelectedCategory("available")
      setSelectedCategoryIndex(0)
    } else if (category === "Forslag") {
      setSelectedCategory("pending")
      setSelectedCategoryIndex(1)
    } else if (category === "Forespurt godkjent") {
      setSelectedCategory("complete")
      setSelectedCategoryIndex(2)
    } else if (category === "Godkjent") {
      setSelectedCategory("complete")
      setSelectedCategoryIndex(3)
    }
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
                    className="items-center justify-center mb-8 ml-4 w-16"
                    onPress={() => router.push("/signupChild")}
                  >
                    <AntDesign name="pluscircle" size={40} color="#CCF2F5" />
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
        <Text className="text-center my-10 text-lg">
          Her er {children[selectedChildIndex]?.data?.name.split(" ")[0]} sine gjøremål:
        </Text>
        <View className="flex flex-row gap-2 justify-center">
          {["Aktive", "Forslag", "Forespurt godkjent", "Godkjent"].map((category, index) => (
            <Pressable
              key={category}
              className={`p-3 ${index === selectedCategoryIndex ? "bg-red-300" : "bg-red-100"} rounded-md`}
              onPress={() => handleCategoryChange(category)}
            >
              <Text>{category}</Text>
            </Pressable>
          ))}
        </View>
        <View className="mt-4 px-8">
          {selectedCategoryIndex === 0 && (
            <Text className="text-center text-md mb-4">
              Dette er aktive gjøremål som {children[selectedChildIndex]?.data?.name.split(" ")[0]} ikke har fullført.
            </Text>
          )}
          {selectedCategoryIndex === 1 && (
            <Text className="text-center text-md mb-4">
              Dette er gjøremål som {children[selectedChildIndex]?.data?.name.split(" ")[0]} har foreslått.
            </Text>
          )}
          {selectedCategoryIndex === 2 && (
            <Text className="text-center text-md mb-4">
              Dette er gjøremål som {children[selectedChildIndex]?.data?.name.split(" ")[0]} ønsker godkjent.
            </Text>
          )}
          {selectedCategoryIndex === 3 && (
            <Text className="text-center text-md mb-4">
              Dette er gjøremål som {children[selectedChildIndex]?.data?.name.split(" ")[0]} har fullført og fått betalt
              for.
            </Text>
          )}
          {childChores.data
            ?.filter((chore) => chore.chore_status === selectedCategory)
            .filter((chore) => (selectedCategoryIndex === 3 ? chore.paid : !chore.paid))
            .map((chore) => <ChoreList chore={chore} onClick={() => setViewChore(chore)} />)}
        </View>
      </ScrollView>
      <Pressable className="absolute bottom-5 right-5 bg-blue-500 rounded-full p-4" onPress={() => setShowModal(true)}>
        <Ionicons name="add" size={40} color="white" />
      </Pressable>
      {choreOfInterest && (
        <Modal visible={viewChore} animationType="slide" transparent={true} onRequestClose={toggleModal}>
          <View className="h-full w-full flex justify-center items-center">
            <View className="p-4 w-full">
              <ChoresDetailedView
                chore={choreOfInterest}
                onClick={toggleModal}
                refetch={childChores.refetch}
                parentSide
              />
            </View>
          </View>
        </Modal>
      )}
      <Modal transparent={true} visible={showModal} onRequestClose={() => setShowModal(false)}>
        <Pressable className="flex-1 justify-center items-center bg-opacity-50" onPress={() => setShowModal(false)}>
          <Pressable className="bg-white rounded-lg w-4/5 p-6 shadow-lg" onPress={() => setShowModal(true)}>
            <Text className="text-lg font-bold mb-4">Opprett et gjøremål</Text>

            <TextInput
              placeholder="Tittel"
              value={title}
              onChangeText={setTitle}
              className="border border-gray-300 rounded p-2 mb-4"
            />

            <TextInput
              placeholder="Beskrivelse"
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
              value={rewardAmount}
              onChangeText={setRewardAmount}
              keyboardType="numeric"
              className="border border-gray-300 rounded p-2 mb-4"
            />

            <View className="flex items-start flex-col">
              <Text className="mb-2">Tidsfrist</Text>
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
                <Text className="text-white">Opprett</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  )
}

export default choresParent
