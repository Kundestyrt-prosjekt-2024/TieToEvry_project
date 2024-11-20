import React, { useCallback, useRef } from "react"
import { View } from "react-native"
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet"
import { Chore } from "../../backend/types/chore"
import ChoreNavbar from "./ChorePopoverNavbar"
import Done from "./popOverComponents/Done"
import Requested from "./popOverComponents/Requested"
import Older from "./popOverComponents/Older"

interface Props {
  chore: Chore[]
  onClick: () => void
  showPopover: boolean
}

const Popover: React.FC<Props> = ({ chore, onClick, showPopover }) => {
  const [state, setNavbarState] = React.useState<string>("gjennomført")

  const bottomSheetRef = useRef<BottomSheet>(null)

  const handleOpenPress = useCallback(() => {
    bottomSheetRef.current?.expand()
  }, [])

  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />,
    []
  )

  showPopover ? handleOpenPress() : null

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
        <ChoreNavbar
          state={state}
          onClick={(newState) => setNavbarState(newState)}
          closeOverlay={() => bottomSheetRef.current?.close()}
        />
        {state === "gjennomført" ? (
          //Render component for gjennomført
          <Done chores={chore.filter((chore: Chore) => chore.paid === true)} onClick={onClick} />
        ) : state === "complete" ? (
          //Render component for forespurt
          <Requested chores={chore} onClick={onClick} />
        ) : (
          //Render component for eldre
          <Older chores={chore} onClick={onClick} />
        )}
      </View>
    </BottomSheet>
  )
}

export default Popover
