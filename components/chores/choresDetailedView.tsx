import React from "react"
import { View, Text, StyleSheet, Pressable, Image, Button } from "react-native"
import { Chore } from "@/app/types/chores"

interface PropsDetailedView {
    chore: Chore;
    onClick: () => void;
}

const ChoresDetailedView: React.FC<PropsDetailedView> = ({ chore, onClick}) => {
  return (
      <View style={styles.modal}>
        <Text style={{fontSize:20}}>{chore.name}</Text>
        <Text>{chore.description}</Text>
        <Pressable onPress={onClick} style={styles.closeButton}>
          <Text>Close</Text>
        </Pressable>
      </View>
  )
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: "#52D1DC",
    padding: 16,
    borderRadius: 8,
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "black",
    textAlign: "center",
    padding: 10,
  },
  closeButton: {
    backgroundColor: "white",
    padding: 10,
    color: "black",
    borderRadius: 8,
    justifyContent: "flex-end",
    alignItems: "center",
  },
})

export default ChoresDetailedView;
