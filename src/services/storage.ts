import AsyncStorage from '@react-native-async-storage/async-storage';
import { initialUser, MobileUserProfile } from '../data/mockData';

const KEYS = {
  USER_SESSION: '@swift_user_session',
  USER_PIN: '@swift_user_pin',
  REGISTERED_USERS: '@swift_registered_users',
  IS_LOCKED: '@swift_is_locked',
};

export interface AuthSession {
  user: MobileUserProfile;
  isLoggedIn: boolean;
  token: string;
  hasSetPin: boolean;
  lastLoginDate: string;
}

export const storageService = {
  /**
   * Save active user session
   */
  async saveUserSession(user: MobileUserProfile, token: string = 'token_swift_live_demo'): Promise<void> {
    try {
      const session: AuthSession = {
        user,
        isLoggedIn: true,
        token,
        hasSetPin: true,
        lastLoginDate: new Date().toISOString(),
      };
      await AsyncStorage.setItem(KEYS.USER_SESSION, JSON.stringify(session));
    } catch (e) {
      console.warn('Error saving session:', e);
    }
  },

  /**
   * Get active user session
   */
  async getUserSession(): Promise<AuthSession | null> {
    try {
      const raw = await AsyncStorage.getItem(KEYS.USER_SESSION);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      console.warn('Error reading session:', e);
      return null;
    }
  },

  /**
   * Clear user session on logout
   */
  async clearUserSession(): Promise<void> {
    try {
      await AsyncStorage.removeItem(KEYS.USER_SESSION);
      await AsyncStorage.setItem(KEYS.IS_LOCKED, 'true');
    } catch (e) {
      console.warn('Error clearing session:', e);
    }
  },

  /**
   * Save user 4-digit security PIN
   */
  async saveUserPin(pin: string): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.USER_PIN, pin);
    } catch (e) {
      console.warn('Error saving PIN:', e);
    }
  },

  /**
   * Get user 4-digit security PIN (defaults to '1234')
   */
  async getUserPin(): Promise<string> {
    try {
      const pin = await AsyncStorage.getItem(KEYS.USER_PIN);
      return pin || '1234';
    } catch {
      return '1234';
    }
  },

  /**
   * Verify if entered PIN matches saved PIN
   */
  async verifyPin(enteredPin: string): Promise<boolean> {
    const savedPin = await this.getUserPin();
    return enteredPin === savedPin || enteredPin === '1234'; // Allow 1234 as universal master fallback for easy pair-testing
  },

  /**
   * Check if app session is locked (requiring PIN)
   */
  async isSessionLocked(): Promise<boolean> {
    try {
      const locked = await AsyncStorage.getItem(KEYS.IS_LOCKED);
      return locked === 'true';
    } catch {
      return false;
    }
  },

  /**
   * Set app session lock status
   */
  async setSessionLocked(locked: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.IS_LOCKED, locked ? 'true' : 'false');
    } catch (e) {
      console.warn('Error setting lock status:', e);
    }
  },

  /**
   * Save newly registered user to local accounts registry
   */
  async registerNewUser(newUser: MobileUserProfile, pin: string): Promise<void> {
    try {
      const existingRaw = await AsyncStorage.getItem(KEYS.REGISTERED_USERS);
      const list: MobileUserProfile[] = existingRaw ? JSON.parse(existingRaw) : [initialUser];
      list.push(newUser);
      await AsyncStorage.setItem(KEYS.REGISTERED_USERS, JSON.stringify(list));
      await this.saveUserPin(pin);
      await this.saveUserSession(newUser);
      await this.setSessionLocked(false);
    } catch (e) {
      console.warn('Error registering user:', e);
    }
  },
};
