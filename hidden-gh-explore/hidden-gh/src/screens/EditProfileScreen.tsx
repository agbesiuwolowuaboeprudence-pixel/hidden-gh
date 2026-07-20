import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Button } from '../components/ui/Button';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { userProfile } from '../data/mockData';
import { radius, spacing, typography, useTheme, type Palette } from '../theme';
import type { RootStackScreenProps } from '../types/navigation';

type Props = RootStackScreenProps<'EditProfile'>;

const FIELDS: {
  key: 'name' | 'email' | 'phone' | 'location';
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
}[] = [
  { key: 'name', label: 'Full Name', icon: 'person-outline' },
  { key: 'email', label: 'Email', icon: 'mail-outline', keyboardType: 'email-address' },
  { key: 'phone', label: 'Phone', icon: 'call-outline', keyboardType: 'phone-pad' },
  { key: 'location', label: 'Location', icon: 'location-outline' },
];

export default function EditProfileScreen({ navigation }: Props) {
  const { colors, scheme } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [form, setForm] = useState({
    name: userProfile.name,
    email: userProfile.email,
    phone: userProfile.phone,
    location: userProfile.location,
  });

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar
        barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      <ScreenHeader title="Edit Profile" onBack={() => navigation.goBack()} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrap}>
            <Image source={{ uri: userProfile.avatar }} style={styles.avatar} />
            <Pressable style={styles.avatarEdit}>
              <Ionicons name="camera" size={16} color={colors.white} />
            </Pressable>
          </View>
          <Text style={styles.changePhoto}>Change photo</Text>
        </View>

        <View style={styles.form}>
          {FIELDS.map((f) => (
            <View key={f.key} style={styles.field}>
              <Text style={styles.label}>{f.label}</Text>
              <View style={styles.inputBox}>
                <Ionicons name={f.icon} size={18} color={colors.textMuted} />
                <TextInput
                  style={styles.input}
                  value={form[f.key]}
                  onChangeText={(v) => setForm((prev) => ({ ...prev, [f.key]: v }))}
                  keyboardType={f.keyboardType ?? 'default'}
                  placeholderTextColor={colors.textMuted}
                  autoCapitalize={f.key === 'email' ? 'none' : 'sentences'}
                />
              </View>
            </View>
          ))}
        </View>

        <Button
          label="Save Changes"
          icon="checkmark"
          fullWidth
          onPress={() => navigation.goBack()}
          style={styles.save}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.background },
    scroll: { paddingHorizontal: spacing.lg, paddingBottom: 40 },
    avatarSection: { alignItems: 'center', marginVertical: spacing.lg, gap: spacing.sm },
    avatarWrap: { position: 'relative' },
    avatar: {
      width: 96,
      height: 96,
      borderRadius: 48,
      borderWidth: 2,
      borderColor: colors.primary,
    },
    avatarEdit: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 3,
      borderColor: colors.background,
    },
    changePhoto: { ...typography.caption, color: colors.primary, fontWeight: '700' },
    form: { gap: spacing.md },
    field: { gap: 6 },
    label: { ...typography.caption, color: colors.textSecondary, fontWeight: '600' },
    inputBox: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      paddingHorizontal: spacing.md,
      borderWidth: 1.5,
      borderColor: colors.border,
    },
    input: { flex: 1, ...typography.body, color: colors.textPrimary, paddingVertical: 14 },
    save: { marginTop: spacing.xl },
  });
