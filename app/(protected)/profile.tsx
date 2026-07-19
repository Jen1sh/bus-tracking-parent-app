import ContactCard from '@/components/Profile/ContactCard';
import ProfileHeader from '@/components/Profile/ProfileHeader';
import SettingsTile from '@/components/Profile/SettingsTile';
import { StyledText } from '@/components/styled/StyledText';
import { useAuthContext } from '@/contexts/auth.context';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useMyStudents } from '@/hooks/use-parent';
import { useRouter } from 'expo-router';
import { Alert, Linking, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native-unistyles';

const Profile = () => {
  const router = useRouter();
  const { theme, updateTheme } = useAppTheme();
  const { user, logOut } = useAuthContext();
  const { data: students } = useMyStudents();

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: logOut },
    ]);
  };

  const displayName = user?.name ?? 'John Doe';
  const displayRole = user?.role
    ? user.role.charAt(0) + user.role.slice(1).toLowerCase()
    : 'Parent';
  const childCount = students?.length ?? 0;
  const childLabel =
    childCount > 0 ? `${childCount} ${childCount === 1 ? 'Child' : 'Children'}` : 'No children';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <ProfileHeader name={displayName} role={displayRole} busNumber={childLabel} />

        <View style={styles.section}>
          <SettingsTile
            label='Toggle Theme'
            icon={theme === 'light' ? 'sunny-outline' : 'moon'}
            showChevron={false}
            onPress={() => updateTheme(theme === 'light' ? 'dark' : 'light')}
          />
          <View style={styles.divider} />
          <SettingsTile
            label='My Children'
            icon='people-outline'
            onPress={() => router.push('/(protected)')}
          />
          <View style={styles.divider} />
          <SettingsTile
            label='Terms & Conditions'
            icon='newspaper-outline'
            onPress={() => Linking.openURL('https://example.com/terms')}
          />
        </View>

        <View style={styles.section}>
          <StyledText variant='caption' style={styles.sectionLabel}>
            SUPPORT
          </StyledText>
          <ContactCard phone='+1 (555) 123-4567' />
        </View>

        <TouchableOpacity activeOpacity={0.7} onPress={handleLogout} style={styles.logoutButton}>
          <StyledText style={styles.logoutText}>Log Out</StyledText>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create(({ colors, spacings }) => ({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: spacings.md,
    gap: spacings.lg,
    paddingBottom: spacings.xxxxl,
  },
  section: {
    gap: spacings.sm,
  },
  sectionLabel: {
    letterSpacing: 1.2,
    color: colors.placeholderText,
    paddingLeft: spacings.xs,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  logoutButton: {
    alignItems: 'center',
    paddingVertical: spacings.md,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.error,
  },
  logoutText: {
    fontSize: 15,
    fontFamily: 'RubikMedium',
    color: colors.error,
  },
}));

export default Profile;
