import { View, Text, FlatList, Pressable, Image, TextInput, Modal } from "react-native"
import React, { useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import AppHeader from "@/components/AppHeader"
import { useCreateChore, useGetChildren, useGetUser, useGetUserID } from "@/hooks/useGetFirestoreData"
import DataLoading from "@/components/DataLoading"
import { ScrollView } from "react-native-gesture-handler"
import Ionicons from "@expo/vector-icons/Ionicons"

const choresParent = () => {
  const parentID = useGetUserID()
  const parent = useGetUser(parentID.data || "")
  const children = useGetChildren(parent.data?.children || [])

  const [selectedChildIndex, setSelectedChildIndex] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState("Aktive")
  const [showModal, setShowModal] = useState(false)
  const [choreName, setChoreName] = useState("")
  const [choreDescription, setChoreDescription] = useState("")

  const createChore = useCreateChore()

  const selectedChildID = parent.data?.children?.[selectedChildIndex]

  const handleCreateChore = () => {
    setShowModal(false)
    setChoreName("")
    setChoreDescription("")
  }

  if (children.some((query) => query.isPending)) {
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
            data={children.map((child) => child.data)}
            renderItem={({ item, index }) => {
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
                      source={{ uri: item?.profilePicture }}
                      className="w-full h-full"
                      style={{ resizeMode: "cover" }}
                    />
                  </View>
                  <Text>{item?.name}</Text>
                </Pressable>
              )
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
      <Modal animationType="slide" transparent={true} visible={showModal} onRequestClose={() => setShowModal(false)}>
        <Pressable className="flex-1 justify-center items-center bg-opacity-50" onPress={() => setShowModal(false)}>
          <Pressable className="bg-white rounded-lg w-4/5 p-6 shadow-lg" onPress={() => setShowModal(true)}>
            <Text className="text-lg font-bold mb-4">Opprett et gjøremål</Text>

            <TextInput
              placeholder="Chore Name"
              value={choreName}
              onChangeText={setChoreName}
              className="border border-gray-300 rounded p-2 mb-4"
            />

            <TextInput
              placeholder="Chore Description"
              value={choreDescription}
              onChangeText={setChoreDescription}
              multiline
              className="border border-gray-300 rounded p-2 mb-4"
              style={{ height: 100, textAlignVertical: "top" }}
            />

            <View className="flex flex-row justify-end gap-4">
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
