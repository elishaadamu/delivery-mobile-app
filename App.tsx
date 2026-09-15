import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import HomeScreen from './src/screens/HomeScreen';
import TrackingScreen from './src/screens/TrackingScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import HubsScreen from './src/screens/HubsScreen';
import NewsScreen from './src/screens/NewsScreen';
import InfoScreen from './src/screens/InfoScreen';
import PriceScreen from './src/screens/PriceScreen';
import ScannerScreen from './src/screens/ScannerScreen';
import ShipmentsScreen from './src/screens/ShipmentsScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { SignupScreen } from './src/screens/SignupScreen';
import { PinScreen } from './src/screens/PinScreen';
import { ScreenSkeleton } from './src/components/SkeletonLoader';
import { COLORS } from './src/constants/theme';
import { storageService } from './src/services/storage';
import { initialUser, MobileUserProfile, getPackageById } from './src/data/mockData';

export type ScreenType =
  | 'home'
  | 'tracking'
  | 'tracking-detail'
  | 'checkout'
  | 'profile'
  | 'hubs'
  | 'news'
  | 'info'
  | 'price'
  | 'scanner';

export type AuthStateType = 'loading' | 'login' | 'signup' | 'pin' | 'app';

export default function App() {
  const [authState, setAuthState] = useState<AuthStateType>('loading');
  const [currentUser, setCurrentUser] = useState<MobileUserProfile>(initialUser);
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [selectedPackageId, setSelectedPackageId] = useState<string>('ship-1');
  const [screenHistory, setScreenHistory] = useState<ScreenType[]>(['home']);

  useEffect(() => {
    initAuth();
  }, []);

  const initAuth = async () => {
    try {
      const session = await storageService.getUserSession();
      if (!session || !session.isLoggedIn) {
        setAuthState('login');
      } else {
        if (session.user) {
          setCurrentUser(session.user);
        }
        const isLocked = await storageService.isSessionLocked();
        if (isLocked) {
          setAuthState('pin');
        } else {
          setAuthState('app');
        }
      }
    } catch {
      setAuthState('login');
    }
  };

  const handleLoginSuccess = (user: MobileUserProfile) => {
    setCurrentUser(user);
    setAuthState('app');
    setCurrentScreen('home');
  };

  const handleSignupSuccess = (user: MobileUserProfile) => {
    setCurrentUser(user);
    setAuthState('app');
    setCurrentScreen('home');
  };

  const handleUnlockSuccess = () => {
    setAuthState('app');
  };

  const handleLogout = async () => {
    await storageService.clearUserSession();
    setAuthState('login');
    setCurrentScreen('home');
    setScreenHistory(['home']);
  };

  const isTrackingActive = currentScreen === 'tracking' || currentScreen === 'tracking-detail';

  const navigateTo = (screen: ScreenType, packageId?: string) => {
    if (packageId) {
      setSelectedPackageId(packageId);
    }
    setScreenHistory((prev) => [...prev, screen]);
    setCurrentScreen(screen);
  };

  const goBack = () => {
    setScreenHistory((prev) => {
      if (prev.length <= 1) {
        setCurrentScreen('home');
        return ['home'];
      }
      const newHistory = prev.slice(0, -1);
      const prevScreen = newHistory[newHistory.length - 1];
      setCurrentScreen(prevScreen);
      return newHistory;
    });
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <SafeAreaView style={styles.safeArea}>
        {/* Loading State */}
        {authState === 'loading' && (
          <View style={styles.centerContainer}>
            <ScreenSkeleton />
          </View>
        )}

        {/* 1. Login Screen */}
        {authState === 'login' && (
          <LoginScreen
            onLoginSuccess={handleLoginSuccess}
            onNavigateToSignup={() => setAuthState('signup')}
            onUsePinInstead={() => setAuthState('pin')}
          />
        )}

        {/* 2. Signup Screen */}
        {authState === 'signup' && (
          <SignupScreen
            onSignupSuccess={handleSignupSuccess}
            onNavigateToLogin={() => setAuthState('login')}
          />
        )}

        {/* 3. PIN Screen */}
        {authState === 'pin' && (
          <PinScreen
            user={currentUser}
            onUnlockSuccess={handleUnlockSuccess}
            onSwitchToPassword={() => setAuthState('login')}
          />
        )}

        {/* 4. Authenticated Main Application Flow */}
        {authState === 'app' && (
          <>
            <View style={styles.screenContainer}>
              {currentScreen === 'home' && (
                <HomeScreen
                  user={currentUser}
                  onNavigateToTracking={(id) => navigateTo('tracking-detail', id)}
                  onNavigateToCheckout={() => navigateTo('checkout')}
                  onNavigateToProfile={() => navigateTo('profile')}
                  onNavigateToHubs={() => navigateTo('hubs')}
                  onNavigateToNews={() => navigateTo('news')}
                  onNavigateToInfo={() => navigateTo('info')}
                  onNavigateToPrice={() => navigateTo('price')}
                  onNavigateToScanner={() => navigateTo('scanner')}
                  onNavigateToAllShipments={() => navigateTo('tracking')}
                />
              )}

              {/* Tracking List: Shows full list of all trackings */}
              {currentScreen === 'tracking' && (
                <ShipmentsScreen
                  onBack={goBack}
                  onSelectPackage={(id) => navigateTo('tracking-detail', id)}
                />
              )}

              {/* Detailed Tracking: Stepper timeline and real PDF generation */}
              {currentScreen === 'tracking-detail' && (
                <TrackingScreen
                  packageId={selectedPackageId}
                  onBack={goBack}
                  onNavigateToCheckout={() => navigateTo('checkout')}
                />
              )}

              {currentScreen === 'hubs' && (
                <HubsScreen onBack={goBack} />
              )}

              {currentScreen === 'news' && (
                <NewsScreen onBack={goBack} />
              )}

              {currentScreen === 'info' && (
                <InfoScreen onBack={goBack} />
              )}

              {currentScreen === 'price' && (
                <PriceScreen
                  onBack={goBack}
                  onProceedToCheckout={() => navigateTo('checkout')}
                />
              )}

              {currentScreen === 'profile' && (
                <ProfileScreen
                  user={currentUser}
                  onBack={goBack}
                  onNavigateToShipments={() => navigateTo('tracking')}
                  onLogout={handleLogout}
                  onOpenScanner={() => navigateTo('scanner')}
                />
              )}

              {currentScreen === 'scanner' && (
                <ScannerScreen
                  onBack={goBack}
                  onTrackPackage={(code) => navigateTo('tracking-detail', code)}
                />
              )}

              {currentScreen === 'checkout' && (
                <CheckoutScreen
                  packageItem={getPackageById(selectedPackageId)}
                  onBack={goBack}
                  onPaymentSuccess={(pkgId) => {
                    setSelectedPackageId(pkgId);
                  }}
                  onNavigateToTracking={(pkgId) => {
                    setSelectedPackageId(pkgId);
                    navigateTo('tracking-detail', pkgId);
                  }}
                  onNavigateToHome={() => navigateTo('home')}
                />
              )}
            </View>

            {/* Sleek Horizontal Bottom Tab Bar - ONLY on main root tabs */}
            {(currentScreen === 'home' || currentScreen === 'tracking' || currentScreen === 'profile') && (
              <View style={styles.bottomTabBarContainer}>
                <View style={styles.bottomTabBar}>
                  {/* 1. Home Tab */}
                  <TouchableOpacity
                    style={[styles.tabItem, currentScreen === 'home' && styles.tabItemActive]}
                    onPress={() => navigateTo('home')}
                    activeOpacity={0.85}
                  >
                    <Ionicons
                      name={currentScreen === 'home' ? 'home' : 'home-outline'}
                      size={18}
                      color={currentScreen === 'home' ? '#000000' : '#9ca3af'}
                    />
                    <Text style={[styles.tabLabel, currentScreen === 'home' && styles.tabLabelActive]}>
                      Home
                    </Text>
                  </TouchableOpacity>

                  {/* 2. Tracking Tab */}
                  <TouchableOpacity
                    style={[styles.tabItem, isTrackingActive && styles.tabItemActive]}
                    onPress={() => navigateTo('tracking')}
                    activeOpacity={0.85}
                  >
                    <MaterialCommunityIcons
                      name={isTrackingActive ? 'truck-fast' : 'truck-fast-outline'}
                      size={19}
                      color={isTrackingActive ? '#000000' : '#9ca3af'}
                    />
                    <Text style={[styles.tabLabel, isTrackingActive && styles.tabLabelActive]}>
                      Tracking
                    </Text>
                  </TouchableOpacity>

                  {/* 3. Profile Tab (Customer Card, Wallet, Settings) */}
                  <TouchableOpacity
                    style={[styles.tabItem, currentScreen === 'profile' && styles.tabItemActive]}
                    onPress={() => navigateTo('profile')}
                    activeOpacity={0.85}
                  >
                    <Ionicons
                      name={currentScreen === 'profile' ? 'person' : 'person-outline'}
                      size={18}
                      color={currentScreen === 'profile' ? '#000000' : '#9ca3af'}
                    />
                    <Text style={[styles.tabLabel, currentScreen === 'profile' && styles.tabLabelActive]}>
                      Profile
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  screenContainer: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  bottomTabBarContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 20 : 12,
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 99,
  },
  bottomTabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#16181e',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#262932',
    paddingVertical: 6,
    paddingHorizontal: 8,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 10,
    gap: 6,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 22,
  },
  tabItemActive: {
    backgroundColor: COLORS.green,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9ca3af',
  },
  tabLabelActive: {
    color: '#000000',
    fontWeight: '800',
  },
});
