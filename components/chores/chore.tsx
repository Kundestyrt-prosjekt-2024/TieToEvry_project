import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Chore } from "@/app/types/chores";

interface Props {
  chore: Chore;
  onClick: () => void;
}

const ChoreList: React.FC<Props> = ({ chore, onClick }) => {
    const urgent = chore.dueDate < new Date(new Date().setDate(new Date().getDate() + 3)) ? "red" : "black";
    
  return (
    <Pressable onPress={onClick}>
      <View style={styles.list}>
        <View style={styles.contentContainer}>
          <Text style={styles.icon}>{chore.icon ? chore.icon : "Icon"}</Text>
          <View style={styles.textContainer}>
            <Text style={styles.name}>{chore.name}</Text>
            <View style={styles.dueDateContainer}>
              <Text style={styles.dueDateLabel}>Frist:</Text>
              <Text style={{color:urgent}}>
                {new Date(chore.dueDate).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </Text>
            </View>
          </View>
        </View>
        <Text style={styles.reward}>{chore.reward}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  list: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    paddingHorizontal: 20,
    alignItems: "center", // Align items vertically centered
    backgroundColor: "whitesmoke",
    borderRadius: 20,
    marginBottom: 10,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center", // Align children (icon and text) vertically centered
    gap: 10, // Add spacing between icon and text
  },
  icon: {
    marginRight: 10, // Add spacing to the right of the icon
  },
  textContainer: {
    flexDirection: "column",
    justifyContent: "center",
  },
  dueDateContainer: {
    flexDirection: "row",
    alignItems: "center", 
    gap: 5, 
  },
  dueDateLabel: {
    fontSize: 12,
  },
  dueDate: {
    marginLeft: 5,
  },
  reward: {
    fontSize: 20,
    color: "green", 
  },
  name: {
    fontSize: 20,
  },
});

export default ChoreList;
