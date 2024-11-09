import React, { useState } from 'react';
import { View, Text, Pressable, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Bike, MonitorSmartphone, Shirt, Ticket } from 'lucide-react-native';
import { addSavingGoal } from '@/backend/src/SavingsDAO';
import { SavingGoal } from '@/backend/types/savingGoal';

interface NewGoalContentProps {
  onClose: () => void;
  userId: string;
  refetch: () => void;
}

const iconOptions = [
  { name: 'Shirt', label: 'Klær', IconComponent: Shirt },
  { name: 'Ticket', label: 'Arrangement', IconComponent: Ticket },
  { name: 'MonitorSmartphone', label: 'Elektronikk', IconComponent: MonitorSmartphone },
  { name: 'Bike', label: 'Sport', IconComponent: Bike },
];

const NewGoalContent: React.FC<NewGoalContentProps> = ({ onClose, userId, refetch }) => {
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [goalName, setGoalName] = useState("");
  const [goalAmount, setGoalAmount] = useState(0);

  const refreshInput = () => {
    setGoalName("");
    setGoalAmount(0);
    setSelectedIcon(null);
  };

  const handleCreatePress = async () => {
    if (!goalName || !goalAmount || !selectedIcon) {
      Alert.alert('Missing Information', 'Please fill out all fields and select an icon.');
      return;
    }

    const newGoal: SavingGoal = {
      child_id: userId,
      current_amount: 0,
      goal_amount: goalAmount,
      icon_id: selectedIcon,
      title: goalName,
    };

    const addedNewSavingGoal = await addSavingGoal(newGoal);
    // Check for new goal creation
    if (addedNewSavingGoal) {
      console.log('New goal created:', newGoal);
      refetch();
      refreshInput();
      onClose();
    } else {
      Alert.alert('Error', 'Failed to create new goal.');
      refreshInput();
      onClose();
    }
  };

  return (
    <View className="flex-col items-center p-4">
      {/* Close Button */}
      <View className="w-full flex-row justify-end pr-6">
        <Pressable onPress={onClose}>
          <Text className="text-[#52D1DC]">Avbryt</Text>
        </Pressable>
      </View>

      {/* Title */}
      <Text className="text-3xl mb-4">Nytt sparemål</Text>

      {/* Goal Name Input */}
      <View className="w-60 h-10 my-2 border border-[#8D8E8E] rounded-md">
        <TextInput
          value={goalName}
          onChangeText={setGoalName}
          placeholder="Hva vil du spare til?"
          placeholderTextColor="#8D8E8E"
          className="p-2"
        />
      </View>

      {/* Goal Amount Input */}
      <View className="w-60 h-10 my-2 border border-[#8D8E8E] rounded-md">
        <TextInput
          value={goalAmount === 0 ? '' : goalAmount.toString()}
          onChangeText={(text) => setGoalAmount(Number(text))}
          keyboardType="numeric"
          placeholder="Hvor mye vil du spare?"
          placeholderTextColor="#8D8E8E"
          className="p-2"
        />
      </View>

      {/* Icon Selection */}
      <View className="flex-row justify-center my-4">
        {iconOptions.map(({ name, label, IconComponent }) => (
          <View key={name} className="flex-col items-center mx-2">
            <TouchableOpacity
              className={`w-12 h-12 rounded-full border-2 items-center justify-center ${
                selectedIcon === name ? 'border-blue-500' : 'border-gray-300'
              }`}
              onPress={() => setSelectedIcon(name)}
            >
              <IconComponent color="black" className="h-7 w-7" />
            </TouchableOpacity>
            <Text className="text-xs text-center">{label}</Text>
          </View>
        ))}
      </View>

      {/* Create Goal Button */}
      <View className="w-32 h-12 my-4">
        <TouchableOpacity
          onPress={handleCreatePress}
          className="bg-[#FFC5D3] w-full h-full rounded-full justify-center"
        >
          <Text className="text-center text-sm">Opprett Sparemål</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NewGoalContent;
