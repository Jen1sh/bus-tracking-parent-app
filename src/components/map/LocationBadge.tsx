import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

const LocationBadge = () => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setSeconds(p => p + 1), 30000);
    return () => clearInterval(interval);
  }, []);

  const label = seconds < 60 ? 'Updated just now' : `Updated ${Math.floor(seconds / 60)}m ago`;

  return (
    <View style={styles.badge}>
      <View style={styles.dot} />
      <Ionicons name='location-outline' size={12} color='#fff' />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create(({ colors }) => ({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    gap: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4CAF50',
  },
  label: {
    fontSize: 12,
    fontFamily: 'RubikMedium',
    color: '#fff',
  },
}));

export default LocationBadge;
