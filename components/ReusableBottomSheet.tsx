// ReusableBottomSheet.tsx
import React, { useRef, useEffect, useCallback } from 'react';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';

interface ReusableBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const ReusableBottomSheet: React.FC<ReusableBottomSheetProps> = ({ isVisible, onClose, children }) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  );

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  useEffect(() => {
    if (isVisible) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isVisible]);

  const handleSheetChanges = (index: number) => {
    if (index === -1) {
      onClose();
    }
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={['75%']}
      enablePanDownToClose={true}
      backdropComponent={renderBackdrop}
      index={-1}
      onChange={handleSheetChanges}
    >
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        {children}
      </TouchableWithoutFeedback>
    </BottomSheet>
  );
};

export default ReusableBottomSheet;
