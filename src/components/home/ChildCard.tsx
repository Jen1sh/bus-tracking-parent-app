import type { Child } from '@/store';
import Icon from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { Linking, Text, TouchableOpacity, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import ChildStatusBadge from './ChildStatusBadge';
import { StyledText } from '../styled/StyledText';

interface Props {
  child: Child;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
  currentIndex?: number;
  totalChildren?: number;
}

const ChildCard = ({
  child,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
  currentIndex = 0,
  totalChildren = 0,
}: Props) => {
  const router = useRouter();

  const handleEmergencyCall = () => {
    Linking.openURL(`tel:${child.driverPhone}`);
  };

  return (
    <View style={styles.card}>
      <View style={styles.switchSection}>
        <View style={styles.switchRow}>
          {hasPrevious ? (
            <TouchableOpacity style={styles.arrowButton} activeOpacity={0.7} onPress={onPrevious}>
              <Icon name='chevron-back' size={20} color='#02384A' />
            </TouchableOpacity>
          ) : (
            <View style={styles.arrowPlaceholder} />
          )}

          <StyledText variant='subtitle' fontWeight='semibold' style={styles.switchName}>
            {child.name}
          </StyledText>

          {hasNext ? (
            <TouchableOpacity style={styles.arrowButton} activeOpacity={0.7} onPress={onNext}>
              <Icon name='chevron-forward' size={20} color='#02384A' />
            </TouchableOpacity>
          ) : (
            <View style={styles.arrowPlaceholder} />
          )}
        </View>

        <View style={styles.switchMeta}>
          <StyledText variant='caption' style={styles.grade}>
            {child.grade}
          </StyledText>
          {totalChildren > 1 && (
            <View style={styles.dots}>
              {Array.from({ length: totalChildren }).map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    index === currentIndex ? styles.dotActive : styles.dotInactive,
                  ]}
                />
              ))}
            </View>
          )}
          <ChildStatusBadge status={child.status} />
        </View>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <View style={styles.infoIcon}>
            <Icon name='person-outline' size={16} color='#066B64' />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Driver</Text>
            <Text style={styles.infoValue}>{child.driverName}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoIcon}>
            <Icon name='call-outline' size={16} color='#066B64' />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}>{child.driverPhone}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoIcon}>
            <Icon name='bus-outline' size={16} color='#066B64' />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Bus</Text>
            <Text style={styles.infoValue}>
              {child.busNumber} · {child.busPlate}
            </Text>
          </View>
        </View>

        <View style={[styles.infoRow, styles.infoRowLast]}>
          <View style={styles.infoIcon}>
            <Icon name='time-outline' size={16} color='#066B64' />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Schedule</Text>
            <Text style={styles.infoValue}>
              ↑{child.pickupTime} ↓{child.dropoffTime}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.emergencyButton}
          activeOpacity={0.7}
          onPress={handleEmergencyCall}>
          <Icon name='alert-circle-outline' size={18} color='#fff' />
          <Text style={styles.actionText}>Emergency Call</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.mapButton}
          activeOpacity={0.7}
          onPress={() => router.push('/(protected)/(stack)/map')}>
          <Icon name='map-outline' size={18} color='#fff' />
          <Text style={styles.actionText}>View on Map</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create(({ colors, spacings }) => ({
  card: {
    backgroundColor: colors.background,
    borderRadius: 20,
    padding: spacings.lg,
    gap: spacings.lg,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  },
  switchSection: {
    gap: spacings.sm,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  arrowButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f4f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowPlaceholder: {
    width: 32,
  },
  switchName: {
    flex: 1,
    textAlign: 'center',
  },
  switchMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacings.sm,
  },
  grade: {
    opacity: 0.5,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    backgroundColor: colors.primaryTint,
    width: 18,
    borderRadius: 3,
  },
  dotInactive: {
    backgroundColor: colors.border,
  },
  infoSection: {
    gap: 0,
    backgroundColor: colors.surface,
    borderRadius: 14,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: spacings.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacings.sm,
  },
  infoRowLast: {
    borderBottomWidth: 0,
  },
  infoIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#e8f2f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContent: {
    flex: 1,
    gap: 2,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.placeholderText,
    fontFamily: 'Rubik',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 15,
    color: colors.text,
    fontFamily: 'RubikMedium',
  },
  actions: {
    flexDirection: 'row',
    gap: spacings.sm,
  },
  emergencyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.error,
    borderRadius: 12,
    paddingVertical: 14,
    gap: spacings.sm,
  },
  mapButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    gap: spacings.sm,
  },
  actionText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'RubikMedium',
  },
}));

export default ChildCard;
