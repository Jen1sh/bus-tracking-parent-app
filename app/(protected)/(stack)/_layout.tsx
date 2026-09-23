import ScreenHeader from '@/components/ScreenHeader';
import { Stack } from 'expo-router';

export default function StackLayout() {
  return (
    <Stack
      screenOptions={{
        header: () => <ScreenHeader title='Map' />,
      }}>
      <Stack.Screen name='map' />
      <Stack.Screen
        name='trip-detail'
        options={{
          header: () => <ScreenHeader title='Trip Status' />,
        }}
      />
      <Stack.Screen
        name='activity'
        options={{
          header: () => <ScreenHeader title='Activity' />,
        }}
      />
    </Stack>
  );
}
