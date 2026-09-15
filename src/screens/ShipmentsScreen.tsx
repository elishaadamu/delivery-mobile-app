import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { sampleShipments, RecentShipmentItem } from '../data/mockData';

interface ShipmentsScreenProps {
  onBack: () => void;
  onSelectPackage: (packageId: string) => void;
}

export default function ShipmentsScreen({ onBack, onSelectPackage }: ShipmentsScreenProps) {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'on_way' | 'completed' | 'pending'>('all');

  const filteredList = sampleShipments.filter((item) => {
    const matchesTab =
      activeTab === 'all'
        ? true
        : activeTab === 'on_way'
        ? item.status === 'On the way'
        : activeTab === 'completed'
        ? item.status === 'Completed'
        : item.status === 'Pending';

    const matchesSearch =
      item.trackingNumber.toLowerCase().includes(search.toLowerCase()) ||
      (item.origin && item.origin.toLowerCase().includes(search.toLowerCase())) ||
      (item.destination && item.destination.toLowerCase().includes(search.toLowerCase()));

    return matchesTab && matchesSearch;
  });

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

        <Text style={styles.headerTitle}>Package Tracking</Text>

        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Search Input */}
        <View style={styles.searchBar}>
          <Feather name="search" size={18} color="#9ca3af" style={{ marginRight: 10 }} />
          <TextInput
            placeholder="Search by ID, city, or destination"
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

        {/* Status Filter Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsRow}
        >
          <TouchableOpacity
            style={[styles.tabChip, activeTab === 'all' && styles.tabChipActive]}
            onPress={() => setActiveTab('all')}
          >
            <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>
              All ({sampleShipments.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabChip, activeTab === 'on_way' && styles.tabChipActive]}
            onPress={() => setActiveTab('on_way')}
          >
            <Text style={[styles.tabText, activeTab === 'on_way' && styles.tabTextActive]}>
              On the way (1)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabChip, activeTab === 'completed' && styles.tabChipActive]}
            onPress={() => setActiveTab('completed')}
          >
            <Text style={[styles.tabText, activeTab === 'completed' && styles.tabTextActive]}>
              Completed (2)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabChip, activeTab === 'pending' && styles.tabChipActive]}
            onPress={() => setActiveTab('pending')}
          >
            <Text style={[styles.tabText, activeTab === 'pending' && styles.tabTextActive]}>
              Pending (1)
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Shipments Cards List */}
        <View style={styles.listContainer}>
          {filteredList.map((item) => {
            const isOnTheWay = item.status === 'On the way';
            const isCompleted = item.status === 'Completed';

            return (
              <TouchableOpacity
                key={item.id}
                style={styles.shipmentCard}
                activeOpacity={0.85}
                onPress={() => onSelectPackage(item.id)}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.idGroup}>
                    <View
                      style={[
                        styles.boxIconCircle,
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
                      <Text style={styles.idLabel}>ID NUMBER</Text>
                      <Text style={styles.idValue}>{item.trackingNumber}</Text>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor: isOnTheWay
                          ? COLORS.orangeBg
                          : isCompleted
                          ? COLORS.greenBg
                          : '#252831',
                        borderColor: isOnTheWay
                          ? '#4d2d14'
                          : isCompleted
                          ? '#193b22'
                          : '#3b3e4a',
                      },
                    ]}
                  >
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
                </View>

                {/* Route Information */}
                <View style={styles.routeContainer}>
                  <View style={styles.routeRow}>
                    <View style={styles.dotFrom} />
                    <Text style={styles.routeText} numberOfLines={1}>
                      {item.origin || 'Origin Terminal'}
                    </Text>
                  </View>
                  <View style={styles.routeLine} />
                  <View style={styles.routeRow}>
                    <View style={styles.dotTo} />
                    <Text style={styles.routeText} numberOfLines={1}>
                      {item.destination || 'Destination Address'}
                    </Text>
                  </View>
                </View>

                {/* Footer Metadata */}
                <View style={styles.cardFooter}>
                  <View style={styles.categoryPill}>
                    <Text style={styles.categoryText}>{item.category || 'Standard Parcel'}</Text>
                  </View>
                  <View style={styles.viewDetailRow}>
                    <Text style={styles.dateText}>{item.date}</Text>
                    <Feather name="chevron-right" size={16} color={COLORS.green} />
                  </View>
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
    paddingBottom: 110,
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
  tabsRow: {
    gap: 8,
    paddingBottom: 14,
  },
  tabChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tabChipActive: {
    backgroundColor: COLORS.green,
    borderColor: COLORS.green,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9ca3af',
  },
  tabTextActive: {
    color: '#000000',
    fontWeight: '800',
  },
  listContainer: {
    gap: 12,
  },
  shipmentCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  idGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  boxIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  idLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
  },
  idValue: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: 0.2,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  routeContainer: {
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#252831',
    borderBottomWidth: 1,
    borderBottomColor: '#252831',
    marginBottom: 12,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dotFrom: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.orange,
  },
  dotTo: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.green,
  },
  routeLine: {
    width: 2,
    height: 12,
    backgroundColor: '#374151',
    marginLeft: 3,
    marginVertical: 2,
  },
  routeText: {
    fontSize: 13,
    color: '#d1d5db',
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryPill: {
    backgroundColor: '#252831',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 11,
    color: '#9ca3af',
    fontWeight: '600',
  },
  viewDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
});
