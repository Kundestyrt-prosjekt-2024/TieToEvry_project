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

  return (
    <View>
        <Button text="Gjennomført" onClick={() => onClick(ChoreNavbarState.GJENNOMFØRT)}></Button>
        <Button text="Forespurt" onClick={() => onClick(ChoreNavbarState.FORESPURT)}></Button>
        <Button text="Eldre" onClick={() => onClick(ChoreNavbarState.ELDRE)}></Button>
    </View>
  );
};

export default ChoreNavbar;
