import React from "react";
import { View, Text, Pressable } from "react-native";
import { Chore } from "@/app/types/chores";

interface PropsDetailedView {
  chore: Chore;
  onClick: () => void;
}

const ChoresDetailedView: React.FC<PropsDetailedView> = ({ chore, onClick }) => {
  return (
    <View className="bg-teal-300 p-4 rounded-lg gap-2 items-center justify-center">
      <Text className="text-xl">{chore.name}</Text>
      <Text>{chore.description}</Text>
      <Pressable onPress={onClick} className="bg-white p-3 rounded-lg items-center">
        <Text className="text-black">Close</Text>
      </Pressable>
    </View>
  );
};

export default ChoresDetailedView;
