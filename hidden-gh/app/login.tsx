import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
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

import { Button } from '@/src/components/ui/Button';
import { useAuthStore } from '@/src/store/authStore';
import { ApiError } from '@/src/services/api';
import { Alert } from 'react-native';
import { radius, spacing, typography, useTheme, type Palette } from '@/src/theme';

interface InputFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address';
  error?: string;
}

function InputField({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType = 'default',
  error,
}: InputFieldProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.inputWrap}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View
        style={[
          styles.inputBox,
          focused && styles.inputBoxFocused,
          error ? styles.inputBoxError : null,
        ]}
      >
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize="none"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {secureTextEntry ? (
          <Pressable onPress={() => setShowPassword(!showPassword)} hitSlop={8}>
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.textMuted}
            />
          </Pressable>
        ) : null}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

export default function LoginScreen() {
  const { colors, scheme } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { login, register } = useAuthStore();
  const continueAsGuest = useAuthStore((s) => s.continueAsGuest);

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Minimum 6 characters';
    if (!isLogin) {
      if (!name.trim()) e.name = 'Name is required';
      if (password !== confirm) e.confirm = 'Passwords do not match';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setFormError('');
    setLoading(true);
    try {
      if (isLogin) {
        await login({ email, password });
      } else {
        await register({ fullName: name, email, password });
      }
      router.replace('/(tabs)');
    } catch (err) {
      console.warn('[login] Auth error', err);
      let message = 'Unable to authenticate. Please try again.';
      if (err instanceof ApiError) {
        if (err.status === 408) {
          message = 'Unable to reach the server. Please check your connection and try again.';
        } else if (err.message) {
          message = err.message;
        }
      } else if (err instanceof Error && err.message) {
        message = err.message;
      }
      setFormError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    // Placeholder activation: open a friendly alert explaining next steps.
    // To fully enable Google Sign-In you will need OAuth client IDs and
    // backend endpoints. See README notes printed to the console.
    console.log('Google sign-in pressed');
    Alert.alert(
      'Google Sign-In',
      'Social sign-in is not yet configured. To enable it, add Google OAuth credentials and backend support.',
      [{ text: 'OK' }]
    );
  };

  const handleApple = async () => {
    console.log('Apple sign-in pressed');
    Alert.alert(
      'Apple Sign-In',
      'Apple sign-in is not configured in this build. Configure Apple auth on the backend and the app to enable it.',
      [{ text: 'OK' }]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar
        barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoSection}>
          <View style={styles.logoRow}>
            <Text style={styles.logoHidden}>Hidden </Text>
            <Text style={styles.logoGhana}>Ghana</Text>
          </View>
          <Text style={styles.tagline}>Discover. Explore. Experience.</Text>
        </View>

        <View style={styles.toggleRow}>
          <Pressable
            style={[styles.toggleBtn, isLogin && styles.toggleBtnActive]}
            onPress={() => { setIsLogin(true); setErrors({}); setFormError(''); }}
          >
            <Text style={[styles.toggleText, isLogin && styles.toggleTextActive]}>Sign In</Text>
          </Pressable>
          <Pressable
            style={[styles.toggleBtn, !isLogin && styles.toggleBtnActive]}
            onPress={() => { setIsLogin(false); setErrors({}); setFormError(''); }}
          >
            <Text style={[styles.toggleText, !isLogin && styles.toggleTextActive]}>
              Create Account
            </Text>
          </Pressable>
        </View>

        <View style={styles.form}>
          {!isLogin ? (
            <InputField
              label="Full Name"
              placeholder="Your full name"
              value={name}
              onChangeText={setName}
              error={errors.name}
            />
          ) : null}
          <InputField
            label="Email"
            placeholder="you@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            error={errors.email}
          />
          <InputField
            label="Password"
            placeholder="Enter password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={errors.password}
          />
          {!isLogin ? (
            <InputField
              label="Confirm Password"
              placeholder="Confirm password"
              value={confirm}
              onChangeText={setConfirm}
              secureTextEntry
              error={errors.confirm}
            />
          ) : null}

          {isLogin ? (
            <Pressable style={styles.forgotBtn}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </Pressable>
          ) : null}

          <Button
            label={isLogin ? 'Sign In' : 'Create Account'}
            onPress={handleSubmit}
            loading={loading}
            fullWidth
            style={styles.submitBtn}
          />
          {formError ? <Text style={styles.formErrorText}>{formError}</Text> : null}
        </View>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or continue with</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.socialRow}>
          <Pressable style={styles.socialBtn} onPress={handleGoogle}>
            <Ionicons name="logo-google" size={22} color={colors.textPrimary} />
          </Pressable>
          <Pressable style={styles.socialBtn} onPress={handleApple}>
            <Ionicons name="logo-apple" size={22} color={colors.textPrimary} />
          </Pressable>
          <Pressable
            style={styles.socialBtn}
            onPress={() => {
              continueAsGuest();
              router.replace('/(tabs)');
            }}
          >
            <Ionicons name="person-outline" size={22} color={colors.textPrimary} />
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.background },
    scroll: { paddingHorizontal: spacing.lg, paddingTop: 60, paddingBottom: 40 },
    logoSection: { alignItems: 'center', marginBottom: spacing.xl },
    logoRow: { flexDirection: 'row', alignItems: 'baseline' },
    logoHidden: {
      fontSize: 28,
      color: colors.textPrimary,
      fontStyle: 'italic',
      fontWeight: '600',
    },
    logoGhana: { fontSize: 32, color: colors.primary, fontWeight: '800' },
    tagline: { ...typography.caption, color: colors.textMuted, marginTop: spacing.sm },
    toggleRow: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      padding: 4,
      marginBottom: spacing.xl,
      borderWidth: 1,
      borderColor: colors.border,
    },
    toggleBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: radius.sm },
    toggleBtnActive: { backgroundColor: colors.primary },
    toggleText: { ...typography.bodyBold, color: colors.textSecondary },
    toggleTextActive: { color: colors.white },
    form: { gap: spacing.md },
    inputWrap: { gap: 6 },
    inputLabel: { ...typography.caption, color: colors.textSecondary, fontWeight: '600' },
    inputBox: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      paddingHorizontal: spacing.md,
      borderWidth: 1.5,
      borderColor: colors.border,
    },
    inputBoxFocused: { borderColor: colors.primary },
    inputBoxError: { borderColor: colors.danger },
    input: { flex: 1, ...typography.body, color: colors.textPrimary, paddingVertical: 14 },
    errorText: { ...typography.caption, color: colors.danger },
    formErrorText: { ...typography.bodyBold, color: colors.danger, marginTop: spacing.sm, textAlign: 'center' },
    forgotBtn: { alignSelf: 'flex-end' },
    forgotText: { ...typography.caption, color: colors.primary, fontWeight: '600' },
    serverErrorBox: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      backgroundColor: colors.dangerMuted,
      borderRadius: radius.md,
      padding: spacing.md,
    },
    serverErrorText: { ...typography.caption, color: colors.danger, flex: 1 },
    submitBtn: { marginTop: spacing.sm },
    dividerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: spacing.xl,
      gap: spacing.md,
    },
    dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
    dividerText: { ...typography.caption, color: colors.textMuted },
    socialRow: { flexDirection: 'row', justifyContent: 'center', gap: spacing.md },
    socialBtn: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
