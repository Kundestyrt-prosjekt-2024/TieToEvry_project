import { View, Text, Pressable, FlatList, Image, ScrollView } from "react-native"
import React, { useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import AppHeader from "@/components/ui/AppHeader"
import { useGetChildren, useGetSavingGoals, useGetUser, useGetUserID } from "@/hooks/useGetFirestoreData"
import { Bike, Check, MonitorSmartphone, Shirt, Ticket } from "lucide-react-native"
import { useRouter } from "expo-router"
import AntDesign from "@expo/vector-icons/AntDesign"

const savingsParent = () => {
  const router = useRouter()

  const parentID = useGetUserID()
  const parent = useGetUser(parentID.data || "")
  const children = useGetChildren(parent.data?.children || [])

  const [selectedChildIndex, setSelectedChildIndex] = useState(0)

  const selectedChildID = parent.data?.children?.[selectedChildIndex]

  const savingGoals = useGetSavingGoals(selectedChildID || "")

  const sortedGoals =
    savingGoals.data
      ?.sort((a, b) => {
        // Calculate progress for both goals
        const progressA = a.current_amount / a.goal_amount
        const progressB = b.current_amount / b.goal_amount

        // If progress is >= 1, move to the beginning
        if (progressA >= 1 && progressB < 1) {
          return -1 // a comes before b
        } else if (progressA < 1 && progressB >= 1) {
          return 1 // b comes before a
        } else {
          return 0 // keep original order for other cases
        }
      })
      .reverse() || []

  return (
    <SafeAreaView className="bg-white h-full">
      <AppHeader parent />
      {(parent.data?.children || []).length > 0 ? (
        <>
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
                        onPress={() => router.push("/SignupChild")}
                      >
                        <AntDesign name="pluscircle" size={40} color="#CCF2F5" />
                      </Pressable>
                    )
                  } else {
                    const isSelected = selectedChildIndex === index
                    return (
                      <Pressable className="flex-col items-center mx-3" onPress={() => setSelectedChildIndex(index)}>
                        <View
                          className={`rounded-full h-20 w-20 items-center overflow-hidden ${isSelected ? "border-4 border-blue-500" : ""}`}
                        >
                          <Image
                            source={{ uri: item.profilePicture }}
                            className="w-full h-full"
                            style={{ resizeMode: "cover" }}
                          />
                        </View>
                        <Text className="mt-2 font-medium text-sm">{item.name}</Text>
                      </Pressable>
                    )
                  }
                }}
                keyExtractor={(item) => item?.name || ""}
                showsHorizontalScrollIndicator={false}
              />
            </View>
            <Text className="text-center my-10 text-lg">
              Her er {children[selectedChildIndex].data?.name.split(" ")[0]} sine sparemål:
            </Text>
            <View className="flex flex-col items-center">
              {sortedGoals.map((goal, index) => {
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
        </>
      ) : (
        <View className="mt-40 flex items-center">
          <Text>Det virker som du ikke har lagt til dine barn enda.</Text>
          <View className="flex flex-row gap-8 justify-center items-center mt-8">
            <Pressable onPress={() => router.push("/SignupChild")}>
              <AntDesign name="pluscircle" size={60} color="#3b82f6" />
            </Pressable>
            <Text className="text-lg">Legg til barn</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  )
}

export default savingsParent
