export interface ParentStudentResponse {
  id: number;
  name: string;
}

export interface StudentInfo {
  id: number;
  name: string;
}

export interface BusInfo {
  busId: number;
  plate: string;
  capacity: number;
}

export type TripStatus = 'PENDING' | 'ACTIVE' | 'COMPLETED';

export interface TripInfo {
  tripId: number;
  startTime: string | null;
  endTime: string | null;
  date: string | null;
  status: TripStatus;
}

export interface RouteInfo {
  routeId: number;
  name: string;
}

export interface ParentNextScheduleResponse {
  student: StudentInfo;
  bus: BusInfo | null;
  trip: TripInfo | null;
  route: RouteInfo | null;
}
