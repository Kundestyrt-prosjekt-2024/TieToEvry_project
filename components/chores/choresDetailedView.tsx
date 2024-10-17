import React from "react";
import { View, Text, Pressable, Image } from "react-native";
import { Chore } from "@/app/types/chores";
import Button from "../ui/button";

interface PropsDetailedView {
  chore: Chore;
  onClick: () => void;
}

const ChoresDetailedView: React.FC<PropsDetailedView> = ({ chore, onClick }) => {
  return (
    <View className="bg-[#CCF2F5] p-4 rounded-lg space-y-2 items-center justify-center w-full">
      <View className="w-full flex flex-row justify-between border-b border-teal-300 py-2">
        <View className="">
          <Text className="text-sm color-slate-400">Oppgave:</Text>
          <Text className="text-lg">{chore.name}</Text>
        </View>
        <View className="flex flex-col items-center">
          <Text className="w-full text-sm color-slate-400">Belønning:</Text>
          <View className="flex flex-row space-x-2 py-1">
            <Text className="text-lg font-semibold text-green-600">{chore.rewardNOK},-</Text>
            <View className="flex flex-row">
              <Image
                className="w-7 h-7 rounded-md"
                source={require("@/assets/images/coin.png")}
                resizeMode="contain"
              />
              <Text className="text-lg">x{chore.rewardCoins}</Text>
            </View>
          </View>
        </View>
      </View>
      <View className="flex flex-row w-full border-b border-teal-300 justify-between items-start">
        <View className="py-2 w-[60%] ">
          <Text className="text-sm color-slate-400">Beskrivelse:</Text>
          <Text className="text-base">{chore.description}</Text>
        </View>
        <View className="flex flex-col justify-end items-end py-2 w-[40%]">
          <Text className="text-sm color-slate-400">Frist:</Text>
          <Text className="text-lg">{new Date(chore.dueDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}</Text>
        </View>
      </View>
      <View className="w-full flex flex-row items-center space-x-2">
        <Text className="text-sm color-slate-400">Fra:</Text>
        <Text className="text-base">{chore.assignee}</Text>
      </View>
      <View className="flex flex-row justify-between w-full pt-2">
        <Button onClick={onClick} text="Lukk" classname="bg-slate-50 px-3 py-1"></Button>
        <View className="flex justify-center flex-row space-x-2">
          <View>
            <Button onClick={() => console.log("Godkjenn")} text="Godkjenn" classname=" bg-green-200 px-3 py-1"></Button>
          </View>
          <View>
            <Button onClick={() => console.log("Avslå")} text="Avslå" classname="px-3 py-1"></Button>
          </View>
        </View>
      </View>
      {/* <Pressable onPress={onClick} className="bg-white p-2 rounded-lg items-center">
        <Text className="text-black">Lukk</Text>
      </Pressable> */}
    </View>
  );
};

export default ChoresDetailedView;
