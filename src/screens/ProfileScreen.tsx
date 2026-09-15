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
import { Feather, Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { initialUser, savedAddresses } from '../data/mockData';

interface ProfileScreenProps {
  onBack: () => void;
  onNavigateToShipments?: () => void;
}

export default function ProfileScreen({ onBack, onNavigateToShipments }: ProfileScreenProps) {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [addresses, setAddresses] = useState(savedAddresses);

  const handleRedeem = () => {
    Alert.alert(
      '🎁 Redeem Reward Coins',
      `You have ${initialUser.coins} coins available.\n\n• 500 Coins: $5 Off Shipping Voucher\n• 300 Coins: Free Premium Insurance Shield\n• 200 Coins: Express Priority Processing`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Get $5 Voucher', onPress: () => Alert.alert('Success', 'Voucher applied to your account!') },
      ]
    );
  };

  const handleSetDefaultAddress = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onBack}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather name="chevron-left" size={26} color="#ffffff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Account & Profile</Text>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => Alert.alert('Edit Profile', 'Profile details updated.')}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather name="edit-3" size={18} color="#9ca3af" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
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
              <Text style={styles.userName}>{initialUser.name}</Text>
              <View style={styles.goldPill}>
                <Text style={styles.goldPillText}>GOLD</Text>
              </View>
            </View>
            <Text style={styles.userEmail}>{initialUser.email}</Text>
            <Text style={styles.userPhone}>{initialUser.phone}</Text>
            <Text style={styles.memberSince}>Member since {initialUser.date}</Text>
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
                <Text style={styles.coinsLabel}>Reward Balance</Text>
                <Text style={styles.coinsNumber}>{initialUser.coins} <Text style={styles.coinsUnit}>Coins</Text></Text>
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
          <Text style={styles.tierProgressSub}>128 more coins to reach Platinum Tier benefits</Text>
        </View>

        {/* Shipping Statistics */}
        <View style={styles.statsContainer}>
          <TouchableOpacity
            style={styles.statBox}
            onPress={onNavigateToShipments}
            activeOpacity={0.8}
          >
            <Text style={[styles.statNumber, { color: COLORS.orange }]}>
              {initialUser.activeShipments}
            </Text>
            <Text style={styles.statLabel}>Active Parcel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statBox}
            onPress={onNavigateToShipments}
            activeOpacity={0.8}
          >
            <Text style={[styles.statNumber, { color: COLORS.green }]}>
              {initialUser.completedShipments}
            </Text>
            <Text style={styles.statLabel}>Completed</Text>
          </TouchableOpacity>

          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: '#60a5fa' }]}>100%</Text>
            <Text style={styles.statLabel}>On-Time Rate</Text>
          </View>
        </View>

        {/* Saved Addresses */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Saved Addresses</Text>
            <TouchableOpacity onPress={() => Alert.alert('Add Address', 'Add new address modal')}>
              <Text style={styles.sectionActionText}>+ Add New</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.addressList}>
            {addresses.map((addr) => (
              <TouchableOpacity
                key={addr.id}
                style={[styles.addressCard, addr.isDefault && styles.addressCardDefault]}
                onPress={() => handleSetDefaultAddress(addr.id)}
                activeOpacity={0.85}
              >
                <View style={styles.addressLeft}>
                  <View
                    style={[
                      styles.addressIconCircle,
                      { backgroundColor: addr.isDefault ? COLORS.greenBg : '#252831' },
                    ]}
                  >
                    <Ionicons
                      name={addr.label === 'Home' ? 'home-outline' : addr.label === 'Office' ? 'business-outline' : 'cube-outline'}
                      size={18}
                      color={addr.isDefault ? COLORS.green : '#9ca3af'}
                    />
                  </View>
                  <View style={styles.addressDetails}>
                    <View style={styles.addressLabelRow}>
                      <Text style={styles.addressLabel}>{addr.label}</Text>
                      {addr.isDefault && (
                        <View style={styles.defaultBadge}>
                          <Text style={styles.defaultBadgeText}>DEFAULT</Text>
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
          <Text style={styles.sectionTitle}>Preferences</Text>

          <View style={styles.settingsCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Ionicons name="notifications-outline" size={20} color="#9ca3af" />
                <View>
                  <Text style={styles.settingLabel}>Push Notifications</Text>
                  <Text style={styles.settingSub}>Real-time delivery progress updates</Text>
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
                  <Text style={styles.settingSub}>Receive text message on courier arrival</Text>
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
                  <Text style={styles.settingLabel}>Biometric Sign-In</Text>
                  <Text style={styles.settingSub}>Face ID / Fingerprint fast checkout</Text>
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
        <View style={[styles.section, { marginBottom: 40 }]}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => Alert.alert('Support Hotline', 'Calling 24/7 Priority Support (+49 30 8912 000)')}
            activeOpacity={0.8}
          >
            <View style={styles.menuLeft}>
              <Feather name="headphones" size={18} color="#9ca3af" />
              <Text style={styles.menuLabel}>24/7 Priority Courier Support</Text>
            </View>
            <Feather name="chevron-right" size={16} color="#6b7280" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { marginTop: 10 }]}
            onPress={() => Alert.alert('Signed Out', 'You have been safely signed out.')}
            activeOpacity={0.8}
          >
            <View style={styles.menuLeft}>
              <Feather name="log-out" size={18} color="#ef4444" />
              <Text style={[styles.menuLabel, { color: '#ef4444' }]}>Sign Out</Text>
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
    paddingTop: 10,
    paddingBottom: 14,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
    gap: 16,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: COLORS.green,
  },
  tierBadgeSmall: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#1f2937',
    width: 22,
    height: 22,
    borderRadius: 11,
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
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  goldPill: {
    backgroundColor: '#3b2d11',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ca8a04',
  },
  goldPillText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#facc15',
  },
  userEmail: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  memberSince: {
    fontSize: 11,
    color: COLORS.green,
    fontWeight: '600',
  },
  coinsCard: {
    backgroundColor: '#17231a',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1e3a24',
    marginBottom: 16,
  },
  coinsTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '600',
  },
  coinsNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
  },
  coinsUnit: {
    fontSize: 14,
    color: COLORS.green,
    fontWeight: '700',
  },
  redeemButton: {
    backgroundColor: COLORS.green,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 14,
  },
  redeemButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#000000',
  },
  tierProgressBar: {
    height: 6,
    backgroundColor: '#233827',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  tierProgressFill: {
    width: '84%',
    height: '100%',
    backgroundColor: COLORS.green,
  },
  tierProgressSub: {
    fontSize: 11,
    color: '#86efac',
    fontWeight: '500',
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
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 10,
  },
  sectionActionText: {
    fontSize: 13,
    color: COLORS.green,
    fontWeight: '700',
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
    borderColor: '#1e3a24',
    backgroundColor: '#141816',
  },
  addressLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  addressIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressDetails: {
    flex: 1,
  },
  addressLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  addressLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  defaultBadge: {
    backgroundColor: COLORS.greenBg,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  defaultBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.green,
  },
  addressStreet: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  addressCity: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  settingsCard: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    paddingRight: 12,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  settingSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
});
