import type { ParentNextScheduleResponse, ParentStudentResponse } from '@/interfaces/api';
import { useQuery } from '@tanstack/react-query';

const DUMMY_STUDENTS: ParentStudentResponse[] = [
  { id: 1, name: 'Alice Johnson' },
  { id: 2, name: 'Bob Smith' },
];

const DUMMY_SCHEDULES: Record<number, ParentNextScheduleResponse> = {
  1: {
    student: { id: 1, name: 'Alice Johnson' },
    bus: { busId: 1, plate: 'BUS-101', capacity: 40 },
    trip: {
      tripId: 1,
      startTime: '2026-07-20T08:30:00',
      endTime: null,
      date: '2026-07-20',
      status: 'PENDING',
    },
    route: { routeId: 1, name: 'Downtown East — School #42' },
  },
  2: {
    student: { id: 2, name: 'Bob Smith' },
    bus: { busId: 2, plate: 'BUS-202', capacity: 30 },
    trip: {
      tripId: 2,
      startTime: '2026-07-20T09:00:00',
      endTime: null,
      date: '2026-07-20',
      status: 'ACTIVE',
    },
    route: { routeId: 2, name: 'Westside — School #42' },
  },
};

export const useMyStudents = () =>
  useQuery({
    queryKey: ['my-students'],
    queryFn: async () => DUMMY_STUDENTS,
  });

export const useNextSchedule = (studentId: number) =>
  useQuery({
    queryKey: ['next-schedule', studentId],
    queryFn: async () => DUMMY_SCHEDULES[studentId] ?? null,
    enabled: !!studentId,
  });
