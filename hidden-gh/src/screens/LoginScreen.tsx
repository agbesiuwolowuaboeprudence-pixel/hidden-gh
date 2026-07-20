import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import * as AuthSession from 'expo-auth-session';
import * as AppleAuthentication from 'expo-apple-authentication';
import Constants from 'expo-constants';
import { socialLogin } from '../services/authService';
import { ApiError } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { Alert } from 'react-native';
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

import { Button } from '../components/ui/Button';
import { radius, spacing, typography, useTheme, type Palette } from '../theme';
import type { RootStackScreenProps } from '../types/navigation';

type Props = RootStackScreenProps<'Login'>;

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

export default function LoginScreen({ navigation }: Props) {
  const { colors, scheme } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Enter a valid email';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Minimum 6 characters';
    if (!isLogin) {
      if (!name.trim()) newErrors.name = 'Name is required';
      if (password !== confirm) newErrors.confirm = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const authLogin = useAuthStore((s) => s.login);
  const authRegister = useAuthStore((s) => s.register);
  const continueAsGuest = useAuthStore((s) => s.continueAsGuest);

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      if (isLogin) {
        await authLogin({ email, password });
      } else {
        await authRegister({ fullName: name, email, password });
      }
      navigation.replace('Main');
    } catch (err) {
      if (err instanceof ApiError) {
        Alert.alert('Authentication failed', err.message);
      } else if (err instanceof Error) {
        Alert.alert('Error', err.message);
      } else {
        Alert.alert('Error', 'An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    const googleClientId = (Constants.manifest as any)?.extra?.googleClientId || '';
    if (!googleClientId) {
      Alert.alert('Google Sign-In not configured', 'Set googleClientId in app config (app.json extra)');
      return;
    }

    const redirectUri = AuthSession.makeRedirectUri({ useProxy: true });
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
      googleClientId
    )}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=id_token&scope=openid%20email%20profile&nonce=${Math.random()
      .toString(36)
      .slice(2)}`;

    try {
      setLoading(true);
      const result = await AuthSession.startAsync({ authUrl });
      if (result.type === 'success' && (result as any).params?.id_token) {
        const idToken = (result as any).params.id_token as string;
        const user = await socialLogin('google', idToken);
        useAuthStore.getState().setAuth(user);
        navigation.replace('Main');
      } else {
        Alert.alert('Google Sign-In cancelled');
      }
    } catch (err) {
      Alert.alert('Google Sign-In failed', (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleApple = async () => {
    try {
      setLoading(true);
      const available = await AppleAuthentication.isAvailableAsync();
      if (!available) {
        Alert.alert('Apple Sign-In not available on this device');
        return;
      }
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [AppleAuthentication.AppleAuthenticationScope.FULL_NAME, AppleAuthentication.AppleAuthenticationScope.EMAIL],
      });
      const idToken = (credential as any).identityToken as string | undefined;
      if (!idToken) {
        Alert.alert('Apple Sign-In failed', 'No identity token returned');
        return;
      }
      const user = await socialLogin('apple', idToken);
      useAuthStore.getState().setAuth(user);
      navigation.replace('Main');
    } catch (err) {
      Alert.alert('Apple Sign-In failed', (err as Error).message);
    } finally {
      setLoading(false);
    }
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
            onPress={() => setIsLogin(true)}
          >
            <Text style={[styles.toggleText, isLogin && styles.toggleTextActive]}>
              Sign In
            </Text>
          </Pressable>
          <Pressable
            style={[styles.toggleBtn, !isLogin && styles.toggleBtnActive]}
            onPress={() => setIsLogin(false)}
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
        </View>
        <View style={{ alignItems: 'center', marginTop: spacing.md }}>
          <Pressable onPress={() => { continueAsGuest(); navigation.replace('Main'); }}>
            <Text style={{ ...typography.caption, color: colors.textMuted }}>Continue as guest</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const createStyles = (colors: Palette) => StyleSheet.create({
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
  forgotBtn: { alignSelf: 'flex-end' },
  forgotText: { ...typography.caption, color: colors.primary, fontWeight: '600' },
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
