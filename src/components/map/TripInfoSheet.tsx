import { useGlobalStore } from '@/store';
import type { ChildStatus } from '@/store';
import Icon from '@expo/vector-icons/Ionicons';
import { Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import ChildStatusBadge from '../home/ChildStatusBadge';

const TRIP_STEPS = ['Departed', 'Picked Up', 'En Route', 'Arrived'];

function getActiveStep(status: ChildStatus): number {
  switch (status) {
    case 'en_route':
      return 1;
    case 'picked_up':
      return 2;
    case 'completed':
      return 3;
  }
}

const TripInfoSheet = () => {
  const children = useGlobalStore(s => s.children);
  const currentChildIndex = useGlobalStore(s => s.currentChildIndex);
  const setCurrentChildIndex = useGlobalStore(s => s.setCurrentChildIndex);
  const child = children[currentChildIndex];

  if (!child) return null;

  const activeStep = getActiveStep(child.status);

  const handlePrevious = () => {
    setCurrentChildIndex(Math.max(currentChildIndex - 1, 0));
  };

  const handleNext = () => {
    setCurrentChildIndex(Math.min(currentChildIndex + 1, children.length - 1));
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <View style={styles.switchSection}>
        <View style={styles.switchRow}>
          {currentChildIndex > 0 ? (
            <TouchableOpacity
              style={styles.arrowButton}
              activeOpacity={0.7}
              onPress={handlePrevious}>
              <Icon name='chevron-back' size={20} color='#02384A' />
            </TouchableOpacity>
          ) : (
            <View style={styles.arrowPlaceholder} />
          )}

          <Text style={styles.switchName}>{child.name}</Text>

          {currentChildIndex < children.length - 1 ? (
            <TouchableOpacity style={styles.arrowButton} activeOpacity={0.7} onPress={handleNext}>
              <Icon name='chevron-forward' size={20} color='#02384A' />
            </TouchableOpacity>
          ) : (
            <View style={styles.arrowPlaceholder} />
          )}
        </View>

        <View style={styles.switchMeta}>
          <Text style={styles.grade}>{child.grade}</Text>
          {children.length > 1 && (
            <View style={styles.dots}>
              {children.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    index === currentChildIndex ? styles.dotActive : styles.dotInactive,
                  ]}
                />
              ))}
            </View>
          )}
          <ChildStatusBadge status={child.status} />
        </View>
      </View>

      <Text style={styles.sectionTitle}>Trip Status</Text>
      <View style={styles.tripStatusCard}>
        <View style={styles.timelineRow}>
          {TRIP_STEPS.map((step, index) => {
            const isCompleted = index < activeStep;
            const isActive = index === activeStep;
            const isLast = index === TRIP_STEPS.length - 1;

            return (
              <View key={step} style={styles.timelineStep}>
                <View style={styles.timelineDotContainer}>
                  <View
                    style={[
                      styles.timelineDot,
                      isCompleted && styles.timelineDotCompleted,
                      isActive && styles.timelineDotActive,
                    ]}>
                    {isCompleted && <Icon name='checkmark' size={10} color='#fff' />}
                    {isActive && <View style={styles.timelineInnerDot} />}
                  </View>
                  {!isLast && (
                    <View
                      style={[
                        styles.timelineLine,
                        index < activeStep && styles.timelineLineCompleted,
                      ]}
                    />
                  )}
                </View>
                <Text
                  style={[
                    styles.timelineLabel,
                    isCompleted && styles.timelineLabelCompleted,
                    isActive && styles.timelineLabelActive,
                  ]}
                  numberOfLines={1}>
                  {step}
                </Text>
              </View>
            );
          })}
        </View>

        <View style={styles.etaRow}>
          <View style={styles.etaItem}>
            <Icon name='time-outline' size={14} color='#066B64' />
            <Text style={styles.etaLabel}>ETA</Text>
            <Text style={styles.etaValue}>{child.estimatedTime}</Text>
          </View>
          <View style={styles.etaDivider} />
          <View style={styles.etaItem}>
            <Icon name='speedometer-outline' size={14} color='#066B64' />
            <Text style={styles.etaLabel}>Distance</Text>
            <Text style={styles.etaValue}>{child.estimatedDistance}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Route</Text>
      <View style={styles.routeCard}>
        <View style={styles.routeRow}>
          <View style={styles.routeDotContainer}>
            <View style={styles.routeDotStart} />
            <View style={styles.routeLine} />
            <View style={styles.routeDotEnd} />
          </View>
          <View style={styles.routeInfo}>
            <View style={styles.routeStop}>
              <Text style={styles.routeTime}>↑ {child.pickupTime}</Text>
              <Text style={styles.routeLabel}>{child.startLocation}</Text>
              <Text style={styles.routeAddress}>{child.startAddress}</Text>
            </View>
            <View style={styles.routeStop}>
              <Text style={styles.routeTime}>↓ {child.dropoffTime}</Text>
              <Text style={styles.routeLabel}>{child.endLocation}</Text>
              <Text style={styles.routeAddress}>{child.endAddress}</Text>
            </View>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Driver</Text>
      <TouchableOpacity
        style={styles.driverCard}
        activeOpacity={0.7}
        onPress={() => Linking.openURL(`tel:${child.driverPhone}`)}>
        <View style={styles.driverAvatar}>
          <Icon name='person' size={24} color='#066B64' />
        </View>
        <View style={styles.driverInfo}>
          <Text style={styles.driverName}>{child.driverName}</Text>
          <View style={styles.driverDetail}>
            <Icon name='call-outline' size={13} color='#066B64' />
            <Text style={styles.driverDetailText}>{child.driverPhone}</Text>
          </View>
          <View style={styles.driverDetail}>
            <Icon name='bus-outline' size={13} color='#066B64' />
            <Text style={styles.driverDetailText}>
              {child.busNumber} · {child.busPlate}
            </Text>
          </View>
        </View>
        <View style={styles.callIcon}>
          <Icon name='call-outline' size={20} color='#fff' />
        </View>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Emergency</Text>
      <TouchableOpacity
        style={styles.emergencyCard}
        activeOpacity={0.7}
        onPress={() => Linking.openURL('tel:18001234567')}>
        <View style={styles.emergencyIcon}>
          <Icon name='alert-circle-outline' size={24} color='#fff' />
        </View>
        <View style={styles.emergencyInfo}>
          <Text style={styles.emergencyTitle}>Emergency Helpline</Text>
          <Text style={styles.emergencySub}>Call 24/7 support</Text>
        </View>
        <View style={styles.emergencyCallIcon}>
          <Icon name='call-outline' size={20} color='#fff' />
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create(({ colors, spacings }) => ({
  scroll: {
    flex: 1,
  },
  container: {
    paddingHorizontal: spacings.md,
    paddingTop: spacings.xl,
    gap: spacings.md,
    paddingBottom: spacings.xxxxl,
  },
  switchSection: {
    gap: spacings.sm,
    marginBottom: spacings.xs,
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
    fontSize: 18,
    fontFamily: 'RubikSemiBold',
    color: colors.text,
  },
  switchMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacings.sm,
  },
  grade: {
    fontSize: 13,
    fontFamily: 'Rubik',
    color: colors.text,
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
  sectionTitle: {
    fontSize: 13,
    fontFamily: 'RubikMedium',
    color: colors.placeholderText,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  tripStatusCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacings.md,
    gap: spacings.md,
  },
  timelineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  timelineStep: {
    alignItems: 'center',
    flex: 1,
  },
  timelineDotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  timelineDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineDotCompleted: {
    backgroundColor: colors.primaryTint,
  },
  timelineDotActive: {
    backgroundColor: '#e8f2f0',
    borderWidth: 2,
    borderColor: colors.primaryTint,
  },
  timelineInnerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primaryTint,
  },
  timelineLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#e0e0e0',
    marginHorizontal: -1,
  },
  timelineLineCompleted: {
    backgroundColor: colors.primaryTint,
  },
  timelineLabel: {
    fontSize: 10,
    fontFamily: 'Rubik',
    color: '#999',
    marginTop: 6,
    textAlign: 'center',
  },
  timelineLabelCompleted: {
    color: colors.primaryTint,
    fontFamily: 'RubikMedium',
  },
  timelineLabelActive: {
    color: colors.primary,
    fontFamily: 'RubikMedium',
  },
  etaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e8f2f0',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: spacings.md,
  },
  etaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    justifyContent: 'center',
  },
  etaDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.border,
    marginHorizontal: spacings.sm,
  },
  etaLabel: {
    fontSize: 12,
    fontFamily: 'Rubik',
    color: '#666',
  },
  etaValue: {
    fontSize: 14,
    fontFamily: 'RubikSemiBold',
    color: colors.primary,
  },
  routeCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacings.md,
  },
  routeRow: {
    flexDirection: 'row',
    gap: spacings.md,
  },
  routeDotContainer: {
    alignItems: 'center',
    width: 12,
  },
  routeDotStart: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.success,
    marginTop: 4,
  },
  routeLine: {
    width: 2,
    flex: 1,
    backgroundColor: colors.primaryTint,
    marginVertical: 4,
  },
  routeDotEnd: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.error,
    marginBottom: 4,
  },
  routeInfo: {
    flex: 1,
    justifyContent: 'space-between',
    gap: spacings.lg,
  },
  routeStop: {
    gap: 2,
  },
  routeTime: {
    fontSize: 15,
    fontFamily: 'RubikSemiBold',
    color: colors.text,
  },
  routeLabel: {
    fontSize: 14,
    fontFamily: 'RubikMedium',
    color: colors.text,
  },
  routeAddress: {
    fontSize: 12,
    fontFamily: 'Rubik',
    color: colors.placeholderText,
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
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e8f2f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverInfo: {
    flex: 1,
    gap: 4,
  },
  driverName: {
    fontSize: 16,
    fontFamily: 'RubikMedium',
    color: colors.text,
  },
  driverDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  driverDetailText: {
    fontSize: 13,
    fontFamily: 'Rubik',
    color: colors.placeholderText,
  },
  callIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacings.md,
    gap: spacings.md,
    borderWidth: 1,
    borderColor: colors.error,
  },
  emergencyIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencyInfo: {
    flex: 1,
    gap: 2,
  },
  emergencyTitle: {
    fontSize: 16,
    fontFamily: 'RubikMedium',
    color: colors.error,
  },
  emergencySub: {
    fontSize: 13,
    fontFamily: 'Rubik',
    color: colors.placeholderText,
  },
  emergencyCallIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export default TripInfoSheet;
