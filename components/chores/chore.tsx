import React from "react"
import { View, Text, Pressable } from "react-native"
import { Chore } from "../../backend/types/chore"

interface Props {
  chore: Chore
  onClick: () => void
}

const ChoreList: React.FC<Props> = ({ chore, onClick }) => {
  const choreDueDate = new Date(chore.time_limit.seconds * 1000)
  const currentTime = new Date()
  const threeDaysFromNow = new Date().setDate(currentTime.getDate() + 3)

  const color =
    choreDueDate < currentTime
      ? "text-red-500" // Past due
      : choreDueDate.getTime() < threeDaysFromNow
        ? "text-yellow-600" // Due within 3 days
        : "text-black" // More than 3 days left

  const availableChore = () => {
    return (
      <Pressable onPress={onClick}>
        <View className="w-full flex-row justify-between p-2 px-5 items-center bg-[#CBF1F4] rounded-2xl mb-2.5">
          <View className="flex-row items-center space-x-2.5">
            <View className="flex-col justify-center">
              <Text className="text-base">{chore.chore_title}</Text>
              <View className="flex-row items-center space-x-1.5">
                <Text className="text-xs color-slate-400">Frist:</Text>
                <Text className={color}>
                  {new Date(chore.time_limit.seconds * 1000).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </Text>
              </View>
            </View>
          </View>
          <View className="">
            <Text className="text-xs color-slate-400">Belønning:</Text>
            <Text className="text-lg text-green-600">{chore.reward_amount},-</Text>
          </View>
        </View>
      </Pressable>
    )
  }

  const unavailablechore = () => {
    const colour =
      chore.chore_status === "complete"
        ? "text-green-600"
        : chore.chore_status === "rejected"
          ? "text-red-600"
          : "text-yellow-600"

    return (
      <Pressable onPress={onClick}>
        <View className="w-full flex-row justify-between p-2 px-5 items-center bg-[#CBF1F4] rounded-2xl mb-2.5">
          <View className="flex-row items-center space-x-2.5">
            <View className="flex-col justify-center">
              <Text className="text-base">{chore.chore_title}</Text>
              <View className="flex-row items-center space-x-1.5"></View>
            </View>
          </View>
          <View className="">
            <Text className="text-xs color-slate-400">Belønning:</Text>
            <Text className={`text-lg ${colour}`}>{chore.reward_amount},-</Text>
          </View>
        </View>
      </Pressable>
    )
  }

  return chore.chore_status === "available" ? availableChore() : unavailablechore()
}

export default ChoreList
