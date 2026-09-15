import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Vibration,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { storageService } from '../services/storage';
import { initialUser, MobileUserProfile } from '../data/mockData';

interface PinScreenProps {
  user?: MobileUserProfile;
  onUnlockSuccess: () => void;
  onSwitchToPassword: () => void;
}

export const PinScreen: React.FC<PinScreenProps> = ({
  user = initialUser,
  onUnlockSuccess,
  onSwitchToPassword,
}) => {
  const [pin, setPin] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleKeyPress = (digit: string) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setErrorMessage('');

      if (nextPin.length === 4) {
        verifyEnteredPin(nextPin);
      }
    }
  };

  const handleDelete = () => {
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
      setErrorMessage('');
    }
  };

  const verifyEnteredPin = async (inputPin: string) => {
    const isValid = await storageService.verifyPin(inputPin);
    if (isValid) {
      await storageService.setSessionLocked(false);
      onUnlockSuccess();
    } else {
      if (Platform.OS !== 'web') {
        Vibration.vibrate(300);
      }
      setErrorMessage('Incorrect PIN. Please try again (Demo default is 1234)');
      setPin('');
    }
  };

  const handleBiometricUnlock = async () => {
    // Quick biometric unlock simulation
    await storageService.setSessionLocked(false);
    onUnlockSuccess();
  };

  return (
    <View style={styles.container}>
      {/* User Header */}
      <View style={styles.header}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarInitial}>
            {user.name ? user.name.charAt(0).toUpperCase() : 'E'}
          </Text>
        </View>
        <Text style={styles.welcomeText}>Welcome back,</Text>
        <Text style={styles.userName}>{user.name || 'Elisha Adamu'}</Text>
        <Text style={styles.instructionText}>Enter 4-digit PIN to unlock Swift Logistics</Text>
      </View>

      {/* PIN Dots */}
      <View style={styles.dotsRow}>
        {[0, 1, 2, 3].map((index) => {
          const isFilled = pin.length > index;
          return (
            <View
              key={index}
              style={[
                styles.dot,
                isFilled && styles.filledDot,
                errorMessage ? styles.errorDot : null,
              ]}
            />
          );
        })}
      </View>

      {/* Error Message */}
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : (
        <Text style={styles.hintText}>Default test PIN: 1234</Text>
      )}

      {/* Numerical Keypad */}
      <View style={styles.keypadContainer}>
        {[
          ['1', '2', '3'],
          ['4', '5', '6'],
          ['7', '8', '9'],
        ].map((row, rowIndex) => (
          <View key={rowIndex} style={styles.keyRow}>
            {row.map((digit) => (
              <TouchableOpacity
                key={digit}
                style={styles.keyButton}
                onPress={() => handleKeyPress(digit)}
                activeOpacity={0.6}
              >
                <Text style={styles.keyText}>{digit}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {/* Bottom Keypad Row: FaceID / 0 / Backspace */}
        <View style={styles.keyRow}>
          <TouchableOpacity
            style={[styles.keyButton, styles.specialKey]}
            onPress={handleBiometricUnlock}
            activeOpacity={0.6}
          >
            <Ionicons name="finger-print-outline" size={28} color="#16a34a" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.keyButton}
            onPress={() => handleKeyPress('0')}
            activeOpacity={0.6}
          >
            <Text style={styles.keyText}>0</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.keyButton, styles.specialKey]}
            onPress={handleDelete}
            activeOpacity={0.6}
          >
            <Ionicons name="backspace-outline" size={26} color="#475569" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Switch to Password */}
      <TouchableOpacity style={styles.switchButton} onPress={onSwitchToPassword}>
        <Ionicons name="lock-open-outline" size={16} color="#16a34a" />
        <Text style={styles.switchButtonText}>Sign In with Email & Password</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 30,
    paddingTop: 70,
    paddingBottom: 40,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
  },
  avatarCircle: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  avatarInitial: {
    fontSize: 30,
    fontWeight: '900',
    color: '#22c55e',
  },
  welcomeText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
  userName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0f172a',
    marginTop: 2,
  },
  instructionText: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 8,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 20,
    marginVertical: 10,
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    backgroundColor: 'transparent',
  },
  filledDot: {
    backgroundColor: '#16a34a',
    borderColor: '#16a34a',
    transform: [{ scale: 1.15 }],
  },
  errorDot: {
    borderColor: '#ef4444',
    backgroundColor: '#fecaca',
  },
  hintText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    fontWeight: '700',
    textAlign: 'center',
  },
  keypadContainer: {
    width: '100%',
    maxWidth: 290,
  },
  keyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  keyButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  specialKey: {
    backgroundColor: '#f1f5f9',
  },
  keyText: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0f172a',
  },
  switchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  switchButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#16a34a',
  },
});
