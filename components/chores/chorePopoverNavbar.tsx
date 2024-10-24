import React from "react";
import { View, Text, Pressable } from "react-native";
import { ChoreNavbarState } from "@/app/types/chores";

interface Props {
  onClick: (changeState: ChoreNavbarState) => void;
  state: ChoreNavbarState;
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
          className={`px-2 py-1 rounded-xl ${state === ChoreNavbarState.GJENNOMFØRT ? "bg-[#52D1DC]" : "bg-[#FFFFFF]"}`}
          onPress={() => onClick(ChoreNavbarState.GJENNOMFØRT)}
        >
          <Text className={`text-base ${state === ChoreNavbarState.GJENNOMFØRT ? "text-white" : "text-black"}`}>
            Gjennomført
          </Text>
        </Pressable>
        <Pressable
          className={`px-2 py-1 rounded-xl ${state === ChoreNavbarState.FORESPURT ? "bg-[#52D1DC]" : "bg-[#FFFFFF]"}`}
          onPress={() => onClick(ChoreNavbarState.FORESPURT)}>
          <Text className={`text-base ${state === ChoreNavbarState.FORESPURT ? "text-white" : "text-black"}`}>
            Forespurt
          </Text>
        </Pressable>
        <Pressable
          className={`px-2 py-1 rounded-xl ${state === ChoreNavbarState.ELDRE ? "bg-[#52D1DC]" : "bg-[#FFFFFF]"}`}
          onPress={() => onClick(ChoreNavbarState.ELDRE)}>
          <Text className={`text-base ${state === ChoreNavbarState.ELDRE ? "text-white" : "text-black"}`}>
            Eldre
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default ChoreNavbar;
