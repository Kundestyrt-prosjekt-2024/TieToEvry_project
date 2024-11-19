import React from "react"
import { View, Text, Pressable, Image } from "react-native"
import { Chore } from "../../backend/types/chore"
import Button from "../ui/button"
import { useGetUser, useUpdateChoreStatus } from "@/hooks/useGetFirestoreData"

interface PropsDetailedView {
  chore: Chore
  onClick: () => void
  refetch: () => void
  parentSide?: boolean
}

const ChoresDetailedView: React.FC<PropsDetailedView> = ({ chore, onClick, refetch, parentSide = false }) => {
  const { mutate: updateChoreStatus } = useUpdateChoreStatus()
  const { data: parent } = useGetUser(chore.parent_id)
  const { data: child } = useGetUser(chore.child_id)
  const sphareCoins = 3

  async function handleStatus(newStatus: string) {
    try {
      if (chore.chore_status === "complete") {
        chore.paid = true
      }
      await updateChoreStatus({ chore: chore, status: newStatus })
      refetch()
      console.log("Chore status updated successfully")
      onClick()
    } catch (error) {
      console.error("Failed to update chore status:", error)
    }
  }

  const avilableChore = () => {
    return (
      <View className="bg-[#CCF2F5] p-4 rounded-lg space-y-2 items-center justify-between w-full">
        <View className="w-full flex flex-row justify-between border-b border-teal-300 py-2">
          <View className="">
            <Text className="text-sm color-slate-400">Oppgave:</Text>
            <Text className="text-lg">{chore.chore_title}</Text>
          </View>
          <View className="flex flex-col items-center">
            <Text className="w-full text-sm color-slate-400">Belønning:</Text>
            <View className="flex flex-row space-x-2 py-1">
              <Text className="text-lg font-semibold text-green-600">{chore.reward_amount},-</Text>
              <View className="flex flex-row">
                <Image
                  className="w-7 h-7 rounded-md"
                  source={require("@/assets/images/coin.png")}
                  resizeMode="contain"
                />
                <Text className="text-lg">{sphareCoins}</Text>
              </View>
            </View>
          </View>
        </View>
        <View className="flex flex-row w-full border-b border-teal-300 justify-between items-start">
          <View className="py-2 w-[60%] ">
            <Text className="text-sm color-slate-400">Beskrivelse:</Text>
            <Text className="text-base">{chore.chore_description}</Text>
          </View>
          <View className="flex flex-col justify-end items-end py-2 w-[40%]">
            <Text className="text-sm color-slate-400">Frist:</Text>
            <Text className="text-lg">
              {new Date(chore.time_limit.seconds * 1000).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </Text>
          </View>
        </View>
        <View className="w-full flex flex-row items-center space-x-2">
          <Text className="text-sm color-slate-400">Fra:</Text>
          <Text className="text-base">{parentSide ? child?.name : parent?.name}</Text>
        </View>
        <View className="flex flex-row justify-between w-full pt-2">
          <Button onClick={onClick} text="Lukk" classname="bg-slate-50 px-3 py-1"></Button>
          <View className="flex justify-center flex-row space-x-2">
            <View>
              <Button
                onClick={() =>
                  parentSide
                    ? chore.chore_status === "complete"
                      ? handleStatus("complete")
                      : handleStatus("available")
                    : handleStatus("complete")
                }
                text="Godkjenn"
                classname=" bg-green-200 px-3 py-1"
              ></Button>
            </View>
            <View>
              <Button onClick={() => handleStatus("rejected")} text="Avslå" classname="px-3 py-1"></Button>
            </View>
          </View>
        </View>
      </View>
    )
  }
  const unavailableChore = () => {
    return (
      <View className="bg-[#CCF2F5] p-4 rounded-lg space-y-2 items-center justify-between w-full">
        <View className="w-full flex flex-row justify-between border-b border-teal-300 py-2">
          <View className="">
            <Text className="text-sm color-slate-400">Oppgave:</Text>
            <Text className="text-lg">{chore.chore_title}</Text>
          </View>
          <View className="flex flex-col items-center">
            <Text className="w-full text-sm color-slate-400">Belønning:</Text>
            <View className="flex flex-row space-x-2 py-1">
              <Text className="text-lg font-semibold text-green-600">{chore.reward_amount},-</Text>
              <View className="flex flex-row">
                <Image
                  className="w-7 h-7 rounded-md"
                  source={require("@/assets/images/coin.png")}
                  resizeMode="contain"
                />
                <Text className="text-lg">{sphareCoins}</Text>
              </View>
            </View>
          </View>
        </View>
        <View className="flex flex-row w-full border-b border-teal-300 justify-between items-start">
          <View className="py-2 w-[60%] ">
            <Text className="text-sm color-slate-400">Beskrivelse:</Text>
            <Text className="text-base">{chore.chore_description}</Text>
          </View>
          <View className="flex flex-col justify-end items-end py-2 w-[40%]">
            <Text className="text-sm color-slate-400">Innen:</Text>
            <Text className="text-lg">
              {new Date(chore.time_limit.seconds * 1000).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </Text>
          </View>
        </View>
        <View className="w-full flex flex-row items-center space-x-2">
          <Text className="text-sm color-slate-400">Fra:</Text>
          <Text className="text-base">{parentSide ? child?.name : parent?.name}</Text>
        </View>
        <View className="flex flex-row justify-between w-full pt-2">
          <Button onClick={onClick} text="Lukk" classname="bg-slate-50 px-3 py-1"></Button>
        </View>
      </View>
    )
  }

  return (chore.chore_status === "available" && !parentSide) ||
    (chore.chore_status === "pending" && parentSide) ||
    (chore.chore_status === "complete" && !chore.paid && parentSide)
    ? avilableChore()
    : unavailableChore()
}

export default ChoresDetailedView
