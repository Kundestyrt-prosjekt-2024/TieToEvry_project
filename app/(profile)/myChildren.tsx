import { View, Text, Image } from "react-native"
import React, { useEffect, useState } from "react"
import { ScrollView } from "react-native-gesture-handler"
import { fetchParents } from "@/backend/src/UserDAO"
import { useGetChildren, useGetParents, useGetUser, useGetUserID } from "@/hooks/useGetFirestoreData"
import { FirestoreTimestamp, User } from "@/backend/types/user"

const MyChildren = () => {

  const parentID = useGetUserID();
  const parent = useGetUser(parentID.data || "");
  const children = useGetChildren(parent.data?.children || []);

  // const userId = useGetUserID()
  // const [parentIDs, setParentIDs] = useState<string[]>([])
  // const parents = useGetParents(parentIDs)

  // useEffect(() => {
  //   async function fetchParentIDs() {
  //     const IDs = await fetchParents(userId.data || "")
  //     setParentIDs(IDs)
  //   }
  //   fetchParentIDs()
  // }, [userId.data])

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
