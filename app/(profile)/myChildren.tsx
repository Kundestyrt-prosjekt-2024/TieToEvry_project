import { View, Text, Image } from "react-native"
import React from "react"
import { ScrollView } from "react-native-gesture-handler"
import { useGetChildren, useGetUser, useGetUserID } from "@/hooks/useGetFirestoreData"
import { User } from "@/backend/types/user"
import { FirestoreTimestamp } from "@/backend/types/firebase"

const MyChildren = () => {
  const parentID = useGetUserID()
  const parent = useGetUser(parentID.data || "")
  const children = useGetChildren(parent.data?.children || [])

  function renderChild(child: User) {
    return (
      <View className="flex-col gap-6 items-center">
        <Image className="w-36 h-36" source={{ uri: child.profilePicture }} />
        <View className="flex-col items-center">
          <Text className="font-bold">{child.name}</Text>
          <Text>{calculateAge(child.birthdate)} år</Text>
        </View>
      </View>
    )
  }

  function calculateAge(birthdayTimestamp: FirestoreTimestamp): number {
    const birthDate = new Date(birthdayTimestamp.seconds * 1000)
    const ageDifMs = Date.now() - birthDate.getTime()
    return new Date(ageDifMs).getUTCFullYear() - 1970
  }

  return (
    <View className="h-full bg-white">
      <ScrollView>
        <View className="flex-row justify-center items-center pt-12 w-full gap-3">
          {children.map((parent, index) => (
            <View key={index}>{renderChild(parent.data as User)}</View>
          ))}
        </View>
      </ScrollView>
      <Text>HELOW</Text>
    </View>
  )
}

export default MyChildren
