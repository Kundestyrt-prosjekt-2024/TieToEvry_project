import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Keyboard, Image, TouchableWithoutFeedback } from 'react-native';
import ReusableBottomSheet from '@/components/ReusableBottomSheet';
import NewGoalContent from '@/components/NewGoalContent';
import AddMoneyContent from '@/components/AddMoneyContent';
import AppHeader from '@/components/AppHeader';
import SavingGoalCard from '@/components/SavingGoalCard';

const Savings = () => {
  const [isNewGoalVisible, setIsNewGoalVisible] = useState(false);
  const [isAddMoneyVisible, setIsAddMoneyVisible] = useState(false);

  const handleAddMoney = () => {
    setIsAddMoneyVisible(true);
    dismissKeyboard();
  };

  const handleNewGoalPress = () => {
    setIsNewGoalVisible(true);
    dismissKeyboard();
  };

  const handleCloseNewGoal = () => {
    setIsNewGoalVisible(false);
  };

  const handleCloseAddMoney = () => {
    setIsAddMoneyVisible(false);
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView className="bg-white">
      <AppHeader />
      <View className="h-full">
      <View className="items-center py-2">
          <Text>Spare med Sphare! Her finner du sparetips som kan hjelpe deg å nå målet ditt!</Text>
        </View>

        <View className="flex-row py-2 px-10">
          <View>
            <Image className="w-85 h-154" source={require("@/assets/images/sphare.png")} />
          </View>
          <View className="flex-col justify-end">
            <View className="relative justify-center px-8 py-4 items-center">
              <Image className="" source={require("@/assets/images/figma_bubble.png")}/>
              <Text className="absolute pl-2 pt-1 text-sm text-black text-center">Du er halvveis til målet ditt! Hurra!</Text>
            </View>
            <View className="justify-end px-8">
              <Text className="text-2xl">Dine sparemål</Text>
            </View>
          </View>
        </View>
        <ScrollView>
          <View className="flex-col items-center py-5 pb-20">
            <SavingGoalCard onAddMoney={handleAddMoney} />
            <SavingGoalCard onAddMoney={handleAddMoney} />
          </View>
        </ScrollView>

        <View className="absolute flex-col items-center bottom-20 right-5 mb-7">
          <TouchableOpacity
            className="bg-[#FFC5D3] w-10 h-10 rounded-full"
            onPress={handleNewGoalPress}
          >
            <Text className="w-10 h-10 text-center text-3xl">+</Text>
          </TouchableOpacity>
          <Text className="text-xs text-center">Nytt mål</Text>
        </View>
      </View>

      <TouchableWithoutFeedback onPress={ () => { dismissKeyboard() } }>
      <ReusableBottomSheet isVisible={isNewGoalVisible} onClose={handleCloseNewGoal}>
        <NewGoalContent onClose={handleCloseNewGoal} />
      </ReusableBottomSheet>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback onPress={ () => { dismissKeyboard() } }>
      <ReusableBottomSheet isVisible={isAddMoneyVisible} onClose={handleCloseAddMoney}>
        <AddMoneyContent onClose={handleCloseAddMoney} />
      </ReusableBottomSheet>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default Savings;
