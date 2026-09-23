import ChildStatusBadge from '@/components/home/ChildStatusBadge';
import { useGlobalStore } from '@/store';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { Linking, Text, TouchableOpacity, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

const TripBottomSheet = () => {
  const router = useRouter();
  const children = useGlobalStore(s => s.children);
  const currentChildIndex = useGlobalStore(s => s.currentChildIndex);
  const child = children[currentChildIndex];

  if (!child) return null;

  return (
    <View style={styles.container}>
      <View style={styles.statusSection}>
        <ChildStatusBadge status={child.status} />
        <Text style={styles.statusSubtext}>
          {child.status === 'en_route'
            ? 'Driver is on the way to pickup'
            : child.status === 'picked_up'
              ? 'Student is onboard'
              : 'Trip has ended'}
        </Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Ionicons name='speedometer-outline' size={16} color='#066B64' />
          <Text style={styles.statLabel}>Speed</Text>
          <Text style={styles.statValue}>{child.estimatedTime}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Ionicons name='map-outline' size={16} color='#066B64' />
          <Text style={styles.statLabel}>Distance</Text>
          <Text style={styles.statValue}>{child.estimatedDistance}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Ionicons name='location-outline' size={16} color='#066B64' />
          <Text style={styles.statLabel}>Next Stop</Text>
          <Text style={styles.statValue}>{child.endLocation}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.driverCard}
        activeOpacity={0.7}
        onPress={() => Linking.openURL(`tel:${child.driverPhone}`)}>
        <View style={styles.driverAvatar}>
          <Ionicons name='person' size={22} color='#066B64' />
        </View>
        <View style={styles.driverInfo}>
          <Text style={styles.driverName}>{child.driverName}</Text>
          <Text style={styles.driverDetail}>
            {child.busNumber} · {child.busPlate}
          </Text>
        </View>
        <View style={styles.callBtn}>
          <Ionicons name='call-outline' size={18} color='#fff' />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.viewFullBtn}
        activeOpacity={0.7}
        onPress={() => router.push('/(protected)/(stack)/trip-detail')}>
        <Text style={styles.viewFullText}>View full trip status</Text>
        <Ionicons name='chevron-forward' size={18} color='#066B64' />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create(({ colors, spacings }) => ({
  container: {
    paddingHorizontal: spacings.md,
    paddingTop: spacings.sm,
    paddingBottom: spacings.xxxxl,
    gap: spacings.md,
  },
  statusSection: {
    gap: spacings.xs,
  },
  statusSubtext: {
    fontSize: 13,
    fontFamily: 'Rubik',
    color: colors.placeholderText,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f2f0',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: spacings.md,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: colors.border,
  },
  statLabel: {
    fontSize: 10,
    fontFamily: 'Rubik',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 13,
    fontFamily: 'RubikSemiBold',
    color: colors.primary,
  },
  driverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacings.md,
    gap: spacings.md,
  },
  driverAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#e8f2f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverInfo: {
    flex: 1,
    gap: 2,
  },
  driverName: {
    fontSize: 15,
    fontFamily: 'RubikMedium',
    color: colors.text,
  },
  driverDetail: {
    fontSize: 12,
    fontFamily: 'Rubik',
    color: colors.placeholderText,
  },
  callBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewFullBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primaryTint,
    gap: spacings.xs,
  },
  viewFullText: {
    fontSize: 14,
    fontFamily: 'RubikMedium',
    color: colors.primaryTint,
  },
}));

export default TripBottomSheet;
