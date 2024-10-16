import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

const Card = ({onAddMoney}: { onAddMoney: () => void }) => {
  const progress = 0.5; 

  return (
    <View className="flex-col items-center pb-1">
      <View style={{ width: 363, height: 170 }} className="flex-col justify-around p-4 rounded-3xl bg-[#CBF1F4]">
        
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Image style={{ width: 60, height: 60 }} source={require('@/assets/images/bike.png')}/>
            <Text className="text-xl ml-2">Sykkel</Text>
          </View>
          <View className="items-center  ">
            <TouchableOpacity className="bg-[#6DE272] items-center border-2 border-black justify-center rounded-full" style={{ width: 35, height: 35 }} onPress={onAddMoney}>
              <Text className="text-black text-2xl">+</Text>
            </TouchableOpacity>
            <Text className="text-xs text-center">Spar</Text>
          </View>
        </View>

        <View className="flex-row my-0">
          <Text className="flex-1 text-sm text-left">0 kr</Text>
          <Text className="flex-1 text-sm text-center">2500 kr</Text>
          <Text className="flex-1 text-sm text-right">5000 kr</Text>
        </View>

        <View className="my-0">
          <View className="w-full h-7 bg-[#1A801E] border-2 border-black rounded-full">
            <View className="h-full bg-[#72E977] border-1 border-black rounded-full" style={{ width: `${progress * 100}%` }}/>
          </View>
        </View>

      </View>
    </View>
  );
};

export default Card;


