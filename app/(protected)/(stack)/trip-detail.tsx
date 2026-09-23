import ChildStatusBadge from '@/components/home/ChildStatusBadge';
import { useGlobalStore, type ChildStatus } from '@/store';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native-unistyles';

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

const TripDetailScreen = () => {
  const children = useGlobalStore(s => s.children);
  const currentChildIndex = useGlobalStore(s => s.currentChildIndex);
  const child = children[currentChildIndex];

  if (!child) return null;

  const activeStep = getActiveStep(child.status);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.studentCard}>
          <View style={styles.avatarLarge}>
            <Ionicons name='person' size={32} color='#fff' />
          </View>
          <View style={styles.studentInfo}>
            <Text style={styles.studentName}>{child.name}</Text>
            <Text style={styles.studentGrade}>{child.grade}</Text>
          </View>
          <ChildStatusBadge status={child.status} />
        </View>

        <View style={styles.timelineCard}>
          <Text style={styles.sectionTitle}>Trip Timeline</Text>
          <View style={styles.timeline}>
            {TRIP_STEPS.map((step, index) => {
              const isCompleted = index < activeStep;
              const isActive = index === activeStep;
              const isLast = index === TRIP_STEPS.length - 1;

              return (
                <View key={step} style={styles.timelineStep}>
                  <View style={styles.timelineDotCol}>
                    <View
                      style={[
                        styles.timelineDot,
                        isCompleted && styles.timelineDotCompleted,
                        isActive && styles.timelineDotActive,
                      ]}>
                      {isCompleted && <Ionicons name='checkmark' size={12} color='#fff' />}
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
                  <View style={styles.timelineContent}>
                    <Text
                      style={[
                        styles.timelineLabel,
                        isCompleted && styles.timelineLabelCompleted,
                        isActive && styles.timelineLabelActive,
                      ]}>
                      {step}
                    </Text>
                    {isActive && (
                      <Text style={styles.timelineDesc}>
                        {child.status === 'en_route'
                          ? 'Driver is heading to pickup location'
                          : child.status === 'picked_up'
                            ? `${child.name} has been picked up`
                            : `${child.name} has arrived at ${child.endLocation}`}
                      </Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Route Details</Text>
          <View style={styles.infoRow}>
            <View style={styles.infoIconCol}>
              <View style={styles.routeDotGreen} />
              <View style={styles.routeLine} />
              <View style={styles.routeDotRed} />
            </View>
            <View style={styles.infoContentCol}>
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
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create(({ colors, spacings }) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacings.md,
    gap: spacings.md,
    paddingBottom: spacings.xxxxl,
  },
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacings.md,
    gap: spacings.md,
  },
  avatarLarge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  studentInfo: {
    flex: 1,
    gap: 2,
  },
  studentName: {
    fontSize: 18,
    fontFamily: 'RubikSemiBold',
    color: colors.text,
  },
  studentGrade: {
    fontSize: 13,
    fontFamily: 'Rubik',
    color: colors.placeholderText,
  },
  timelineCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacings.md,
    gap: spacings.md,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: 'RubikMedium',
    color: colors.placeholderText,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  timeline: {
    gap: 0,
  },
  timelineStep: {
    flexDirection: 'row',
    gap: spacings.md,
  },
  timelineDotCol: {
    alignItems: 'center',
    width: 24,
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
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
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primaryTint,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#e0e0e0',
    minHeight: 40,
  },
  timelineLineCompleted: {
    backgroundColor: colors.primaryTint,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: spacings.lg,
    gap: 2,
  },
  timelineLabel: {
    fontSize: 15,
    fontFamily: 'RubikMedium',
    color: '#999',
  },
  timelineLabelCompleted: {
    color: colors.primaryTint,
  },
  timelineLabelActive: {
    color: colors.primary,
    fontFamily: 'RubikSemiBold',
  },
  timelineDesc: {
    fontSize: 12,
    fontFamily: 'Rubik',
    color: colors.placeholderText,
    marginTop: 2,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacings.md,
    gap: spacings.md,
  },
  infoRow: {
    flexDirection: 'row',
    gap: spacings.md,
  },
  infoIconCol: {
    alignItems: 'center',
    width: 12,
  },
  routeDotGreen: {
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
  routeDotRed: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.error,
    marginBottom: 4,
  },
  infoContentCol: {
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
}));

export default TripDetailScreen;
