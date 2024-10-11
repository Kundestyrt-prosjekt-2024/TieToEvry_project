import React from "react";
import { View, Text, Pressable } from "react-native";
import { Chore } from "@/app/types/chores";
import Button from "../ui/button";

interface PropsDetailedView {
  chore: Chore;
  onClick: () => void;
}

const ChoresDetailedView: React.FC<PropsDetailedView> = ({ chore, onClick }) => {
  return (
    <View className="bg-teal-300 p-4 rounded-lg gap-2 items-center justify-center">
      <Text className="text-xl">{chore.name}</Text>
      <Text>{chore.description}</Text>
      <View className="flex flex-row justify-between">
        <Button onClick={onClick} text="Lukk" classname="bg-slate-50 px-3 py-1"></Button>
        <View className="flex flex-row">
          <Button onClick={() => console.log("Godkjenn")} text="Godkjenn" classname=" bg-green-200 px-3 py-1"></Button>
          <Button onClick={() => console.log("Avslå")} text="Avslå" classname="px-3 py-1"></Button>
        </View>
      </View>
      {/* <Pressable onPress={onClick} className="bg-white p-2 rounded-lg items-center">
        <Text className="text-black">Lukk</Text>
      </Pressable> */}
    </View>
  );
};

export default ChoresDetailedView;
