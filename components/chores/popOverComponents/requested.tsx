import { Modal, Text, View, Image, Dimensions } from "react-native";
import { Chore } from "@/app/types/chores";
import { ScrollView } from "react-native-gesture-handler";
import ChoreList from "../chore";
import ChoresDetailedView from "../choresDetailedView";
import React from "react";
import Button from "@/components/ui/button";

interface Props {
  chores: Chore[];
  onClick: () => void;
}

const {width, height} = Dimensions.get("window");

const Requested: React.FC<Props> = ({ chores, onClick }) => {
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
    if (chore.status === "Forespurt") {
      return acc + chore.rewardNOK;
    }
    return acc;
  },0);

  const scrollHeight = height*0.26;
  return (
    <View className="w-full flex flex-col items-center justify-center py-4 space-y-2">
      <View className="flex flex-row space-x-2">
        <View className="w-[50%] flex justify-center items-center rounded-lg bg-[#E6FDFF]">
          <Text className=" p-4 ">
            Så flink du har vært! Her kan du se alle gjennomførte gjøremål!
          </Text>
        </View>
        <View>
          <Image
            className="rounded-md"
            source={require("@/assets/images/sphare3.png")}
            resizeMode="contain" />
        </View>
      </View>
      <View style={{height: scrollHeight}} className="mb-2 border-b-2 border-teal-300">
        <ScrollView >
          {chores.map((chore, index) => (
            chore.status === "Forespurt" && (
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
      <View className="w-full flex flex-row justify-between items-center rounded-lg bg-[#E6FDFF] p-4">
        <View className="w-[50%] flex flex-col">
          <Text className="w-full text-left">Du har forespurt gjøremål for:</Text>
          <Text className="w-full text-left px-2 py-1 font-semibold text-xl text-green-600">{earnedCoin} NOK</Text>
          {/* <View className="flex flex-row w-full"> */}
            <Text className="w-full my-1">Foreslå et til så tjener du mer!</Text>
            <Button classname="py-1" text="Foreslå gjøremål" onClick={() => console.log("Hello Kira how are you")}></Button>
          {/* </View> */}
        </View>
        <Image
            className="rounded-md"
            source={require("@/assets/images/sphare3.png")}
            resizeMode="contain" />
      </View>
    </View>
  );
};

export default Requested;
