import React from "react"
import { View, Text, StyleSheet, Pressable, Image, Modal } from "react-native"
import Awesome5Icon from "react-native-vector-icons/FontAwesome5"
import { useRouter } from "expo-router"
import { Chore } from "@/app/types/chores";

interface Props {
    chore: Chore;
    onClick:() => void;
}

const ChoreList: React.FC<Props> = ({ chore, onClick }) => {


  return (
    <Pressable onPress={onClick}>
        <View style={styles.list}>
            <Text style={styles.name}>{chore.name}</Text>
            <Text style={styles.name}>{chore.reward}</Text >
        </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
    list:{
        height: 50,
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
        paddingHorizontal: 20,
        alignContent: "center",
        backgroundColor: "#52D1DC",
        borderRadius: 20,
        marginBottom: 10,
    },
    name:{
        fontSize: 20,
    }
})

export default ChoreList;
