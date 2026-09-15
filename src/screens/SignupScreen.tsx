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
import { MobileUserProfile } from '../data/mockData';

interface SignupScreenProps {
  onSignupSuccess: (user: MobileUserProfile) => void;
  onNavigateToLogin: () => void;
}

export const SignupScreen: React.FC<SignupScreenProps> = ({
  onSignupSuccess,
  onNavigateToLogin,
}) => {
  const [fullName, setFullName] = useState('Elisha Adamu');
  const [email, setEmail] = useState('elisha.adamu@swiftlogistics.ng');
  const [phone, setPhone] = useState('+234 803 456 7890');
  const [password, setPassword] = useState('password123');
  const [pin, setPin] = useState('1234');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Required Fields', 'Please fill in all required fields.');
      return;
    }

    if (pin.length !== 4 || !/^\d+$/.test(pin)) {
      Alert.alert('Invalid PIN', 'Please choose a 4-digit numeric security PIN.');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate account creation
      await new Promise((res) => setTimeout(res, 600));

      const randomIdSuffix = Math.floor(1000 + Math.random() * 9000);
      const newUser: MobileUserProfile = {
        id: `usr-ng-${randomIdSuffix}`,
        name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        tier: 'Gold Priority Member',
        memberId: `NG-${randomIdSuffix}-8920`,
        membershipId: `NG-${randomIdSuffix}-8920`,
        date: 'March 2026',
        memberSince: 'March 2026',
        coins: 500,
        walletBalance: 25000, // Welcome bonus of ₦25,000
        activeShipments: 0,
        completedShipments: 0,
        rating: 5.0,
        totalShipments: 0,
        address: 'Plot 14 Admiralty Way, Lekki Phase 1, Lagos, Nigeria',
      };

      // Save user & PIN into device local storage
      await storageService.registerNewUser(newUser, pin);

      setIsLoading(false);
      Alert.alert(
        'Welcome to Swift Logistics! 🚀',
        `Account created successfully with a ₦25,000 welcome logistics credit!\nYour 4-digit security PIN is ${pin}.`,
        [
          {
            text: 'Get Started',
            onPress: () => onSignupSuccess(newUser),
          },
        ]
      );
    } catch (e) {
      setIsLoading(false);
      Alert.alert('Registration Failed', 'Could not complete registration. Please try again.');
    }
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
        {/* Header navigation */}
        <TouchableOpacity style={styles.backBtn} onPress={onNavigateToLogin}>
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
          <Text style={styles.backText}>Back to Sign In</Text>
        </TouchableOpacity>

        {/* Brand Title */}
        <View style={styles.headerBlock}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Join thousands of Nigerians shipping faster with Swift Logistics.
          </Text>
        </View>

        {/* Signup Form */}
        <View style={styles.formCard}>
          {/* Full Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={20} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Elisha Adamu"
                placeholderTextColor="#94a3b8"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>
          </View>

          {/* Email Address */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="name@domain.com"
                placeholderTextColor="#94a3b8"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          {/* Nigerian Phone Number */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nigerian Phone Number</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="call-outline" size={20} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="+234 803 456 7890"
                placeholderTextColor="#94a3b8"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Choose account password"
                placeholderTextColor="#94a3b8"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>
          </View>

          {/* 4-digit Security PIN */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>4-Digit Security Unlock PIN</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="keypad-outline" size={20} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="e.g. 1234"
                placeholderTextColor="#94a3b8"
                keyboardType="number-pad"
                maxLength={4}
                value={pin}
                onChangeText={setPin}
              />
            </View>
            <Text style={styles.pinHelperText}>
              Used to instantly unlock your app without re-typing passwords.
            </Text>
          </View>

          {/* Create Account Button */}
          <TouchableOpacity
            style={styles.signupBtn}
            onPress={handleSignup}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <>
                <Text style={styles.signupBtnText}>Create Account</Text>
                <Ionicons name="checkmark-circle" size={20} color="#ffffff" />
              </>
            )}
          </TouchableOpacity>

          {/* Switch to Login */}
          <View style={styles.loginPromptRow}>
            <Text style={styles.loginPromptText}>Already have an account?</Text>
            <TouchableOpacity onPress={onNavigateToLogin}>
              <Text style={styles.loginLinkText}> Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    paddingTop: 48,
    paddingBottom: 40,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 6,
  },
  backText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  headerBlock: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 6,
    lineHeight: 20,
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
  pinHelperText: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 4,
    marginLeft: 4,
  },
  signupBtn: {
    backgroundColor: '#16a34a',
    borderRadius: 16,
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 10,
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  signupBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  loginPromptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 16,
  },
  loginPromptText: {
    color: '#64748b',
    fontSize: 13,
  },
  loginLinkText: {
    color: '#16a34a',
    fontSize: 13,
    fontWeight: '800',
  },
});
