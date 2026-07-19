import { parentService } from '@/services/parent-service';
import { useQuery } from '@tanstack/react-query';

export const useMyStudents = () =>
  useQuery({
    queryKey: ['my-students'],
    queryFn: async () => {
      const { data } = await parentService.getMyStudents();
      if (!data.success || !data.data) {
        throw new Error(data.message ?? 'Failed to fetch students');
      }
      return data.data;
    },
  });

export const useNextSchedule = (studentId: number) =>
  useQuery({
    queryKey: ['next-schedule', studentId],
    queryFn: async () => {
      const { data } = await parentService.getNextSchedule(studentId);
      if (!data.success || !data.data) {
        throw new Error(data.message ?? 'Failed to fetch schedule');
      }
      return data.data;
    },
    enabled: !!studentId,
  });
