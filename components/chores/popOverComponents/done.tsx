import { Modal, Text, View, Image, Dimensions } from "react-native";
import { Chore } from "@/app/types/chores";
import { ScrollView } from "react-native-gesture-handler";
import ChoreList from "../chore";
import React from "react";
import ChoresDetailedView from "../choresDetailedView";
import Button from "@/components/ui/button";

interface Props {
  chores: Chore[];
  onClick: () => void;
}

const {width, height } = Dimensions.get('window');


const Done: React.FC<Props> = ({ chores, onClick }) => {
  const [viewChore, toggleView] = React.useState(false);
  const [choreOfInterest, setChoreOfInterest] = React.useState<Chore | null>(null);

  const setViewChore = (chore: Chore) => {
    setChoreOfInterest(chore);
    toggleModal();
  }
  const toggleModal = () => {
    toggleView((prevState) => !prevState);
  }

  const earnedCoin = chores.reduce((acc, chore) => {
    if (chore.completed) {
      return acc + chore.rewardNOK;
    }
    return acc;
  },0);

  const scrollHeight = height*0.27;

  return (
    <View style={{height:height}} className="w-full flex flex-col justify-start py-4 space-y-2">
      <View className="flex flex-row w-full justify-center items-center space-x-2 h-[15%] pb-2">
        <Image
          className="rounded-md"
          source={require("@/assets/images/sphare3.png")}
          resizeMode="contain" />
        <View className="w-[50%] flex justify-center items-center rounded-lg bg-[#E6FDFF]">
          <Text className=" p-4 ">
            Så flink du har vært! Her kan du se alle gjennomførte gjøremål!
          </Text>
        </View>
      </View>
      {/* <View style={{height: scrollHeight}} className="mb-2 border-b-2 border-teal-300"> */}
      <View className="h-[30%]  mb-2 border-b-2 border-teal-300">
        <ScrollView className="">
          {chores.map((chore, index) => (
            chore.completed && (
              <View key={index}>
                <ChoreList chore={chore} onClick={() => setViewChore(chore)} />
              </View>
            )
          ))}
        </ScrollView>
      </View>
      {choreOfInterest && (
        <Modal
          visible={viewChore}
          animationType="slide"
          transparent={true}
          onRequestClose={toggleModal}
        >
          <View className="h-full w-full flex justify-center items-center">
            <View className="p-4 w-full">
              <ChoresDetailedView chore={choreOfInterest} onClick={toggleModal} />
            </View>
          </View>
        </Modal>
      )}
      <View className="w-full h-[20%] flex flex-col justify-center items-center rounded-lg bg-[#E6FDFF] p-4">
        <Text className="w-full text-left">Du har tjent så mye de siste to ukene:</Text>
        <Text className="w-full text-center p-2 font-semibold text-xl text-green-600">{earnedCoin} NOK</Text>
        {/* <View className="flex flex-row w-full"> */}
          <Text className="w-full my-1">Hvis du sparer halvparten kommer du nærmere sparemålet ditt!</Text>
          <Button classname="py-1" text="Sett av til sparemål" onClick={() => console.log("Hello world from sett av til sparemål")}></Button>
        {/* </View> */}
        
      </View>
    </View>
  );
};

export default Done;
