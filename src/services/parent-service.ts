import type {
  ApiResponse,
  ParentNextScheduleResponse,
  ParentStudentResponse,
} from '@/interfaces/api';
import client from '@/lib/axios';
import { Urls } from '@/constants/urls';

export const parentService = {
  getMyStudents: () => client.get<ApiResponse<ParentStudentResponse[]>>(Urls.myStudents),

  getNextSchedule: (studentId: number) =>
    client.get<ApiResponse<ParentNextScheduleResponse>>(Urls.nextSchedule(studentId)),
};
