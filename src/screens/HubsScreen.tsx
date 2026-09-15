import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { sampleHubs, LogisticsHub } from '../data/mockData';

interface HubsScreenProps {
  onBack: () => void;
}

export default function HubsScreen({ onBack }: HubsScreenProps) {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'locker' | 'hub' | 'express'>('all');
  const [defaultHubId, setDefaultHubId] = useState('hub-1');

  const filteredHubs = sampleHubs.filter((hub) => {
    const matchesFilter = selectedFilter === 'all' || hub.type === selectedFilter;
    const matchesSearch =
      hub.name.toLowerCase().includes(search.toLowerCase()) ||
      hub.address.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleSetDefault = (hub: LogisticsHub) => {
    setDefaultHubId(hub.id);
    Alert.alert('Default Drop Point Saved', `${hub.name} set as your primary pickup station.`);
  };

  const handleDirections = (hub: LogisticsHub) => {
    Alert.alert(
      '🗺️ Route Guidance',
      `Routing navigation to ${hub.name} (${hub.distance} away).\nAddress: ${hub.address}`,
      [{ text: 'Start Navigation', style: 'default' }, { text: 'Close', style: 'cancel' }]
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

        <Text style={styles.headerTitle}>Delivery Hubs & Lockers</Text>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => Alert.alert('Hub Map', 'Interactive GIS map view enabled.')}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="map-outline" size={20} color="#9ca3af" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Feather name="search" size={18} color="#9ca3af" style={{ marginRight: 10 }} />
          <TextInput
            placeholder="Search by city, zip, or station name"
            placeholderTextColor="#9ca3af"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Feather name="x" size={16} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          <TouchableOpacity
            style={[styles.filterChip, selectedFilter === 'all' && styles.filterChipActive]}
            onPress={() => setSelectedFilter('all')}
          >
            <Text style={[styles.filterChipText, selectedFilter === 'all' && styles.filterChipTextActive]}>
              All Stations ({sampleHubs.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, selectedFilter === 'locker' && styles.filterChipActive]}
            onPress={() => setSelectedFilter('locker')}
          >
            <Text style={[styles.filterChipText, selectedFilter === 'locker' && styles.filterChipTextActive]}>
              24/7 Smart Lockers
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, selectedFilter === 'hub' && styles.filterChipActive]}
            onPress={() => setSelectedFilter('hub')}
          >
            <Text style={[styles.filterChipText, selectedFilter === 'hub' && styles.filterChipTextActive]}>
              Full Distribution Hubs
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, selectedFilter === 'express' && styles.filterChipActive]}
            onPress={() => setSelectedFilter('express')}
          >
            <Text style={[styles.filterChipText, selectedFilter === 'express' && styles.filterChipTextActive]}>
              Express Drop-off
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <Ionicons name="qr-code-outline" size={20} color={COLORS.green} />
          <Text style={styles.infoBannerText}>
            Show your parcel QR code at any automated locker for instant 2-second contactless pickup.
          </Text>
        </View>

        {/* Hubs List */}
        <View style={styles.hubsList}>
          {filteredHubs.map((hub) => {
            const isDefault = hub.id === defaultHubId;
            return (
              <View
                key={hub.id}
                style={[styles.hubCard, isDefault && styles.hubCardDefault]}
              >
                <View style={styles.hubCardTop}>
                  <View style={styles.hubTitleRow}>
                    <View style={styles.hubIconCircle}>
                      <MaterialCommunityIcons
                        name={hub.type === 'locker' ? 'locker' : hub.type === 'express' ? 'flash' : 'warehouse'}
                        size={20}
                        color={hub.badgeColor}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.hubName}>{hub.name}</Text>
                      <Text style={styles.hubType}>{hub.typeLabel}</Text>
                    </View>
                  </View>

                  <View style={styles.distancePill}>
                    <Feather name="navigation" size={12} color={COLORS.green} />
                    <Text style={styles.distanceText}>{hub.distance}</Text>
                  </View>
                </View>

                <View style={styles.hubDetails}>
                  <View style={styles.detailRow}>
                    <Feather name="map-pin" size={14} color="#9ca3af" />
                    <Text style={styles.detailText}>{hub.address}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Feather name="clock" size={14} color={hub.isOpen ? COLORS.green : '#ef4444'} />
                    <Text style={[styles.detailText, { color: hub.isOpen ? '#d1d5db' : '#ef4444' }]}>
                      {hub.hours} {hub.isOpen ? '• Open Now' : '• Closed'}
                    </Text>
                  </View>

                  {hub.lockersAvailable !== undefined && hub.lockersAvailable > 0 && (
                    <View style={styles.detailRow}>
                      <MaterialCommunityIcons name="cube-scan" size={14} color="#60a5fa" />
                      <Text style={[styles.detailText, { color: '#93c5fd' }]}>
                        {hub.lockersAvailable} locker compartments ready
                      </Text>
                    </View>
                  )}
                </View>

                {/* Card Action Buttons */}
                <View style={styles.hubActions}>
                  <TouchableOpacity
                    style={styles.actionBtnSecondary}
                    onPress={() => handleSetDefault(hub)}
                  >
                    <Text style={styles.actionBtnSecondaryText}>
                      {isDefault ? '✓ Default Hub' : 'Set as Default'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionBtnPrimary}
                    onPress={() => handleDirections(hub)}
                  >
                    <Feather name="corner-up-right" size={14} color="#000000" />
                    <Text style={styles.actionBtnPrimaryText}>Directions</Text>
                  </TouchableOpacity>
                </View>
              </View>
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
    paddingBottom: 120,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    padding: 0,
  },
  filterRow: {
    gap: 8,
    paddingBottom: 14,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterChipActive: {
    backgroundColor: COLORS.green,
    borderColor: COLORS.green,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9ca3af',
  },
  filterChipTextActive: {
    color: '#000000',
    fontWeight: '800',
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#162b1d',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1e3a24',
    marginBottom: 16,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 12,
    color: '#86efac',
    lineHeight: 17,
    fontWeight: '500',
  },
  hubsList: {
    gap: 14,
  },
  hubCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  hubCardDefault: {
    borderColor: '#1e3a24',
    backgroundColor: '#141a16',
  },
  hubCardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  hubTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    paddingRight: 8,
  },
  hubIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#252831',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hubName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  hubType: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  distancePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.greenBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  distanceText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.green,
  },
  hubDetails: {
    gap: 6,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#252831',
    borderBottomWidth: 1,
    borderBottomColor: '#252831',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  hubActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
  },
  actionBtnSecondary: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#252831',
  },
  actionBtnSecondaryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#d1d5db',
  },
  actionBtnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: COLORS.green,
  },
  actionBtnPrimaryText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#000000',
  },
});
