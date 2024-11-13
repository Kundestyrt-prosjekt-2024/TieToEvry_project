import { View, Text, Image } from "react-native"
import React, { useEffect, useState } from "react"
import { ScrollView } from "react-native-gesture-handler"
import { fetchParents } from "@/backend/src/UserDAO"
import { useGetParents, useGetUser, useGetUserID } from "@/hooks/useGetFirestoreData"
import { FirestoreTimestamp, User } from "@/backend/types/user"

const MyParents = () => {
  const userId = useGetUserID()
  const [parentIDs, setParentIDs] = useState<string[]>([])
  const parents = useGetParents(parentIDs)

  useEffect(() => {
    async function fetchParentIDs() {
      const IDs = await fetchParents(userId.data || "")
      setParentIDs(IDs)
    }
    fetchParentIDs()
  }, [userId.data])

  function renderParent(parent: User) {
    return (
      <View className="flex-col gap-6 items-center">
        <Image className="w-36 h-36" source={{ uri: parent.profilePicture }} />
        <View className="flex-col items-center">
          <Text className="font-bold">{parent.name}</Text>
          <Text>{calculateAge(parent.birthdate)} år</Text>
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
        <View className="flex-row justify-center items-center pt-12 w-full">
          {parents.map((parent, index) => (
            <View key={index}>{renderParent(parent.data as User)}</View>
          ))}
        </View>
      </ScrollView>
    </View>
  )
}

export default MyParents
