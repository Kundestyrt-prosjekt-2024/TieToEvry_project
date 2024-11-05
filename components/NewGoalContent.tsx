import { Bike, MonitorSmartphone, Shirt, Ticket } from 'lucide-react-native';
import React from 'react';
import { View, Text, Pressable, TextInput, TouchableOpacity, GestureResponderEvent } from 'react-native';

interface NewGoalContentProps {
    onClose: () => void;
  }
  
  const NewGoalContent: React.FC<NewGoalContentProps> = ({ onClose }) => (
  <View className="flex-col items-center">
    <View className="w-full flex-row justify-end pr-6">
      <Pressable onPress={onClose}>
        <Text className="text-[#52D1DC]">Avbryt</Text>
      </Pressable>
    </View>
    <View>
      <Text className="text-3xl">Nytt sparemål</Text>
    </View>
    <View style={{ width: 237, height: 38 }} className=" items-center justify-center border border-color-[#8D8E8E] rounded-md my-5">
              <TextInput  placeholder="Hva vil du spare til?" placeholderTextColor="#8D8E8E"></TextInput>
            </View>

            <View style={{ width: 237, height: 38 }} className=" items-center justify-center border border-color-[#8D8E8E] rounded-md">
              <TextInput keyboardType='numeric' placeholder="Hvor mye vil du spare?" placeholderTextColor="#8D8E8E"></TextInput>
            </View>

            <View style={{ width: 393, height: 110 }} className=" justify-center flex-row items-center">
              <View className="flex-col items-center justify-center">
              <TouchableOpacity className="w-12 h-12 mx-4 my-2 rounded-full justify-center bg-white border-2 items-center" onPress={handleChangeIcon}>
                <Shirt color="black" className="h-7 w-7"></Shirt>
              </TouchableOpacity>
              <Text className="text-xs text-center">Klær</Text>
              </View>

              <View className="flex-col items-center justify-center">
              <TouchableOpacity className="w-12 h-12 mx-4 my-2 rounded-full justify-center bg-white  border-2 items-center" onPress={handleChangeIcon}>
                <Ticket color="black" className="h-7 w-7"></Ticket>
              </TouchableOpacity>
              <Text className="text-xs text-center">Arrangement</Text>
              </View>

              <View className="flex-col items-center justify-center">
              <TouchableOpacity className="w-12 h-12 mx-4 my-2 rounded-full justify-center bg-white  border-2 items-center" onPress={handleChangeIcon}>
                <MonitorSmartphone color="black" className="h-7 w-7"></MonitorSmartphone>
              </TouchableOpacity>
              <Text className="text-xs text-center">Elektronikk</Text>
              </View>

              <View className="flex-col items-center justify-center">
              <TouchableOpacity className="w-12 h-12 mx-4 my-2 rounded-full justify-center bg-white border-2 items-center" onPress={handleChangeIcon}>
                <Bike color="black" className="h-7 w-7"></Bike>
              </TouchableOpacity>
              <Text className="text-xs text-center">Sport</Text>
              </View>

            </View>

            <View style={{ width: 131, height: 45 }} className=" items-center justify-center ">
              <TouchableOpacity  className="bg-[#FFC5D3] w-full h-full rounded-full" onPress={handleClosePress}>
                <Text className="text-center justify-center mt-3 text-sm">Opprett Sparemål</Text>
              </TouchableOpacity>
            </View>
  </View>
);

export default NewGoalContent;

function handleChangeIcon(event: GestureResponderEvent): void {
    throw new Error('Function not implemented.');
}
function handleClosePress(event: GestureResponderEvent): void {
    throw new Error('Function not implemented.');
}

