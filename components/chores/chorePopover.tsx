import React, { useCallback, useRef, useEffect } from "react";
import { Modal, Text } from "react-native";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { Chore } from "@/app/types/chores";
import ChoreNavbar from "./chorePopoverNavbar";
import { ChoreNavbarState } from "@/app/types/chores";

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
      <ChoreNavbar state={state} onClick={(newState) => setNavbarState(newState)}/>
        {state === ChoreNavbarState.GJENNOMFØRT ? (
            //Render component for gjennomført
            <Text>gjennomført</Text>
        ):(
            state === ChoreNavbarState.FORESPURT ? (
                //Render component for forespurt
                <Text>forspurt</Text>
            ):(
                //Render component for eldre
                <Text>eldre</Text>
            )
        )}
    </BottomSheet>
  );
};

export default Popover;
