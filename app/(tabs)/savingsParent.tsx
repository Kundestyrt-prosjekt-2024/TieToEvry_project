import { View, Text, Pressable, FlatList, Image, TouchableOpacity, ScrollView } from "react-native"
import React, { useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import AppHeader from "@/components/AppHeader"
import { useGetChildren, useGetSavingGoals, useGetUser, useGetUserID } from "@/hooks/useGetFirestoreData"
import DataLoading from "@/components/DataLoading"
import { Bike, Check, MonitorSmartphone, Shirt, Ticket } from "lucide-react-native"

const savingsParent = () => {
  const parentID = useGetUserID()
  const parent = useGetUser(parentID.data || "")
  const children = useGetChildren(parent.data?.children || [])

  const [selectedChildIndex, setSelectedChildIndex] = useState(0)

  const selectedChildID = parent.data?.children?.[selectedChildIndex]

  const savingGoals = useGetSavingGoals(selectedChildID || "")

  if (children.some((query) => query.isPending) || savingGoals.isPending) {
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
        <Text className="text-center my-10 text-lg">Her er {children[selectedChildIndex].data?.name}'s sparemål:</Text>
        <View className="flex flex-col items-center">
          {savingGoals.data?.map((goal, index) => {
            const progress = goal.current_amount / goal.goal_amount

            if (progress >= 1) {
              return (
                <View key={index} className="flex-col items-center pb-1">
                  <View
                    style={{ width: 363, height: 50 }}
                    className="flex-col justify-around px-4 rounded-3xl bg-[#CBF1F4]"
                  >
                    <Text className="text-xl ml-2">
                      Sparemål: {goal.title} <Check className="text-green-500" />
                    </Text>
                  </View>
                </View>
              )
            }

            return (
              <View key={index} className="flex-col items-center pb-1">
                <View
                  style={{ width: 363, height: 170 }}
                  className="flex-col justify-around p-4 rounded-3xl bg-[#CBF1F4]"
                >
                  <View className="flex-row items-center">
                    <View className="flex-row items-center">
                      <View
                        style={{ width: 50, height: 50 }}
                        className="bg-white rounded-full border-2 justify-center items-center"
                      >
                        {/* Use the icon based on goal.icon_id */}
                        {goal.icon_id === "Bike" && <Bike color="black" style={{ width: 40, height: 40 }} />}
                        {goal.icon_id === "Shirt" && <Shirt color="black" style={{ width: 40, height: 40 }} />}
                        {goal.icon_id === "Ticket" && <Ticket color="black" style={{ width: 40, height: 40 }} />}
                        {goal.icon_id === "MonitorSmartphone" && (
                          <MonitorSmartphone color="black" style={{ width: 40, height: 40 }} />
                        )}
                      </View>
                      <Text className="text-xl ml-2">{goal.title}</Text>
                    </View>
                  </View>

                  <View className="flex-row my-0">
                    <Text className="flex-1 text-sm text-left">{goal.current_amount} kr</Text>
                    <Text className="flex-1 text-sm text-center">{(goal.goal_amount / 2).toFixed(2)} kr</Text>
                    <Text className="flex-1 text-sm text-right">{goal.goal_amount} kr</Text>
                  </View>

                  <View className="my-0">
                    <View className="w-full h-7 bg-[#1A801E] border-2 border-black rounded-full">
                      <View
                        className="h-full bg-[#72E977] border-1 border-black rounded-full"
                        style={{ width: `${Math.min(progress * 100, 100)}%` }}
                      />
                    </View>
                  </View>
                </View>
              </View>
            )
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default savingsParent
