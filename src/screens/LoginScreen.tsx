import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { storageService } from '../services/storage';
import { initialUser, MobileUserProfile } from '../data/mockData';

interface LoginScreenProps {
  onLoginSuccess: (user: MobileUserProfile) => void;
  onNavigateToSignup: () => void;
  onUsePinInstead?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onNavigateToSignup,
  onUsePinInstead,
}) => {
  const [email, setEmail] = useState('elisha.adamu@swiftlogistics.ng');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Required Fields', 'Please enter your email and password.');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate quick auth API call
      await new Promise((res) => setTimeout(res, 600));

      // Derive user details or use existing profile
      const user: MobileUserProfile = {
        ...initialUser,
        email: email.trim(),
        name: email.includes('@') ? email.split('@')[0].replace('.', ' ').toUpperCase() : 'Elisha Adamu',
      };

      // Save to local storage
      await storageService.saveUserSession(user);
      await storageService.setSessionLocked(false);

      setIsLoading(false);
      onLoginSuccess(user);
    } catch (e) {
      setIsLoading(false);
      Alert.alert('Login Failed', 'Could not sign in. Please try again.');
    }
  };

  const handleQuickFill = () => {
    setEmail('elisha.adamu@swiftlogistics.ng');
    setPassword('swift2026!');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Brand Banner */}
        <View style={styles.brandContainer}>
          <View style={styles.logoBadge}>
            <Ionicons name="cube" size={38} color="#22c55e" />
          </View>
          <Text style={styles.brandTitle}>SWIFT LOGISTICS</Text>
          <Text style={styles.brandTagline}>Nigeria's Fastest Delivery & Freight Network</Text>
        </View>

        {/* Form Card */}
        <View style={styles.formCard}>
          <Text style={styles.formHeader}>Welcome Back 👋</Text>
          <Text style={styles.formSubtext}>
            Sign in to track parcels, schedule pickups, and manage your shipments in Nigeria.
          </Text>

          {/* Email Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="e.g. elisha.adamu@swiftlogistics.ng"
                placeholderTextColor="#94a3b8"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          {/* Password Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Enter password (any password works)"
                placeholderTextColor="#94a3b8"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeBtn}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#64748b"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* One-Tap Demo Helper */}
          <TouchableOpacity style={styles.quickFillBtn} onPress={handleQuickFill}>
            <Ionicons name="flash-outline" size={14} color="#16a34a" />
            <Text style={styles.quickFillText}>Auto-fill Demo Credentials</Text>
          </TouchableOpacity>

          {/* Sign In Button */}
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <>
                <Text style={styles.loginBtnText}>Sign In</Text>
                <Ionicons name="arrow-forward" size={18} color="#ffffff" />
              </>
            )}
          </TouchableOpacity>

          {/* Unlock with PIN instead if already configured */}
          {onUsePinInstead && (
            <TouchableOpacity style={styles.pinShortcutBtn} onPress={onUsePinInstead}>
              <Ionicons name="keypad-outline" size={16} color="#475569" />
              <Text style={styles.pinShortcutText}>Unlock with 4-digit PIN instead</Text>
            </TouchableOpacity>
          )}

          {/* Switch to Sign Up */}
          <View style={styles.signupPromptRow}>
            <Text style={styles.signupPromptText}>Don't have an account?</Text>
            <TouchableOpacity onPress={onNavigateToSignup}>
              <Text style={styles.signupLinkText}> Create Account</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer Note */}
        <Text style={styles.footerLegal}>
          By signing in, you agree to Swift Logistics Nigeria Terms of Transit & Carriage.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 54,
    paddingBottom: 40,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoBadge: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: 1.5,
  },
  brandTagline: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
    marginTop: 4,
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  formHeader: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
  },
  formSubtext: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 6,
    marginBottom: 20,
    lineHeight: 18,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 52,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: '#0f172a',
    fontWeight: '600',
  },
  eyeBtn: {
    padding: 6,
  },
  quickFillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    marginBottom: 18,
  },
  quickFillText: {
    color: '#16a34a',
    fontSize: 12,
    fontWeight: '700',
  },
  loginBtn: {
    backgroundColor: '#16a34a',
    borderRadius: 16,
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  loginBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  pinShortcutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    paddingVertical: 10,
    gap: 6,
  },
  pinShortcutText: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '600',
  },
  signupPromptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 16,
  },
  signupPromptText: {
    color: '#64748b',
    fontSize: 13,
  },
  signupLinkText: {
    color: '#16a34a',
    fontSize: 13,
    fontWeight: '800',
  },
  footerLegal: {
    fontSize: 11,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 16,
  },
});
