import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Switch,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { initialUser, savedAddresses, MobileUserProfile } from '../data/mockData';
import { storageService } from '../services/storage';
import { CustomerCard } from '../components/CustomerCard';

interface ProfileScreenProps {
  user?: MobileUserProfile;
  onBack: () => void;
  onNavigateToShipments?: () => void;
  onLogout?: () => void;
  onOpenScanner?: () => void;
}

export default function ProfileScreen({
  user = initialUser,
  onBack,
  onNavigateToShipments,
  onLogout,
  onOpenScanner,
}: ProfileScreenProps) {
  const insets = useSafeAreaInsets();
  const [pushEnabled, setPushEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [addresses, setAddresses] = useState(savedAddresses);

  const handleRedeem = () => {
    Alert.alert(
      '🎁 Redeem Logistics Reward Coins',
      `You have ${user.coins || 872} coins available.\n\n• 500 Coins: ₦5,000 Off Freight Voucher\n• 300 Coins: Free Zero-Deductible Insurance\n• 200 Coins: Express Priority Hub Pickup`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Redeem ₦5,000 Voucher',
          onPress: () => Alert.alert('Voucher Activated! 🎉', '₦5,000 shipping voucher credited to your next Lagos or Interstate delivery!'),
        },
      ]
    );
  };

  const handleSetDefaultAddress = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out of Swift Logistics',
      'Are you sure you want to sign out from your device?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await storageService.clearUserSession();
            if (onLogout) {
              onLogout();
            }
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onBack}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Feather name="chevron-left" size={26} color="#ffffff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Account & Profile</Text>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => Alert.alert('Verified Profile', 'Your BVN and Phone number are verified on Swift Logistics Nigeria.')}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="shield-checkmark" size={20} color={COLORS.green} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Interactive Digital Customer Card */}
        <CustomerCard user={user} onScanPress={onOpenScanner} />

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarWrapper}>
            <Image
              source={require('../../assets/images/stive-kate.jpg')}
              style={styles.avatar}
            />
            <View style={styles.tierBadgeSmall}>
              <FontAwesome5 name="crown" size={10} color="#facc15" />
            </View>
          </View>

          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>{user.name}</Text>
              <View style={styles.goldPill}>
                <Text style={styles.goldPillText}>GOLD VIP</Text>
              </View>
            </View>
            <Text style={styles.userEmail}>{user.email}</Text>
            <Text style={styles.userPhone}>{user.phone}</Text>
            <Text style={styles.memberSince}>Member since {user.date || user.memberSince || 'January 2025'}</Text>
          </View>
        </View>

        {/* Coins & Rewards Card */}
        <View style={styles.coinsCard}>
          <View style={styles.coinsTop}>
            <View style={styles.coinsLeft}>
              <View style={styles.coinIconCircle}>
                <FontAwesome5 name="coins" size={18} color={COLORS.green} />
              </View>
              <View>
                <Text style={styles.coinsLabel}>Reward Coins</Text>
                <Text style={styles.coinsNumber}>{user.coins || 872} <Text style={styles.coinsUnit}>Coins</Text></Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.redeemButton}
              onPress={handleRedeem}
              activeOpacity={0.85}
            >
              <Text style={styles.redeemButtonText}>Redeem</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tierProgressBar}>
            <View style={styles.tierProgressFill} />
          </View>
          <Text style={styles.tierProgressSub}>128 more coins to reach Platinum Tier VIP discount</Text>
        </View>

        {/* Shipping Statistics */}
        <View style={styles.statsContainer}>
          <TouchableOpacity
            style={styles.statBox}
            onPress={onNavigateToShipments}
            activeOpacity={0.8}
          >
            <Text style={[styles.statNumber, { color: COLORS.orange }]}>
              {user.activeShipments || 1}
            </Text>
            <Text style={styles.statLabel}>Active Shipments</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statBox}
            onPress={onNavigateToShipments}
            activeOpacity={0.8}
          >
            <Text style={[styles.statNumber, { color: COLORS.green }]}>
              {user.completedShipments || 14}
            </Text>
            <Text style={styles.statLabel}>Delivered Parcels</Text>
          </TouchableOpacity>

          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: '#60a5fa' }]}>
              {user.rating || 5.0}★
            </Text>
            <Text style={styles.statLabel}>Customer Rating</Text>
          </View>
        </View>

        {/* Saved Nigerian Delivery Addresses */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Saved Nigerian Addresses</Text>

          <View style={styles.addressList}>
            {addresses.map((addr) => (
              <TouchableOpacity
                key={addr.id}
                style={[
                  styles.addressCard,
                  addr.isDefault && styles.addressCardDefault,
                ]}
                onPress={() => handleSetDefaultAddress(addr.id)}
                activeOpacity={0.85}
              >
                <View style={styles.addressLeft}>
                  <View
                    style={[
                      styles.addressIconCircle,
                      addr.isDefault && { backgroundColor: COLORS.greenBg },
                    ]}
                  >
                    <Ionicons
                      name={addr.label === 'Home' ? 'home-outline' : 'business-outline'}
                      size={18}
                      color={addr.isDefault ? COLORS.green : '#9ca3af'}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.addressHeaderRow}>
                      <Text style={styles.addressLabel}>{addr.label}</Text>
                      {addr.isDefault && (
                        <View style={styles.defaultPill}>
                          <Text style={styles.defaultPillText}>DEFAULT</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.addressStreet}>{addr.address}</Text>
                    <Text style={styles.addressCity}>{addr.city}</Text>
                  </View>
                </View>
                <Feather
                  name={addr.isDefault ? 'check-circle' : 'circle'}
                  size={18}
                  color={addr.isDefault ? COLORS.green : '#4b5563'}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Settings & Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Preferences</Text>

          <View style={styles.settingsCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Ionicons name="notifications-outline" size={20} color="#9ca3af" />
                <View>
                  <Text style={styles.settingLabel}>Push Notifications</Text>
                  <Text style={styles.settingSub}>Instant delivery driver tracking alerts</Text>
                </View>
              </View>
              <Switch
                value={pushEnabled}
                onValueChange={setPushEnabled}
                trackColor={{ false: '#374151', true: COLORS.green }}
                thumbColor="#ffffff"
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Ionicons name="chatbubble-ellipses-outline" size={20} color="#9ca3af" />
                <View>
                  <Text style={styles.settingLabel}>SMS Dispatch Alerts</Text>
                  <Text style={styles.settingSub}>Receive text message on parcel arrival</Text>
                </View>
              </View>
              <Switch
                value={smsEnabled}
                onValueChange={setSmsEnabled}
                trackColor={{ false: '#374151', true: COLORS.green }}
                thumbColor="#ffffff"
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Ionicons name="finger-print-outline" size={20} color="#9ca3af" />
                <View>
                  <Text style={styles.settingLabel}>Biometric & PIN Security</Text>
                  <Text style={styles.settingSub}>4-digit PIN unlock for quick access</Text>
                </View>
              </View>
              <Switch
                value={biometricEnabled}
                onValueChange={setBiometricEnabled}
                trackColor={{ false: '#374151', true: COLORS.green }}
                thumbColor="#ffffff"
              />
            </View>
          </View>
        </View>

        {/* Support & Logout */}
        <View style={[styles.section, { marginBottom: 30 }]}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => Alert.alert('Swift Nigerian Support', '24/7 Support Hotline: +234 1 889 0421\nEmail: support@swiftlogistics.ng')}
            activeOpacity={0.8}
          >
            <View style={styles.menuLeft}>
              <Feather name="headphones" size={18} color="#9ca3af" />
              <Text style={styles.menuLabel}>24/7 Nigeria Courier Support</Text>
            </View>
            <Feather name="chevron-right" size={16} color="#6b7280" />
          </TouchableOpacity>

          {/* Working Sign Out */}
          <TouchableOpacity
            style={[styles.menuItem, styles.logoutMenuItem]}
            onPress={handleSignOut}
            activeOpacity={0.8}
          >
            <View style={styles.menuLeft}>
              <Feather name="log-out" size={18} color="#ef4444" />
              <Text style={[styles.menuLabel, { color: '#ef4444' }]}>Sign Out of Swift Logistics</Text>
            </View>
            <Feather name="chevron-right" size={16} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#1c1f26',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 14,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: COLORS.green,
  },
  tierBadgeSmall: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#1c1f26',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#facc15',
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  userName: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  goldPill: {
    backgroundColor: 'rgba(250, 204, 21, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(250, 204, 21, 0.3)',
  },
  goldPillText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#facc15',
  },
  userEmail: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  memberSince: {
    fontSize: 10,
    color: '#6b7280',
    fontWeight: '600',
  },
  coinsCard: {
    backgroundColor: '#162b1d',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1e3a24',
    marginBottom: 16,
  },
  coinsTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  coinsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  coinIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinsLabel: {
    fontSize: 11,
    color: '#86efac',
    fontWeight: '600',
  },
  coinsNumber: {
    fontSize: 18,
    fontWeight: '900',
    color: '#ffffff',
  },
  coinsUnit: {
    fontSize: 12,
    fontWeight: '600',
    color: '#86efac',
  },
  redeemButton: {
    backgroundColor: COLORS.green,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 12,
  },
  redeemButtonText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#000000',
  },
  tierProgressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  tierProgressFill: {
    width: '75%',
    height: '100%',
    backgroundColor: COLORS.green,
    borderRadius: 3,
  },
  tierProgressSub: {
    fontSize: 10,
    color: '#86efac',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },
  addressList: {
    gap: 10,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  addressCardDefault: {
    borderColor: COLORS.green,
    backgroundColor: '#16221a',
  },
  addressLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    marginRight: 10,
  },
  addressIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#252831',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  addressLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  defaultPill: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  defaultPillText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.green,
  },
  addressStreet: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  addressCity: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  settingsCard: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    marginRight: 10,
  },
  settingLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  settingSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#252831',
    marginVertical: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  logoutMenuItem: {
    marginTop: 12,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
});
