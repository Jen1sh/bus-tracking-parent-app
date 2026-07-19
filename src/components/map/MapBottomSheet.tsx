import { TrueSheet } from '@lodev09/react-native-true-sheet';
import { forwardRef } from 'react';
import { useUnistyles } from 'react-native-unistyles';
import TripInfoSheet from './TripInfoSheet';

const MapBottomSheet = forwardRef<TrueSheet>((_props, ref) => {
  const { theme } = useUnistyles();
  const { colors } = theme;

  return (
    <TrueSheet
      ref={ref}
      detents={[0.4, 1]}
      scrollable
      cornerRadius={24}
      grabber
      backgroundColor={colors.background}
      scrollableOptions={{ scrollingExpandsSheet: false }}>
      <TripInfoSheet />
    </TrueSheet>
  );
});

MapBottomSheet.displayName = 'MapBottomSheet';

export default MapBottomSheet;
