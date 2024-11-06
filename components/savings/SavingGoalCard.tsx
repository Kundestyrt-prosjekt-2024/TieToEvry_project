import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import {Shirt, MonitorSmartphone, Ticket, Bike }  from 'lucide-react-native';
import { SavingGoal } from '@/backend/types/savingGoal';

interface SavingGoalCardProps {
  //goal: SavingGoal;
  onAddMoney: () => void;
}

const SavingGoalCard: React.FC<SavingGoalCardProps> = ({ onAddMoney }) => {
  {/**TODO: This should be dynamic */}
  const progress = 0.5; 

  return (
    <View className="flex-col items-center pb-1">
      <View style={{ width: 363, height: 170 }} className="flex-col justify-around p-4 rounded-3xl bg-[#CBF1F4]">
        
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            {/** TODO: Pass in saving goal icon */}
            <View style={{ width: 50, height: 50 }} className='bg-white rounded-full border-2 justify-center items-center'>
              <Bike color="black" style={{ width: 40, height: 40 }}/>
            </View>
            {/** TODO: Pass in saving goal name */}
            <Text className="text-xl ml-2">Goal Name</Text>
          </View>
          <View className="items-center  ">
            <TouchableOpacity className="bg-[#6DE272] items-center border-2 border-black justify-center rounded-full" style={{ width: 35, height: 35 }} onPress={onAddMoney}>
              <Text className="text-black text-2xl">+</Text>
            </TouchableOpacity>
            <Text className="text-xs text-center">Spar</Text>
          </View>
        </View>

        <View className="flex-row my-0">
          {/**TODO: Should be dynamic with saving goal data */}
          <Text className="flex-1 text-sm text-left">0 kr</Text>
          <Text className="flex-1 text-sm text-center">Goal/2</Text>
          <Text className="flex-1 text-sm text-right">Goal</Text>
        </View>

        <View className="my-0">
          {/**TODO: Fill should be dynamic with saving goal data */}
          <View className="w-full h-7 bg-[#1A801E] border-2 border-black rounded-full">
            <View className="h-full bg-[#72E977] border-1 border-black rounded-full" style={{ width: `${progress * 100}%` }}/>
          </View>
        </View>

      </View>
    </View>
  );
};

export default SavingGoalCard;


