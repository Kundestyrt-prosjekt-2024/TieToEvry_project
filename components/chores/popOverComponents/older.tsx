import { Modal, Text, View, Image, Dimensions } from "react-native";
import { Chore } from "../../../backend/types/chore";
import Button from "@/components/ui/button";
import { ScrollView } from "react-native-gesture-handler";
import ChoreList from "../chore";
import ChoresDetailedView from "../choresDetailedView";
import React from "react";

interface Props {
  chores: Chore[];
  onClick: () => void;
}

const {width, height} = Dimensions.get("window");


const Older: React.FC<Props> = ({ chores, onClick }) => {
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
    if (chore.chore_status === "complete" && chore.paid) {
      return acc + chore.reward_amount;
    }
    return acc;
  },0);

  const waitingForCoin = chores.reduce((acc, chore) => {
    if (chore.chore_status === "complete" && !chore.paid || chore.chore_status==="pending") {
      return acc + chore.reward_amount;
    }
    return acc;
  },0);

  const missedCoin = chores.reduce((acc, chore) => {
    if (chore.chore_status === "rejected") {
      return acc + chore.reward_amount;
    }
    return acc;
  },0);

  const scrollHeight = height*0.33;

  return (
    <View className="w-full flex flex-col items-center justify-between py-4 space-y-2">
      <View className="flex flex-row w-full space-x-2">
        <View className="w-[50%] flex justify-center items-center rounded-lg bg-[#E6FDFF]">
          <Text className=" p-4 ">
            Så flink du har vært! Her kan du se alle gjennomførte gjøremål!
          </Text>
        </View>
        <Image
          className="rounded-md"
          source={require("@/assets/images/sphare2.png")}
          resizeMode="contain" />
      </View>
      <View style={{height: scrollHeight}} className="mb-2 border-b-2 border-teal-300">
        <ScrollView >
          {chores.filter((chore) => chore.chore_status==="rejected").map((chore, index) => (
            (
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
              <ChoresDetailedView chore={choreOfInterest} onClick={toggleModal} refetch={() => { /* Add your refetch logic here */ }} />
            </View>
          </View>
        </Modal>
      )}
      <View className="flex flex-row justify-between items-center w-full">
        <View className="w-[30%] flex flex-col justify-center items-center rounded-lg bg-[#CBFDCD] p-4 space-y-4">
          <Text className="text-lg ">Tjent</Text>        
          <Text className="text-green-600 text-xl font-semibold">{earnedCoin},-</Text>        
        </View>
        <View className="w-[30%] flex flex-col justify-center items-center rounded-lg bg-[#FFEBB9] px-2 py-4 space-y-4">
          <Text className="text-lg ">Venter på</Text>        
          <Text className="text-yellow-600 text-xl font-semibold">{waitingForCoin},-</Text>   
        </View>
        <View className="w-[30%] flex flex-col justify-center items-center rounded-lg bg-[#FFAAAA] p-4 space-y-4">
          <Text className="text-lg ">Ikke fått</Text>
          <Text className="text-red-600 text-xl font-semibold">{missedCoin},-</Text>
        </View>
      </View>
    </View>
  );
};

export default Older;
