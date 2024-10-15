import { Modal, Text, View, Image } from "react-native";
import { Chore } from "@/app/types/chores";

interface Props {
  chores: Chore[];
  onClick: () => void;
}


const Done: React.FC<Props> = ({ chores, onClick }) => {

  return (
    <View className="w-full flex flex-col items-center justify-center">
        <View className="flex flex-row">
            <Image
                className="rounded-md"
                source={require("@/assets/images/sphare2.png")}
                resizeMode="contain"/>
        </View>
    </View>
  );
};

export default Done;
