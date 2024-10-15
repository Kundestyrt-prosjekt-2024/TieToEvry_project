import React, { useCallback, useRef, useEffect } from "react";
import { Modal, Text, View } from "react-native";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { Chore } from "@/app/types/chores";
import ChoreNavbar from "./chorePopoverNavbar";
import { ChoreNavbarState } from "@/app/types/chores";
import Done from "./popOverComponents/done";
import Requested from "./popOverComponents/requested";
import Older from "./popOverComponents/older";

interface Props {
  chore: Chore[];
  onClick: () => void;
  showPopover: boolean;
}


const Popover: React.FC<Props> = ({ chore, onClick, showPopover }) => {

  const [state, setNavbarState] = React.useState<ChoreNavbarState>(ChoreNavbarState.GJENNOMFØRT);

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
      snapPoints={["80%"]}
      enablePanDownToClose={true}
      backdropComponent={renderBackdrop}
      index={-1}
      onChange={onClick}
    >
      <View className="flex flex-col p-6">
        <ChoreNavbar state={state} onClick={(newState) => setNavbarState(newState)}/>
          {state === ChoreNavbarState.GJENNOMFØRT ? (
              //Render component for gjennomført
              <Done chores={chore} onClick={onClick}/>
          ):(
              state === ChoreNavbarState.FORESPURT ? (
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
