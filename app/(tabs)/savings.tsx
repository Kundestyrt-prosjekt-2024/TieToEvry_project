import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Keyboard, Image, TouchableWithoutFeedback } from 'react-native';
import ReusableBottomSheet from '@/components/ReusableBottomSheet';
import NewGoalContent from '@/components/savings/NewGoalContent';
import AddMoneyContent from '@/components/savings/AddMoneyContent';
import AppHeader from '@/components/AppHeader';
import SavingGoalCard from '@/components/savings/SavingGoalCard';

const Savings = () => {

  //States for showing/hiding bottom sheets
  const [isNewGoalVisible, setIsNewGoalVisible] = useState(false);
  const [isAddMoneyVisible, setIsAddMoneyVisible] = useState(false);

  //Functions to handle showing/hiding bottom sheets
  const handleAddMoney = () => {
    setIsAddMoneyVisible(true);
    dismissKeyboard();
  };

  const handleCloseAddMoney = () => {
    setIsAddMoneyVisible(false);
    dismissKeyboard();
  };

  const handleNewGoalPress = () => {
    setIsNewGoalVisible(true);
    dismissKeyboard();
  };

  const handleCloseNewGoal = () => {
    setIsNewGoalVisible(false);
    dismissKeyboard();
  };

  //Hiding keyboard
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView className="bg-white">
      <AppHeader />
      <View className="h-full">
      <ScrollView>

        {/**Top view introducing user to the page */}
        <View className="flex-row pt-5 px-10">
          <View>
            <Image className="w-85 h-154" source={require("@/assets/images/sphare.png")} />
          </View>
          <View className="flex-col justify-end">
            <View className="relative justify-center px-8 py-4 items-center">
              <Image className="" source={require("@/assets/images/figma_bubble.png")}/>
              <Text className="absolute pl-2 pt-1 text-sm text-black text-center">Lag et sparemål for å komme i gang!</Text>
            </View>
            <View className="justify-end px-8">
              <Text className="text-2xl">Dine sparemål</Text>
            </View>
          </View>
        </View>
        
        {/** Current savings goals displayed in cards.
         * TODO: Saving goal data should be mapped across cards */}
          <View className="flex-col items-center py-5 pb-20">
            <SavingGoalCard onAddMoney={handleAddMoney} />
          </View>

        </ScrollView>

        {/**Static button to create new saving goal */}
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

      {/**Bottom sheet for creating new goal */}
      <TouchableWithoutFeedback onPress={ () => { dismissKeyboard() } }>
      <ReusableBottomSheet isVisible={isNewGoalVisible} onClose={handleCloseNewGoal}>
        <NewGoalContent onClose={handleCloseNewGoal} />
      </ReusableBottomSheet>
      </TouchableWithoutFeedback>

      {/**Bottom sheets for adding money to a goal */}
      <TouchableWithoutFeedback onPress={ () => { dismissKeyboard() } }>
      <ReusableBottomSheet isVisible={isAddMoneyVisible} onClose={handleCloseAddMoney}>
        <AddMoneyContent onClose={handleCloseAddMoney} />
      </ReusableBottomSheet>
      </TouchableWithoutFeedback>

    </SafeAreaView>
  );
};

export default Savings;
