import ChildCarousel from '@/components/home/ChildCarousel';
import { StyledText } from '@/components/styled/StyledText';
import { useMyStudents } from '@/hooks/use-parent';
import type { ParentNextScheduleResponse, ParentStudentResponse } from '@/interfaces/api';
import { parentService } from '@/services/parent-service';
import { useGlobalStore, type Child, type ChildStatus } from '@/store';
import { useQueries } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import { useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native-unistyles';

const TRIP_STATUS_MAP: Record<string, ChildStatus> = {
  PENDING: 'en_route',
  ACTIVE: 'picked_up',
  COMPLETED: 'completed',
};

interface ScheduleData {
  studentId: number;
  schedule: ParentNextScheduleResponse;
}

const Home = () => {
  const setChildren = useGlobalStore(s => s.setChildren);
  const setLoading = useGlobalStore(s => s.setLoading);
  const setError = useGlobalStore(s => s.setError);

  const { data: students, isLoading: studentsLoading, error: studentsError } = useMyStudents();

  const queries = (students ?? []).map((student: ParentStudentResponse) => ({
    queryKey: ['next-schedule', student.id],
    queryFn: async (): Promise<ScheduleData> => {
      const { data } = await parentService.getNextSchedule(student.id);
      if (!data.success || !data.data) {
        throw new Error(data.message ?? 'Failed to fetch schedule');
      }
      return { studentId: student.id, schedule: data.data };
    },
    enabled: !!students && students.length > 0,
  }));

  const scheduleResults = useQueries({ queries }) as UseQueryResult<ScheduleData, Error>[];

  const allLoaded =
    scheduleResults.length > 0 ? scheduleResults.every(r => r.isSuccess || r.isError) : false;

  useEffect(() => {
    if (studentsLoading) {
      setLoading(true);
      return;
    }

    if (studentsError) {
      setError(studentsError.message);
      setLoading(false);
      return;
    }

    if (!students || students.length === 0) {
      setChildren([]);
      setLoading(false);
      return;
    }

    if (!allLoaded) {
      setLoading(true);
      return;
    }

    const scheduleMap = new Map(
      scheduleResults
        .filter(r => r.isSuccess && r.data)
        .map(r => [r.data!.studentId, r.data!.schedule]),
    );

    const children: Child[] = students.map((student, index) => {
      const schedule = scheduleMap.get(student.id);

      return {
        id: String(student.id),
        name: student.name,
        grade: `Student #${index + 1}`,
        status: schedule?.trip?.status
          ? (TRIP_STATUS_MAP[schedule.trip.status] ?? 'en_route')
          : 'en_route',
        driverName: 'Loading...',
        driverPhone: '+0000000000',
        busNumber: schedule?.bus ? `BUS-${schedule.bus.busId}` : 'Not assigned',
        busPlate: schedule?.bus?.plate ?? '---',
        pickupTime: schedule?.trip?.startTime
          ? new Date(schedule.trip.startTime).toLocaleTimeString([], {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            })
          : '--:--',
        dropoffTime: '--:--',
        startLocation: 'Home',
        startAddress: 'Address pending',
        endLocation: schedule?.route?.name ?? 'School',
        endAddress: schedule?.route?.name ?? 'School address pending',
        estimatedDistance: '--',
        estimatedTime: '--',
      };
    });

    setChildren(children);
    setLoading(false);
  }, [
    students,
    studentsLoading,
    studentsError,
    allLoaded,
    scheduleResults,
    setChildren,
    setLoading,
    setError,
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headerSection}>
          <StyledText variant='title'>My Children</StyledText>
        </View>

        <ChildCarousel />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create(({ spacings }) => ({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: spacings.md,
    gap: spacings.sm,
  },
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
}));

export default Home;
