import AppHeader from "@/components/AppHeader";
import { View, Text, StyleSheet, Pressable, Image, Modal, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Chore } from "../types/chores";
import React from "react";
import ChoreList from "@/components/chores/chore";
import { ScrollView } from "react-native-gesture-handler";
import ChoresDetailedView from "@/components/chores/choresDetailedView";
import { HandPlatter } from "lucide-react-native";

const Chores = () => {
  const [viewChore, toggleView] = React.useState(false);
  const [choreOfInterest, setChoreOfInterest] = React.useState<Chore | null>(null);

  const chores: Chore[] = [
    {
      icon: <HandPlatter />,
      chore: "chore1",
      name: "Vask opp",
      description: "Vask opp alle tallerkner, glass og bestikk",
      reward: 75,
      dueDate: new Date(new Date().setDate(new Date().getDate() + 7)), 
      completed: false,
      assignee: "Mamma",
    },
    {
      chore: "chore2",
      name: "Rydde rommet",
      description: "Rommet ditt er rotete og må ryddes. Du vet hvordan det skal være",
      reward: 50,
      dueDate: new Date(new Date().setDate(new Date().getDate() + 6)), 
      completed: false,
      assignee: "Mamma",
    },
    {
      chore: "chore3",
      name: "Gå tur med Laila",
      description: "Du har ikke gått tur med Laila denne uken. Det kan du gjøre.",
      reward: 100,
      dueDate: new Date(new Date().setDate(new Date().getDate() + 9)), 
      completed: false,
      assignee: "Pappa",
    },
    {
      chore: "chore4",
      name: "Vaske sjarken",
      description: "Sjarken er skitten og trenger en vask. Husk å skrubbe dekket godt! Onkel blir fornøyd.",
      reward: 200,
      dueDate: new Date(new Date().setDate(new Date().getDate() + 4)), 
      completed: false,
      assignee: "Pappa",
    },
    {
      chore: "chore5",
      name: "Vaske fesken",
      description: "Fesken har blitt skitten og trenger en vask. Husk å skrubbe den godt! Vi vil ikke ha skitten fesk.",
      reward: 30,
      dueDate: new Date(new Date().setDate(new Date().getDate() + 2)), 
      completed: false,
      assignee: "Mamma",
    },
    {
      chore: "chore6",
      name: "Gjøre lekser",
      description: "Du har fått lekser av lærer Saddam. Gjør de!",
      reward: 60,
      dueDate: new Date(new Date().setDate(new Date().getDate() + 2)), 
      completed: false,
      assignee: "Pappa",
    },
    {
      chore: "chore7",
      name: "Gjøre lekser",
      description: "Du har fått lekser av lærer Saddam. Gjør de!",
      reward: 60,
      dueDate: new Date(new Date().setDate(new Date().getDate() + 2)), 
      completed: false,
      assignee: "Pappa",
    },
    {
      chore: "chore8",
      name: "Gjøre lekser",
      description: "Du har fått lekser av lærer Saddam. Gjør de!",
      reward: 60,
      dueDate: new Date(new Date().setDate(new Date().getDate() + 2)), 
      completed: false,
      assignee: "Pappa",
    },
  ];
  
  const cashMulla = {
    mulla:14243545,
    sphareCoin: 3245,
  };

  const setViewChore =(chore: Chore) => {
    setChoreOfInterest(chore);
    toggleModal();
  }
  const toggleModal = () => {
    toggleView((prevState) => !prevState);
  }
  return (
    <SafeAreaView>
      <AppHeader />
      <View className="h-full bg-white flex flex-col">
        <Text className="p-1 text-lg font-semibold text-center">Her kan du spare med Sphare!</Text>
        <View className="p-4 flex-row items-center">
          <Image
            className="w-36 h-48 rounded-md"
            source={require("@/assets/images/sphare1.png")}
            resizeMode="contain"
          />
          <View className="flex flex-col items-center flex-1">
            <Text className="text-3xl font-semibold text-teal-500">Du har tjent:</Text>
            <Text className="text-2xl font-semibold text-center">{cashMulla.mulla},-</Text>
            <View className="flex-row items-center">
              <Image
                className="w-9 h-9 rounded-md"
                source={require("@/assets/images/coin.png")}
                resizeMode="contain"
              />
              <Text className="text-xl font-semibold">x{cashMulla.sphareCoin}</Text>
            </View>
          </View>
        </View>
        <View className="flex flex-col items-center px-8">
          <Text className="text-lg pb-2 text-center border-b border-teal-300">
            Aktive gjøremål 👇
          </Text>
          <ScrollView className="h-88">
            {chores.map((chore, index) => (
              <View key={index}>
                <ChoreList chore={chore} onClick={() => setViewChore(chore)} />
              </View>
            ))}
          </ScrollView>
          <View className="border-b border-teal-300"></View>
          {choreOfInterest && (
            <Modal
              visible={viewChore}
              animationType="none"
              transparent={true}
              onRequestClose={toggleModal}
            >
              <View className="h-full w-full flex justify-center items-center">
                <View className="p-4">
                  <ChoresDetailedView chore={choreOfInterest} onClick={toggleModal} />
                </View>
              </View>
            </Modal>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Chores
