import React from "react"
import { View, Text, StyleSheet, Pressable, Image } from "react-native"
import { Chore } from "@/app/types/chores"

interface PropsDetailedView {
    chore: Chore;
    // onClick: () => void;
}

const ChoresDetailedView: React.FC<PropsDetailedView> = ({ chore}) => {
  return (
    // <Pressable onPress={onClick}>
      <View>
        <Text>{chore.name}</Text>
      </View>
    // </Pressable>
  )
}

export default ChoresDetailedView;
