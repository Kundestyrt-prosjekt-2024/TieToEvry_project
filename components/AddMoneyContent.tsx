import { Bike } from 'lucide-react-native';
import React from 'react';
import { View, Text, Pressable, TextInput, TouchableOpacity, GestureResponderEvent } from 'react-native';

interface AddMoneyContentProps {
    onClose: () => void;
  }
  
  const AddMoneyContent: React.FC<AddMoneyContentProps> = ({ onClose }) => (
  <View className="flex-col items-center">
    <View className="w-full flex-row justify-end pr-6">
      <Pressable onPress={onClose}>
        <Text className="text-[#52D1DC]">Avbryt</Text>
      </Pressable>
    </View>
    <View>
      <Text className="text-3xl text-center">Legg til i sparemål:</Text>
      <Text className="text-3xl text-center">Sykkel</Text>
    </View>
    <View style={{ width: 50, height: 50 }} className="mt-2 border-2 rounded-full items-center justify-center">
            <Bike color='black' style={{ width: 40, height: 40 }}/>
            </View>

            <View className="mt-3">
              <Text className="text-l text-center">Du mangler: 3000 kr</Text>
              <Text className="text-l text-center mt-1">Du har: 1 425 503 kr</Text>
            </View>

            <View style={{ width: 236, height: 48 }} className="mt-3 items-center justify-center border border-color-[#8D8E8E] rounded-md">
              <TextInput keyboardType='numeric' placeholder="Hvor mye vil du legge til?" placeholderTextColor="#8D8E8E"></TextInput>
            </View>

            <View style={{ width: 131, height: 45 }} className="mt-2 items-center justify-center ">
            <TouchableOpacity  className="bg-[#FFC5D3] w-full h-full rounded-full" onPress={handleClosePress}>
                <Text className="text-center justify-center mt-3 text-sm">Legg til Penger</Text>
              </TouchableOpacity>
            </View>
    </View>
  );

export default AddMoneyContent;
function handleClosePress(event: GestureResponderEvent): void {
    throw new Error('Function not implemented.');
}

