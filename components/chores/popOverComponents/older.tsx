import { Modal, Text, View } from "react-native";
import { Chore } from "@/app/types/chores";

interface Props {
  chores: Chore[];
  onClick: () => void;
}


const Older: React.FC<Props> = ({ chores, onClick }) => {

  return (
    <View>
        <Text>Older</Text>
    </View>
  );
};

export default Older;
