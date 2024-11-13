import React from "react";
import { View, Text, Pressable } from "react-native";
import { Chore } from "../../backend/types/chore"


interface Props {
  onClick: (changeState: string) => void;
  state: string;
  closeOverlay: () => void;
}

const ChoreNavbar: React.FC<Props> = ({ onClick, state, closeOverlay }) => {
  const selectedColor = "#52D1DC";  // Color for the selected option
  const defaultColor = "#FFFFFF";   // Default color for unselected options

  return (
    <View className="flex flex-col items-center justify-between w-full">
      <View className="flex flex-row justify-between w-full">
        <Text className="text-left text-xl font-semibold">Gjøremål</Text>
        <Text className="text-left text-xl font-semibold" onPress={() => closeOverlay()}>Lukk</Text>
      </View>
      <View className="flex flex-row items-center justify-between w-full py-2 border-b border-teal-300">
        <Pressable
          className={`px-2 py-1 rounded-xl ${state === "gjennomført" ? "bg-[#52D1DC]" : "bg-[#FFFFFF]"}`}
          onPress={() => onClick("gjennomført")}
        >
          <Text className={`text-base ${state === "gjennomført" ? "text-white" : "text-black"}`}>
            Gjennomført
          </Text>
        </Pressable>
        <Pressable
          className={`px-2 py-1 rounded-xl ${state === "complete" ? "bg-[#52D1DC]" : "bg-[#FFFFFF]"}`}
          onPress={() => onClick("complete")}>
          <Text className={`text-base ${state === "complete" ? "text-white" : "text-black"}`}>
            Forespurt
          </Text>
        </Pressable>
        <Pressable
          className={`px-2 py-1 rounded-xl ${state === "eldre" ? "bg-[#52D1DC]" : "bg-[#FFFFFF]"}`}
          onPress={() => onClick("eldre")}>
          <Text className={`text-base ${state === "eldre" ? "text-white" : "text-black"}`}>
            Eldre
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default ChoreNavbar;
