import { Modal, Text, View } from "react-native";
import { Chore } from "@/app/types/chores";

interface Props {
  chores: Chore[];
  onClick: () => void;
}


const Requested: React.FC<Props> = ({ chores, onClick }) => {

  return (
    <View>
        <Text>Requested</Text>
    </View>
  );
};

export default Requested;
