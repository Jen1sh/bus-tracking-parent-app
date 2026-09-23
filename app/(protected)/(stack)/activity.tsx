import Ionicons from '@expo/vector-icons/Ionicons';
import { FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native-unistyles';

type ActivityItem = {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  time: string;
};

const ACTIVITY_DATA: ActivityItem[] = [
  {
    id: '1',
    icon: 'location-outline',
    title: 'Bus picked up Aarav',
    description: 'Aarav Sharma was picked up from Home',
    time: '7:15 AM',
  },
  {
    id: '2',
    icon: 'time-outline',
    title: 'Trip started',
    description: 'BUS-101 departed from pickup location',
    time: '7:10 AM',
  },
  {
    id: '3',
    icon: 'alert-circle-outline',
    title: 'Traffic delay reported',
    description: 'Route has moderate traffic, ETA may vary',
    time: '6:55 AM',
  },
  {
    id: '4',
    icon: 'person-outline',
    title: 'Driver assigned',
    description: 'Rajesh Sharma assigned to BUS-101',
    time: '6:30 AM',
  },
  {
    id: '5',
    icon: 'checkmark-circle-outline',
    title: 'Schedule confirmed',
    description: "Today's trip schedule has been confirmed",
    time: '6:00 AM',
  },
];

const ActivityScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={ACTIVITY_DATA}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => (
          <View style={[styles.card, index === 0 && styles.cardFirst]}>
            <View style={styles.iconCol}>
              <View style={styles.iconCircle}>
                <Ionicons name={item.icon} size={18} color='#066B64' />
              </View>
              {index < ACTIVITY_DATA.length - 1 && <View style={styles.line} />}
            </View>
            <View style={styles.contentCol}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create(({ colors, spacings }) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: spacings.md,
    paddingBottom: spacings.xxxxl,
  },
  card: {
    flexDirection: 'row',
    gap: spacings.md,
  },
  cardFirst: {
    paddingTop: 0,
  },
  iconCol: {
    alignItems: 'center',
    width: 32,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e8f2f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 4,
    minHeight: 20,
  },
  contentCol: {
    flex: 1,
    paddingBottom: spacings.lg,
    gap: 2,
  },
  title: {
    fontSize: 15,
    fontFamily: 'RubikMedium',
    color: colors.text,
  },
  description: {
    fontSize: 13,
    fontFamily: 'Rubik',
    color: colors.placeholderText,
  },
  time: {
    fontSize: 11,
    fontFamily: 'Rubik',
    color: colors.placeholderText,
    marginTop: 2,
  },
}));

export default ActivityScreen;
