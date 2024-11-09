import { SavingGoal } from '@/backend/types/savingGoal';
import React, { useState } from 'react';
import { View, Text, Pressable, TextInput, TouchableOpacity, GestureResponderEvent, Alert } from 'react-native';
import { Bike } from 'lucide-react-native';
import { updateSavingGoal } from '@/backend/src/SavingsDAO';

interface AddMoneyContentProps {
  savingGoal: SavingGoal | undefined;
  onClose: () => void;
  refetch: () => void;
}

const AddMoneyContent: React.FC<AddMoneyContentProps> = ({ onClose, savingGoal, refetch }) => {
  const [amountToAdd, setAmountToAdd] = useState<string>('');

  if (!savingGoal) {
    return <Text>Missing saving goal</Text>;
  }

  // Function to handle the submission of the amount to the backend
  const handleAddAmount = async (event: GestureResponderEvent) => {
    event.preventDefault();

    const amount = parseInt(amountToAdd, 10); 

    // Input validation
    if (isNaN(amount) || amount <= 0) {
      Alert.alert("Invalid Input", "Please enter a valid amount to add.");
      return;
    }

    try {
      const success = await updateSavingGoal(savingGoal, amount);
      
      if (success) {
        setAmountToAdd('');
        refetch();
        onClose();
      }
      else{
        Alert.alert("Ikke høy nok saldo", "Kunne ikke legge til sparemål på grunn av manglende saldo.");
      }
    } catch (error) {
      console.error("Failed to add amount:", error);
      Alert.alert("Error", "Could not add amount. Please try again.");
    }
  };

  return (
    <View className="flex-col items-center">
      <View className="w-full flex-row justify-end pr-6">
        <Pressable onPress={onClose}>
          <Text className="text-[#52D1DC]">Avbryt</Text>
        </Pressable>
      </View>
      
      <View>
        <Text className="text-3xl text-center">Legg til i sparemål:</Text>
        <Text className="text-3xl text-center">{savingGoal.title}</Text>
      </View>
      
      <View style={{ width: 50, height: 50 }} className="mt-2 border-2 rounded-full items-center justify-center">
        <Bike color="black" style={{ width: 40, height: 40 }}/>
      </View>

      <View className="mt-3">
        <Text className="text-l text-center">Du mangler: {savingGoal.goal_amount - savingGoal.current_amount},- nok</Text>
        <Text className="text-l text-center mt-1">Du har: {savingGoal.current_amount},- nok</Text>
      </View>

      {/* Input for the amount to add */}
      <View style={{ width: 236, height: 48 }} className="mt-3 items-center justify-center border border-[#8D8E8E] rounded-md">
        <TextInput
          keyboardType="numeric"
          placeholder="Hvor mye vil du legge til?"
          placeholderTextColor="#8D8E8E"
          value={amountToAdd}
          onChangeText={setAmountToAdd}
        />
      </View>

      {/* Submit button */}
      <View style={{ width: 131, height: 45 }} className="mt-2 items-center justify-center">
        <TouchableOpacity className="bg-[#FFC5D3] w-full h-full rounded-full" onPress={handleAddAmount}>
          <Text className="text-center justify-center mt-3 text-sm">Legg til Penger</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddMoneyContent;
