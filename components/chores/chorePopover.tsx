import React, { useCallback, useRef, useEffect } from "react";
import { Modal, Text, View } from "react-native";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { Chore } from "../../backend/types/chore"
import ChoreNavbar from "./chorePopoverNavbar";
import Done from "./popOverComponents/done";
import Requested from "./popOverComponents/requested";
import Older from "./popOverComponents/older";

interface Props {
  chore: Chore[];
  onClick: () => void;
  showPopover: boolean;
}


const Popover: React.FC<Props> = ({ chore, onClick, showPopover }) => {

  const [state, setNavbarState] = React.useState<string>("completed");

  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleOpenPress = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
    ),
    []
  );

  showPopover ? handleOpenPress() : null;

  return (
    <BottomSheet
      style={{ zIndex: 15 }}
      ref={bottomSheetRef}
      snapPoints={["90%"]}
      enablePanDownToClose={true}
      backdropComponent={renderBackdrop}
      index={-1}
      onChange={onClick}
    >
      <View className="flex flex-col px-6">
        <ChoreNavbar state={state} onClick={(newState) => setNavbarState(newState)} closeOverlay={() => bottomSheetRef.current?.close()}/>
          {state === "gjennomført" ? (
          //Render component for gjennomført
          <Done chores={chore.filter((chore: Chore) => chore.paid === true)} onClick={onClick}/>
          ):(
          state === "complete" ? (
          //Render component for forespurt
          <Requested chores={chore} onClick={onClick}/>
          ):(
          //Render component for eldre
          <Older chores={chore} onClick={onClick}/>
          )
          )}
      </View>
    </BottomSheet>
  );
};

export default Popover;
