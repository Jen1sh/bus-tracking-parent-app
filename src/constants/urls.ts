export const Urls = {
  login: '/auth/login',
  refresh: '/auth/refresh',
  logout: '/auth/logout',
  myStudents: '/parent/my-students',
  nextSchedule: (studentId: number) => `/parent/next-schedule/${studentId}`,
};
