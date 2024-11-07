import React, { useState } from 'react';
import { View, Text, Pressable, TextInput, TouchableOpacity } from 'react-native';
import { Bike, MonitorSmartphone, Shirt, Ticket } from 'lucide-react-native';

interface NewGoalContentProps {
  onClose: () => void;
  //userId: string;
}

const NewGoalContent: React.FC<NewGoalContentProps> = ({ onClose }) => {
  
  // State variables to store the user inputs
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [goalName, setGoalName] = useState('');
  const [goalAmount, setGoalAmount] = useState('');

  const refreshInput = () => {
    setGoalName('');
    setGoalAmount('');
    setSelectedIcon(null);
  }

  // Function to handle icon selection
  const handleChangeIcon = (iconName: string) => {
    setSelectedIcon(iconName);
  };

  // Function to handle form submission
  const handleCreatePress = () => {
    // Create a new goal object with user inputs
    const newGoal = {
      name: goalName,
      amount: goalAmount,
      icon: selectedIcon,
    };
    // For now, log the new goal to the console
    console.log('New goal created:', newGoal);
    // Close the BottomSheet
    refreshInput();
    onClose();
  };

  return (
    <View className="flex-col items-center">
      {/* Close Button */}
      <View className="w-full flex-row justify-end pr-6">
        <Pressable onPress={onClose}>
          <Text className="text-[#52D1DC]">Avbryt</Text>
        </Pressable>
      </View>

      {/* Title */}
      <View>
        <Text className="text-3xl">Nytt sparemål</Text>
      </View>

      {/* Goal Name Input */}
      <View
        style={{ width: 237, height: 38 }}
        className="items-center justify-center border border-[#8D8E8E] rounded-md my-5"
      >
        <TextInput
          value={goalName}
          onChangeText={setGoalName}
          placeholder="Hva vil du spare til?"
          placeholderTextColor="#8D8E8E"
        />
      </View>

      {/* Goal Amount Input */}
      <View
        style={{ width: 237, height: 38 }}
        className="items-center justify-center border border-[#8D8E8E] rounded-md"
      >
        <TextInput
          value={goalAmount}
          onChangeText={setGoalAmount}
          keyboardType="numeric"
          placeholder="Hvor mye vil du spare?"
          placeholderTextColor="#8D8E8E"
        />
      </View>

      {/* Icon Selection */}
      <View
        style={{ width: 393, height: 110 }}
        className="justify-center flex-row items-center"
      >
        {/* Shirt Icon */}
        <View className="flex-col items-center justify-center">
          <TouchableOpacity
            className={`w-12 h-12 mx-4 my-2 rounded-full justify-center bg-white border-2 items-center ${
              selectedIcon === 'Shirt' ? 'border-blue-500' : 'border-gray-300'
            }`}
            onPress={() => handleChangeIcon('Shirt')}
          >
            <Shirt color="black" className="h-7 w-7" />
          </TouchableOpacity>
          <Text className="text-xs text-center">Klær</Text>
        </View>

        {/* Ticket Icon */}
        <View className="flex-col items-center justify-center">
          <TouchableOpacity
            className={`w-12 h-12 mx-4 my-2 rounded-full justify-center bg-white border-2 items-center ${
              selectedIcon === 'Ticket' ? 'border-blue-500' : 'border-gray-300'
            }`}
            onPress={() => handleChangeIcon('Ticket')}
          >
            <Ticket color="black" className="h-7 w-7" />
          </TouchableOpacity>
          <Text className="text-xs text-center">Arrangement</Text>
        </View>

        {/* MonitorSmartphone Icon */}
        <View className="flex-col items-center justify-center">
          <TouchableOpacity
            className={`w-12 h-12 mx-4 my-2 rounded-full justify-center bg-white border-2 items-center ${
              selectedIcon === 'MonitorSmartphone' ? 'border-blue-500' : 'border-gray-300'
            }`}
            onPress={() => handleChangeIcon('MonitorSmartphone')}
          >
            <MonitorSmartphone color="black" className="h-7 w-7" />
          </TouchableOpacity>
          <Text className="text-xs text-center">Elektronikk</Text>
        </View>

        {/* Bike Icon */}
        <View className="flex-col items-center justify-center">
          <TouchableOpacity
            className={`w-12 h-12 mx-4 my-2 rounded-full justify-center bg-white border-2 items-center ${
              selectedIcon === 'Bike' ? 'border-blue-500' : 'border-gray-300'
            }`}
            onPress={() => handleChangeIcon('Bike')}
          >
            <Bike color="black" className="h-7 w-7" />
          </TouchableOpacity>
          <Text className="text-xs text-center">Sport</Text>
        </View>
      </View>

      <View
        style={{ width: 131, height: 45 }}
        className="items-center justify-center"
      >
        <TouchableOpacity
          className="bg-[#FFC5D3] w-full h-full rounded-full"
          onPress={handleCreatePress}
        >
          <Text className="text-center justify-center mt-3 text-sm">
            Opprett Sparemål
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NewGoalContent;

