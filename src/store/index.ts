import { create } from 'zustand';

export type ChildStatus = 'en_route' | 'picked_up' | 'completed';

export interface Child {
  id: string;
  name: string;
  grade: string;
  status: ChildStatus;
  driverName: string;
  driverPhone: string;
  busNumber: string;
  busPlate: string;
  pickupTime: string;
  dropoffTime: string;
  startLocation: string;
  startAddress: string;
  endLocation: string;
  endAddress: string;
  estimatedDistance: string;
  estimatedTime: string;
}

export const mockChildren: Child[] = [
  {
    id: '1',
    name: 'Aarav Sharma',
    grade: 'Grade 5-A',
    status: 'en_route',
    driverName: 'Rajesh Sharma',
    driverPhone: '+919876543210',
    busNumber: 'BUS-101',
    busPlate: 'GJ-01-AB-1234',
    pickupTime: '7:15 AM',
    dropoffTime: '2:30 PM',
    startLocation: 'Home',
    startAddress: '42 Lakeview Gardens, Mumbai',
    endLocation: 'Greenwood Academy',
    endAddress: '150 School Road, Andheri West',
    estimatedDistance: '3.2 km',
    estimatedTime: '12 min',
  },
  {
    id: '2',
    name: 'Priya Patel',
    grade: 'Grade 3-B',
    status: 'picked_up',
    driverName: 'Sunil Verma',
    driverPhone: '+919876543211',
    busNumber: 'BUS-204',
    busPlate: 'MH-02-CD-5678',
    pickupTime: '7:45 AM',
    dropoffTime: '3:00 PM',
    startLocation: 'Home',
    startAddress: '78 Rose Apartment, Borivali',
    endLocation: 'St. Marys School',
    endAddress: '25 Church Road, Bandra',
    estimatedDistance: '5.8 km',
    estimatedTime: '18 min',
  },
  {
    id: '3',
    name: 'Rohan Singh',
    grade: 'Grade 7-C',
    status: 'completed',
    driverName: 'Amit Kumar',
    driverPhone: '+919876543212',
    busNumber: 'BUS-305',
    busPlate: 'DL-03-EF-9012',
    pickupTime: '6:45 AM',
    dropoffTime: '1:45 PM',
    startLocation: 'Home',
    startAddress: '15 Sunshine Colony, Powai',
    endLocation: 'Delhi Public School',
    endAddress: '100 Education Drive, Andheri East',
    estimatedDistance: '7.1 km',
    estimatedTime: '22 min',
  },
];

interface State {
  currentChildIndex: number;
  children: Child[];
  isLoading: boolean;
  error: string | null;
}

interface Actions {
  setCurrentChildIndex: (index: number) => void;
  nextChild: () => void;
  previousChild: () => void;
  setChildren: (children: Child[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetStore: () => void;
}

type Store = State & Actions;

const initialState: State = {
  currentChildIndex: 0,
  children: mockChildren,
  isLoading: false,
  error: null,
};

export const useGlobalStore = create<Store>()(set => ({
  ...initialState,
  setCurrentChildIndex: currentChildIndex => {
    set({ currentChildIndex });
  },
  nextChild: () => {
    set(state => ({
      currentChildIndex: Math.min(state.currentChildIndex + 1, state.children.length - 1),
    }));
  },
  previousChild: () => {
    set(state => ({
      currentChildIndex: Math.max(state.currentChildIndex - 1, 0),
    }));
  },
  setChildren: children => {
    set({ children, error: null });
  },
  setLoading: isLoading => {
    set({ isLoading });
  },
  setError: error => {
    set({ error });
  },
  resetStore: () => {
    set({ ...initialState });
  },
}));
