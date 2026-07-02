import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

// ─── GHANA FLAG COLORS ─────────────────────────────────────────────────────

const C = {
  ghanaRed:    '#CE1126',
  ghanaGold:   '#FCD116',
  ghanaGreen:  '#006B3F',
  black:       '#111111',
  white:       '#FFFFFF',
  bg:          '#F8F7F2',
  card:        '#FFFFFF',
  textPrimary: '#1A1A1A',
  textSecondary: '#6B6B6B',
  textMuted:   '#A0A0A0',
  border:      '#E8E8E8',
  error:       '#E53935',
};

// ─── INPUT COMPONENT ─────────────────────────────────────────────────────────

function InputField({ label, placeholder, value, onChangeText, secureTextEntry, keyboardType, error }) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.inputWrap}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={[
        styles.inputBox,
        focused && styles.inputBoxFocused,
        error && styles.inputBoxError,
      ]}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={C.textMuted}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType || 'default'}
          autoCapitalize="none"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁'}</Text>
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

// ─── MAIN SCREEN ─────────────────────────────────────────────────────────────

export default function LoginScreen({ navigation }) {
  const [isLogin, setIsLogin]   = useState(true);
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [name, setName]         = useState('');
  const [confirm, setConfirm]   = useState('');
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!isLogin && !name.trim()) {
      newErrors.name = 'Full name is required';
    }
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!email.includes('@')) {
      newErrors.email = 'Enter a valid email address';
    }
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!isLogin && password !== confirm) {
      newErrors.confirm = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.replace('Main');
    }, 1500);
  };

  const handleGuestLogin = () => {
    navigation.replace('Main');
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* ── GHANA COLOR HEADER ── */}
      <View style={styles.header}>

        {/* Flag stripe background */}
        <View style={styles.flagRed} />
        <View style={styles.flagGold} />
        <View style={styles.flagGreen} />

        {/* Black star */}
        <View style={styles.starWrap}>
          <Text style={styles.starIcon}>★</Text>
        </View>

        {/* Decorative circles */}
        <View style={styles.circle1} />
        <View style={styles.circle2} />
        <View style={styles.circle3} />

        {/* Bold logo */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoHidden}>HIDDEN</Text>
          <Text style={styles.logoGhana}>GH★NA</Text>
          <View style={styles.taglineWrap}>
            <View style={styles.taglineDash} />
            <Text style={styles.tagline}>DISCOVER · EXPLORE · EXPERIENCE</Text>
            <View style={styles.taglineDash} />
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.formScroll}
        contentContainerStyle={styles.formContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Tab toggle */}
        <View style={styles.tabToggle}>
          <TouchableOpacity
            style={[styles.tabBtn, isLogin && styles.tabBtnActive]}
            onPress={() => {
              setIsLogin(true);
              setErrors({});
            }}
          >
            <Text style={[styles.tabBtnText, isLogin && styles.tabBtnTextActive]}>
              Sign In
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, !isLogin && styles.tabBtnActive]}
            onPress={() => {
              setIsLogin(false);
              setErrors({});
            }}
          >
            <Text style={[styles.tabBtnText, !isLogin && styles.tabBtnTextActive]}>
              Create Account
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form fields */}
        {!isLogin && (
          <InputField
            label="Full Name"
            placeholder="Enter your full name"
            value={name}
            onChangeText={setName}
            error={errors.name}
          />
        )}

        <InputField
          label="Email Address"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          error={errors.email}
        />

        <InputField
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          error={errors.password}
        />

        {!isLogin && (
          <InputField
            label="Confirm Password"
            placeholder="Re-enter your password"
            value={confirm}
            onChangeText={setConfirm}
            secureTextEntry
            error={errors.confirm}
          />
        )}

        {isLogin && (
          <TouchableOpacity style={styles.forgotBtn}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.submitBtn, loading && styles.submitBtnLoading]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitBtnText}>
            {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
          </Text>
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or continue with</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialBtn} onPress={handleSubmit}>
            <Text style={styles.socialBtnText}>G  Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialBtn} onPress={handleSubmit}>
            <Text style={styles.socialBtnText}>f  Facebook</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.guestBtn} onPress={handleGuestLogin}>
          <Text style={styles.guestBtnText}>Continue as Guest</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  // ── Header ──
  header: {
    height: 280,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: C.ghanaGreen,
  },

  // Flag stripes (horizontal bands like Ghana flag)
  flagRed: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '34%',
    backgroundColor: C.ghanaRed,
  },
  flagGold: {
    position: 'absolute',
    top: '34%',
    left: 0,
    right: 0,
    height: '32%',
    backgroundColor: C.ghanaGold,
  },
  flagGreen: {
    position: 'absolute',
    top: '66%',
    left: 0,
    right: 0,
    height: '34%',
    backgroundColor: C.ghanaGreen,
  },

  // Black star
  starWrap: {
    position: 'absolute',
    top: '34%',
    left: 0,
    right: 0,
    height: '32%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  starIcon: {
    fontSize: 26,
    color: C.black,
  },

  // Decorative circles overlay for depth
  circle1: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(0,0,0,0.08)',
    top: -50,
    right: -30,
  },
  circle2: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.10)',
    bottom: -20,
    left: -20,
  },
  circle3: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0,0,0,0.06)',
    bottom: 30,
    right: 30,
  },

  // Logo
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoHidden: {
    fontSize: 18,
    color: C.white,
    fontWeight: '700',
    letterSpacing: 6,
    marginBottom: 2,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  logoGhana: {
    fontSize: 46,
    color: C.white,
    fontWeight: '900',
    letterSpacing: 3,
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 8,
  },
  taglineWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  taglineDash: {
    width: 16,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  tagline: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: 1.5,
    fontWeight: '600',
  },

  // ── Form ──
  formScroll:    { flex: 1 },
  formContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },

  // Tab toggle
  tabToggle: {
    flexDirection: 'row',
    backgroundColor: '#EBEBEB',
    borderRadius: 14,
    padding: 4,
    marginBottom: 24,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabBtnActive:     { backgroundColor: C.white },
  tabBtnText:       { fontSize: 14, color: C.textMuted, fontWeight: '600' },
  tabBtnTextActive: { color: C.ghanaGreen, fontWeight: '700' },

  // Input
  inputWrap:  { marginBottom: 16 },
  inputLabel: { fontSize: 13, fontWeight: '700', color: C.textPrimary, marginBottom: 6 },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.white,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: C.border,
    gap: 10,
  },
  inputBoxFocused: { borderColor: C.ghanaGreen },
  inputBoxError:   { borderColor: C.error },
  input:           { flex: 1, fontSize: 14, color: C.textPrimary },
  eyeIcon:         { fontSize: 18 },
  errorText:       { fontSize: 12, color: C.error, marginTop: 4, marginLeft: 4 },

  // Forgot
  forgotBtn:  { alignSelf: 'flex-end', marginBottom: 20, marginTop: -8 },
  forgotText: { fontSize: 13, color: C.ghanaGreen, fontWeight: '600' },

  // Submit
  submitBtn: {
    backgroundColor: C.ghanaGreen,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  submitBtnLoading: { backgroundColor: C.textMuted },
  submitBtnText:    { fontSize: 16, color: C.white, fontWeight: '700' },

  // Divider
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  dividerLine: { flex: 1, height: 0.5, backgroundColor: C.border },
  dividerText: { fontSize: 12, color: C.textMuted },

  // Social
  socialRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  socialBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: 'center',
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
  },
  socialBtnText: { fontSize: 14, color: C.textPrimary, fontWeight: '600' },

  // Guest
  guestBtn: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: C.border,
  },
  guestBtnText: { fontSize: 14, color: C.textSecondary, fontWeight: '600' },
});