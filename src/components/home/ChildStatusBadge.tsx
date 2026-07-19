import type { ChildStatus } from '@/store';
import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

interface Props {
  status: ChildStatus;
}

const statusConfig: Record<ChildStatus, { label: string; color: string; bg: string }> = {
  en_route: { label: 'On the Way', color: '#fff', bg: '#228B22' },
  picked_up: { label: 'Picked Up', color: '#fff', bg: '#ED5932' },
  completed: { label: 'Trip Ended', color: '#fff', bg: '#9e9e9e' },
};

const ChildStatusBadge = ({ status }: Props) => {
  const config = statusConfig[status];

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <View style={[styles.dot, { backgroundColor: config.color, opacity: 0.8 }]} />
      <Text style={[styles.statusText, { color: config.color }]}>{config.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create(() => ({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'RubikMedium',
    letterSpacing: 0.3,
  },
}));

export default ChildStatusBadge;
