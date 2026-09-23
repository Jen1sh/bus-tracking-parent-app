import ChildSwitcher from '@/components/map/ChildSwitcher';
import LocationBadge from '@/components/map/LocationBadge';
import NotificationBadge from '@/components/map/NotificationBadge';
import ReopenSheetButton from '@/components/map/ReopenSheetButton';
import TripBottomSheet from '@/components/map/TripBottomSheet';
import { TrueSheet } from '@lodev09/react-native-true-sheet';
import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import MapView from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native-unistyles';

const HomeMapScreen = () => {
  const insets = useSafeAreaInsets();
  const sheetRef = useRef<TrueSheet>(null);
  const [sheetVisible, setSheetVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      sheetRef.current?.present(0);
      setSheetVisible(true);
    });
  }, []);

  const presentSheet = () => {
    sheetRef.current?.present(0);
    setSheetVisible(true);
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPanDrag={() => {
          if (sheetVisible) {
            sheetRef.current?.dismiss();
          }
        }}
      />

      <View style={[styles.topLeft, { top: insets.top + 8 }]}>
        <ChildSwitcher />
      </View>

      <View style={[styles.topRight, { top: insets.top + 8 }]}>
        <NotificationBadge />
      </View>

      <View style={styles.bottomLeft}>
        <LocationBadge />
      </View>

      {!sheetVisible && <ReopenSheetButton onPress={presentSheet} />}

      <TrueSheet
        ref={sheetRef}
        detents={[0.45, 0.7]}
        scrollable
        cornerRadius={24}
        grabber
        backgroundColor={'#f7f7f7'}
        onDidPresent={() => setSheetVisible(true)}
        onDidDismiss={() => setSheetVisible(false)}
        scrollableOptions={{ scrollingExpandsSheet: false }}>
        <TripBottomSheet />
      </TrueSheet>
    </View>
  );
};

const styles = StyleSheet.create(({ colors, spacings }) => ({
  topLeft: {
    position: 'absolute',
    left: spacings.md,
    right: 80,
    backgroundColor: colors.light,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  topRight: {
    position: 'absolute',
    right: spacings.md,
    backgroundColor: colors.light,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  bottomLeft: {
    position: 'absolute',
    bottom: 100,
    left: 16,
  },
}));

export default HomeMapScreen;
