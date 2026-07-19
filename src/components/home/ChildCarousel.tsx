import { useGlobalStore } from '@/store';
import { useCallback, useRef } from 'react';
import { FlatList, useWindowDimensions, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import ChildCard from './ChildCard';

const ChildCarousel = () => {
  const flatListRef = useRef<FlatList>(null);
  const children = useGlobalStore(s => s.children);
  const currentChildIndex = useGlobalStore(s => s.currentChildIndex);
  const setCurrentChildIndex = useGlobalStore(s => s.setCurrentChildIndex);
  const nextChild = useGlobalStore(s => s.nextChild);
  const previousChild = useGlobalStore(s => s.previousChild);
  const { width: windowWidth } = useWindowDimensions();

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: { index: number | null }[] }) => {
      const index = viewableItems[0]?.index;
      if (index !== null && index !== undefined) {
        setCurrentChildIndex(index);
      }
    },
    [setCurrentChildIndex],
  );

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollToIndex = (index: number) => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
  };

  const handlePrevious = () => {
    const prevIndex = Math.max(currentChildIndex - 1, 0);
    previousChild();
    scrollToIndex(prevIndex);
  };

  const handleNext = () => {
    const nextIndex = Math.min(currentChildIndex + 1, children.length - 1);
    nextChild();
    scrollToIndex(nextIndex);
  };

  const cardWidth = windowWidth - 32;

  return (
    <View style={styles.wrapper}>
      <FlatList
        ref={flatListRef}
        data={children}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => (
          <View style={[styles.cardWrapper, { width: cardWidth }]}>
            <ChildCard
              child={item}
              onPrevious={handlePrevious}
              onNext={handleNext}
              hasPrevious={index > 0}
              hasNext={index < children.length - 1}
              currentIndex={index}
              totalChildren={children.length}
            />
          </View>
        )}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        decelerationRate='fast'
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
    </View>
  );
};

const styles = StyleSheet.create(() => ({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  cardWrapper: {
    paddingHorizontal: 4,
  },
}));

export default ChildCarousel;
