import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

const NotificationBadge = () => {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.button}
      activeOpacity={0.7}
      onPress={() => router.push('/(protected)/(stack)/activity')}>
      <Ionicons name='notifications-outline' size={20} color={styles.icon.color} />
      <View style={styles.dot} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create(({ colors }) => ({
  button: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    color: colors.text,
  },
  dot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: colors.error,
    borderWidth: 2,
    borderColor: colors.light,
  },
}));

export default NotificationBadge;
