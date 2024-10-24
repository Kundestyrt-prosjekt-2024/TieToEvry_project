import AppHeader from "@/components/AppHeader"
import SavingGoalCard from "@/components/SavingGoalCard"
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet"
import React, { useCallback, useRef, useState } from "react"
import { Text, View, Image, ScrollView, TouchableOpacity, Pressable, TextInput, FlatList, TouchableWithoutFeedback, Keyboard } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import {Shirt, MonitorSmartphone, Ticket, Bike }  from 'lucide-react-native';


const Savings = () => {

  const bottomSheetRef = useRef<BottomSheet>(null)
  const bottomSheetRefAddMoney = useRef<BottomSheet>(null);

  const handleAddMoney = useCallback(() => {
    bottomSheetRefAddMoney.current?.expand();
    dismissKeyboard();
  }, []);

  const handleNewGoalPress = useCallback(() => {
    bottomSheetRef.current?.expand()
    dismissKeyboard();
  }, [])

  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />,
    []
  )

  const handleClosePress = useCallback(() => {
    bottomSheetRef.current?.close()
    bottomSheetRefAddMoney.current?.close()
    dismissKeyboard();
  }, [])

  function dismissKeyboard() {
    Keyboard.dismiss();
  }

  const handleChangeIcon = () => {
    dismissKeyboard();
  }


  return (
    <SafeAreaView className=" bg-white">
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
            <SavingGoalCard onAddMoney={handleAddMoney}></SavingGoalCard>
            <SavingGoalCard onAddMoney={handleAddMoney}></SavingGoalCard>
          </View>
        </ScrollView>

        <View className="absolute flex-col items-center bottom-20 right-5">
          <TouchableOpacity className="bg-[#FFC5D3] w-10 h-10 rounded-full" onPress={handleNewGoalPress}>
                <Text className="w-10 h-10 text-center text-3xl">+</Text>
          </TouchableOpacity>
          <Text className="text-xs text-center">Nytt mål</Text>
        </View>

        </View>

        {/* Overlay should expand with keyboard */}
        <BottomSheet ref={bottomSheetRef} snapPoints={["75%"]} enablePanDownToClose={true} backdropComponent={renderBackdrop} index={-1}>
        <TouchableWithoutFeedback onPress={ () => { dismissKeyboard() } }>
          <View className="flex-col items-center" >

            <View className="w-full flex-row justify-end pr-6">
              <Pressable onPress={handleClosePress}>
                <Text className="text-[#52D1DC]" >Avbryt</Text>
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
          </TouchableWithoutFeedback>
        </BottomSheet>

        <BottomSheet ref={bottomSheetRefAddMoney} snapPoints={["75%"]} enablePanDownToClose={true} backdropComponent={renderBackdrop} index={-1}>
        <TouchableWithoutFeedback onPress={ () => { dismissKeyboard() } }>

          <View className="flex-col items-center">

            <View className="w-full flex-row justify-end pr-6">
              <Pressable onPress={handleClosePress}>
                <Text className="text-[#52D1DC]" >Avbryt</Text>
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
          </TouchableWithoutFeedback>
        </BottomSheet>
        
    </SafeAreaView>
    
  )
} 

export default Savings
