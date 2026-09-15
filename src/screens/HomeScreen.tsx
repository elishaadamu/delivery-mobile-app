import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import {
  Ionicons,
  Feather,
  MaterialCommunityIcons,
  FontAwesome5,
} from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import {
  initialUser,
  sampleShipments,
  RecentShipmentItem,
} from '../data/mockData';

interface HomeScreenProps {
  onNavigateToTracking: (id: string) => void;
  onNavigateToCheckout?: () => void;
  onNavigateToProfile?: () => void;
  onNavigateToHubs?: () => void;
  onNavigateToNews?: () => void;
  onNavigateToInfo?: () => void;
  onNavigateToPrice?: () => void;
  onNavigateToScanner?: () => void;
  onNavigateToAllShipments?: () => void;
}

export default function HomeScreen({
  onNavigateToTracking,
  onNavigateToCheckout,
  onNavigateToProfile,
  onNavigateToHubs,
  onNavigateToNews,
  onNavigateToInfo,
  onNavigateToPrice,
  onNavigateToScanner,
  onNavigateToAllShipments,
}: HomeScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);

  const filteredShipments = sampleShipments.filter((s) =>
    s.trackingNumber.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
    (s.origin && s.origin.toLowerCase().includes(searchQuery.trim().toLowerCase())) ||
    (s.destination && s.destination.toLowerCase().includes(searchQuery.trim().toLowerCase()))
  );

  const handleGetDiscount = () => {
    setDiscountApplied(true);
    Alert.alert('🎉 Promo Applied', '20% OFF coupon SWIFT20 has been added to your account!');
  };

  const handleSearchSubmit = () => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    const matched = sampleShipments.find(
      (s) => s.trackingNumber.toLowerCase() === trimmed.toLowerCase()
    );

    if (matched) {
      onNavigateToTracking(matched.id);
    } else {
      // If it doesn't match a local shipment, still allow looking it up
      onNavigateToTracking(trimmed);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top Header */}
        <View style={styles.headerRow}>
          {/* User Profile Info (Navigates to Profile Page) */}
          <TouchableOpacity
            style={styles.profileContainer}
            onPress={onNavigateToProfile}
            activeOpacity={0.8}
          >
            <Image
              source={require('../../assets/images/stive-kate.jpg')}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.userName}>{initialUser.name}</Text>
              <Text style={styles.userDate}>{initialUser.date}</Text>
            </View>
          </TouchableOpacity>

          {/* Coins Pill (Navigates to Profile Page) */}
          <TouchableOpacity
            style={styles.coinsBadge}
            onPress={onNavigateToProfile}
            activeOpacity={0.85}
          >
            <FontAwesome5 name="coins" size={13} color={COLORS.green} />
            <Text style={styles.coinsText}>{initialUser.coins} Coins</Text>
          </TouchableOpacity>
        </View>

        {/* Search Input Bar */}
        <View style={styles.searchBar}>
          <Feather name="search" size={18} color="#9ca3af" style={styles.searchIcon} />
          <TextInput
            placeholder="Track Your Package"
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
            style={styles.searchInput}
          />
          <TouchableOpacity
            onPress={onNavigateToScanner}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialCommunityIcons name="qrcode-scan" size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        {/* Promo Card: Discount 20% OFF */}
        <View style={styles.promoCard}>
          <View style={styles.promoTextContainer}>
            <Text style={styles.promoSubtitle}>Discount</Text>
            <Text style={styles.promoTitle}>20% OFF</Text>
            <TouchableOpacity
              style={styles.discountButton}
              onPress={handleGetDiscount}
              activeOpacity={0.85}
            >
              <Text style={styles.discountButtonText}>
                {discountApplied ? 'APPLIED (20%)' : 'GET DISCOUNT'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* 3D Cardboard Boxes Image */}
          <Image
            source={require('../../assets/images/delivery-boxes-3d.jpg')}
            style={styles.promoImage}
            resizeMode="contain"
          />
        </View>

        {/* 4 Quick Action Pages */}
        <View style={styles.actionsGrid}>
          {/* Price -> Rate Calculator Page */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onNavigateToPrice}
            activeOpacity={0.8}
          >
            <View style={styles.actionIconContainer}>
              <Ionicons name="card-outline" size={22} color="#d1d5db" />
            </View>
            <Text style={styles.actionLabel}>Price</Text>
          </TouchableOpacity>

          {/* Point -> Logistics Hubs Page */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onNavigateToHubs}
            activeOpacity={0.8}
          >
            <View style={styles.actionIconContainer}>
              <Ionicons name="location-outline" size={22} color="#d1d5db" />
            </View>
            <Text style={styles.actionLabel}>Point</Text>
          </TouchableOpacity>

          {/* News -> Logistics News Page */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onNavigateToNews}
            activeOpacity={0.8}
          >
            <View style={styles.actionIconContainer}>
              <Ionicons name="newspaper-outline" size={22} color="#d1d5db" />
            </View>
            <Text style={styles.actionLabel}>News</Text>
          </TouchableOpacity>

          {/* Info -> Service & Insurance Page */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onNavigateToInfo}
            activeOpacity={0.8}
          >
            <View style={styles.actionIconContainer}>
              <Ionicons name="information-circle-outline" size={24} color="#d1d5db" />
            </View>
            <Text style={styles.actionLabel}>Info</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Shipping Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Shipping</Text>
          <TouchableOpacity
            style={styles.seeAllButton}
            onPress={onNavigateToAllShipments}
          >
            <Text style={styles.seeAllText}>See all</Text>
            <Feather name="chevron-right" size={16} color={COLORS.green} />
          </TouchableOpacity>
        </View>

        {/* Shipments List */}
        <View style={styles.shipmentsList}>
          {filteredShipments.map((item, index) => {
            const isOnTheWay = item.status === 'On the way';
            const isCompleted = item.status === 'Completed';

            return (
              <TouchableOpacity
                key={`${item.id}-${index}`}
                style={styles.shipmentCard}
                activeOpacity={0.85}
                onPress={() => onNavigateToTracking(item.id)}
              >
                <View style={styles.shipmentLeft}>
                  <View
                    style={[
                      styles.boxCircle,
                      {
                        backgroundColor: isOnTheWay
                          ? COLORS.orangeBg
                          : isCompleted
                          ? COLORS.greenBg
                          : '#252831',
                      },
                    ]}
                  >
                    <Feather
                      name="box"
                      size={18}
                      color={
                        isOnTheWay
                          ? COLORS.orange
                          : isCompleted
                          ? COLORS.green
                          : '#9ca3af'
                      }
                    />
                  </View>

                  <View>
                    <Text style={styles.idNumberLabel}>ID NUMBER</Text>
                    <Text style={styles.trackingIdText}>{item.trackingNumber}</Text>
                  </View>
                </View>

                <Text
                  style={[
                    styles.statusText,
                    {
                      color: isOnTheWay
                        ? COLORS.orange
                        : isCompleted
                        ? COLORS.green
                        : '#9ca3af',
                    },
                  ]}
                >
                  {item.status}
                </Text>
              </TouchableOpacity>
            );
          })}
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 90,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  userDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  coinsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1c1e24',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  coinsText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.green,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: COLORS.text,
    padding: 0,
    marginRight: 10,
  },
  promoCard: {
    position: 'relative',
    backgroundColor: COLORS.green,
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    minHeight: 145,
    marginBottom: 16,
  },
  promoTextContainer: {
    zIndex: 2,
    maxWidth: '58%',
  },
  promoSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(0, 0, 0, 0.75)',
    letterSpacing: 0.2,
  },
  promoTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#000000',
    letterSpacing: -0.5,
    marginTop: 2,
    marginBottom: 12,
  },
  discountButton: {
    backgroundColor: '#000000',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  discountButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  promoImage: {
    position: 'absolute',
    right: -25,
    bottom: -15,
    width: 190,
    height: 175,
    zIndex: 1,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 22,
  },
  actionButton: {
    alignItems: 'center',
    gap: 8,
    width: '22%',
  },
  actionIconContainer: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#d1d5db',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.green,
  },
  shipmentsList: {
    gap: 12,
  },
  shipmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  shipmentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  boxCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  idNumberLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
  },
  trackingIdText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: 0.2,
    marginTop: 2,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
