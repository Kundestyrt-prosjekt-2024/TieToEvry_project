import React from "react";
import { View, Text, Pressable } from "react-native";
import { Chore } from "@/app/types/chores";

interface Props {
  chore: Chore;
  onClick: () => void;
}

const ChoreList: React.FC<Props> = ({ chore, onClick }) => {
  const urgent = chore.dueDate < new Date(new Date().setDate(new Date().getDate() + 3)) ? "text-red-500" : "text-black";

  return (
    <Pressable onPress={onClick}>
      <View className="w-full flex-row justify-between p-2 px-5 items-center bg-slate-50 rounded-2xl mb-2.5">
        <View className="flex-row items-center space-x-2.5">
          <View className="flex-col justify-center">
            <Text className="text-base">{chore.name}</Text>
            <View className="flex-row items-center space-x-1.5">
              <Text className="text-xs color-slate-400">Frist:</Text>
              <Text className={urgent}>
                {new Date(chore.dueDate).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </Text>
            </View>
          </View>
        </View>
        <View className="">
          <Text className="text-xs color-slate-400">Belønning:</Text>
          <Text className="text-lg text-green-600">{chore.rewardNOK},-</Text>
        </View>
      </View>
    </Pressable>
  );
};

export default ChoreList;
