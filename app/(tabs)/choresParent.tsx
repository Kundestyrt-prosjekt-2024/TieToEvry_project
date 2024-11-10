import { View, Text, FlatList, Pressable, Image } from "react-native"
import React, { useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import AppHeader from "@/components/AppHeader"
import { useGetChildren, useGetUser, useGetUserID } from "@/hooks/useGetFirestoreData"
import DataLoading from "@/components/DataLoading"

const choresParent = () => {
  const parentID = useGetUserID()
  const parent = useGetUser(parentID.data || "")
  const children = useGetChildren(parent.data?.children || [])

  const [selectedChildIndex, setSelectedChildIndex] = useState(0)

  const selectedChildID = parent.data?.children?.[selectedChildIndex]

  if (children.some((query) => query.isPending)) {
    return <DataLoading />
  }
  return (
    <SafeAreaView className="bg-white h-full">
      <AppHeader parent />
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
    </SafeAreaView>
  )
}

export default choresParent
