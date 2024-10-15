import React from "react";
import { View, Text, Pressable } from "react-native";
import { Chore } from "@/app/types/chores";
import { ChoreNavbarState } from "@/app/types/chores";
import Button from "../ui/button";

interface Props {
  onClick: (changeState: ChoreNavbarState) => void;
  state: ChoreNavbarState;
}

const ChoreNavbar: React.FC<Props> = ({ onClick, state }) => {
  const selectedColor = "#52D1DC";  // Color for the selected option
  const defaultColor = "#000";      // Default color for non-selected options

  return (
    <View className="flex flex-row items-center justify-between w-full">
      <Pressable className="w-[35%]" onPress={() => onClick(ChoreNavbarState.GJENNOMFØRT)}>
        <Text className="text-lg flex-wrap"
         style={{ color: state === ChoreNavbarState.GJENNOMFØRT ? selectedColor : defaultColor }}
         >Gjennomførte gjøremål</Text>
      </Pressable>
      <Pressable className="w-[30%] " onPress={() => onClick(ChoreNavbarState.FORESPURT)}>
        <Text className="text-lg flex-shrink-0"
         style={{ color: state === ChoreNavbarState.FORESPURT ? selectedColor : defaultColor }}
       >Forespurte gjøremål</Text>
      </Pressable>
      <Pressable className="w-[30%]" onPress={() => onClick(ChoreNavbarState.ELDRE)}>
        <Text className="text-lg flex-wrap"
         style={{ color: state === ChoreNavbarState.ELDRE ? selectedColor : defaultColor }}
       >Eldre gjøremål</Text>
      </Pressable>
    </View>
  );
};

export default ChoreNavbar;
