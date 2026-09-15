import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  MobileUserProfile,
} from '../data/mockData';
import { CustomerCard } from '../components/CustomerCard';
import { PromoModal } from '../components/PromoModal';
import { ScreenSkeleton } from '../components/SkeletonLoader';

interface HomeScreenProps {
  user?: MobileUserProfile;
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
  user = initialUser,
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
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 700);
  }, []);

  const filteredShipments = sampleShipments.filter((s) =>
    s.trackingNumber.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
    (s.origin && s.origin.toLowerCase().includes(searchQuery.trim().toLowerCase())) ||
    (s.destination && s.destination.toLowerCase().includes(searchQuery.trim().toLowerCase()))
  );

  const handleGetDiscount = () => {
    setShowPromoModal(true);
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
      onNavigateToTracking(trimmed);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Celebratory Promo Modal */}
      <PromoModal
        visible={showPromoModal}
        code="SWIFT20"
        discountPercentage={20}
        discountAmount={3000}
        onClose={() => setShowPromoModal(false)}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.green}
            colors={[COLORS.green]}
          />
        }
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
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userDate}>VIP • Lagos, NG</Text>
            </View>
          </TouchableOpacity>

          {/* Coins Pill (Navigates to Profile Page) */}
          <TouchableOpacity
            style={styles.coinsBadge}
            onPress={onNavigateToProfile}
            activeOpacity={0.85}
          >
            <FontAwesome5 name="coins" size={13} color={COLORS.green} />
            <Text style={styles.coinsText}>{user.coins || 872} Coins</Text>
          </TouchableOpacity>
        </View>

        {/* Digital Customer Card (Express pass & Naira balance) */}
        <CustomerCard user={user} onScanPress={onNavigateToScanner} compact />

        {/* Search Input Bar with QR code scanner icon */}
        <View style={styles.searchBar}>
          <Feather name="search" size={18} color="#9ca3af" style={styles.searchIcon} />
          <TextInput
            placeholder="Track Nigerian Waybill №"
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
            style={styles.searchInput}
          />
          <TouchableOpacity
            onPress={onNavigateToScanner}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={styles.qrScanButton}
          >
            <MaterialCommunityIcons name="qrcode-scan" size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        {/* Promo Card: Discount 20% OFF */}
        <View style={styles.promoCard}>
          <View style={styles.promoTextContainer}>
            <Text style={styles.promoSubtitle}>Exclusive Offer</Text>
            <Text style={styles.promoTitle}>20% OFF</Text>
            <TouchableOpacity
              style={styles.discountButton}
              onPress={handleGetDiscount}
              activeOpacity={0.85}
            >
              <Text style={styles.discountButtonText}>GET DISCOUNT</Text>
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
            <Text style={styles.actionLabel}>Rates</Text>
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
            <Text style={styles.actionLabel}>Hubs</Text>
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
            <Text style={styles.actionLabel}>Updates</Text>
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
            <Text style={styles.actionLabel}>Shield</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Shipping Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active & Recent Shipments</Text>
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
                    <Text style={styles.idNumberLabel}>WAYBILL №</Text>
                    <Text style={styles.trackingIdText}>{item.trackingNumber}</Text>
                    {item.destination && (
                      <Text style={styles.routeMiniText} numberOfLines={1}>
                        → {item.destination}
                      </Text>
                    )}
                  </View>
                </View>

                <View style={styles.statusBadge}>
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
                </View>
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
    paddingTop: 8,
    paddingBottom: 120,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
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
    borderColor: COLORS.green,
  },
  userName: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  userDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  coinsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1b261e',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: '#233d2a',
  },
  coinsText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 50,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
    marginRight: 10,
    paddingVertical: 0,
  },
  qrScanButton: {
    padding: 4,
  },
  promoCard: {
    flexDirection: 'row',
    backgroundColor: '#162b1d',
    borderRadius: 22,
    paddingHorizontal: 20,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#1e3a24',
    overflow: 'hidden',
  },
  promoTextContainer: {
    flex: 1,
    zIndex: 1,
  },
  promoSubtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#86efac',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  promoTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.5,
    marginVertical: 4,
  },
  discountButton: {
    backgroundColor: COLORS.green,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  discountButtonText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#000000',
    letterSpacing: 0.5,
  },
  promoImage: {
    width: 105,
    height: 95,
    transform: [{ scale: 1.15 }],
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    alignItems: 'center',
    width: '22%',
  },
  actionIconContainer: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 6,
  },
  actionLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  seeAllText: {
    fontSize: 13,
    color: COLORS.green,
    fontWeight: '600',
  },
  shipmentsList: {
    gap: 10,
  },
  shipmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  shipmentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  boxCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  idNumberLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 0.5,
  },
  trackingIdText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 1,
  },
  routeMiniText: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
    maxWidth: 180,
  },
  statusBadge: {
    alignItems: 'flex-end',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
