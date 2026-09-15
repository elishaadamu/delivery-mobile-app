import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

interface PriceScreenProps {
  onBack: () => void;
  onProceedToCheckout?: () => void;
}

export default function PriceScreen({ onBack, onProceedToCheckout }: PriceScreenProps) {
  const [tier, setTier] = useState<'ground' | 'air' | 'same_day'>('air');
  const [origin, setOrigin] = useState('Sauerfort 67847');
  const [destination, setDestination] = useState('Berlin 10115');
  const [weightKg, setWeightKg] = useState(2.5);
  const [insurance, setInsurance] = useState(true);
  const [signatureReq, setSignatureReq] = useState(true);

  // Rate calculations
  const baseRate = tier === 'ground' ? 14.5 : tier === 'air' ? 28.0 : 42.0;
  const weightCost = weightKg * 4.2;
  const insuranceCost = insurance ? 4.0 : 0.0;
  const signatureCost = signatureReq ? 2.5 : 0.0;
  const totalCost = baseRate + weightCost + insuranceCost + signatureCost;

  const handleBook = () => {
    Alert.alert(
      '📦 Shipment Quote Confirmed',
      `Total: $${totalCost.toFixed(2)}\nOrigin: ${origin}\nDestination: ${destination}\nSpeed: ${
        tier === 'ground' ? 'Standard Ground' : tier === 'air' ? 'Next-Day Express' : 'Same-Day Courier'
      }`,
      [
        { text: 'Proceed to Checkout', onPress: () => onProceedToCheckout?.() },
        { text: 'Cancel', style: 'cancel' },
      ]
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

        <Text style={styles.headerTitle}>Rate Calculator</Text>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => {
            setWeightKg(2.5);
            setTier('air');
            setInsurance(true);
            setSignatureReq(true);
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather name="rotate-ccw" size={18} color="#9ca3af" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Speed Tier Selection */}
        <Text style={styles.sectionTitle}>Delivery Speed</Text>
        <View style={styles.tierGrid}>
          <TouchableOpacity
            style={[styles.tierOption, tier === 'ground' && styles.tierOptionActive]}
            onPress={() => setTier('ground')}
            activeOpacity={0.85}
          >
            <MaterialCommunityIcons
              name="truck-outline"
              size={22}
              color={tier === 'ground' ? COLORS.green : '#9ca3af'}
            />
            <Text style={[styles.tierOptionTitle, tier === 'ground' && styles.tierOptionTitleActive]}>
              Ground
            </Text>
            <Text style={styles.tierOptionTime}>2-4 Days</Text>
            <Text style={styles.tierOptionPrice}>From $14.50</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tierOption, tier === 'air' && styles.tierOptionActive]}
            onPress={() => setTier('air')}
            activeOpacity={0.85}
          >
            <View style={styles.popularBadge}>
              <Text style={styles.popularBadgeText}>FASTEST</Text>
            </View>
            <MaterialCommunityIcons
              name="airplane"
              size={22}
              color={tier === 'air' ? COLORS.green : '#9ca3af'}
            />
            <Text style={[styles.tierOptionTitle, tier === 'air' && styles.tierOptionTitleActive]}>
              Air Express
            </Text>
            <Text style={styles.tierOptionTime}>Next-Day</Text>
            <Text style={styles.tierOptionPrice}>From $28.00</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tierOption, tier === 'same_day' && styles.tierOptionActive]}
            onPress={() => setTier('same_day')}
            activeOpacity={0.85}
          >
            <MaterialCommunityIcons
              name="clock-fast"
              size={22}
              color={tier === 'same_day' ? COLORS.green : '#9ca3af'}
            />
            <Text style={[styles.tierOptionTitle, tier === 'same_day' && styles.tierOptionTitleActive]}>
              Same-Day
            </Text>
            <Text style={styles.tierOptionTime}>Today 19:00</Text>
            <Text style={styles.tierOptionPrice}>From $42.00</Text>
          </TouchableOpacity>
        </View>

        {/* Route Inputs */}
        <Text style={[styles.sectionTitle, { marginTop: 18 }]}>Origin & Destination</Text>
        <View style={styles.card}>
          <View style={styles.inputRow}>
            <View style={styles.dotOrigin} />
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>Pickup Address / Hub</Text>
              <TextInput
                style={styles.textInput}
                value={origin}
                onChangeText={setOrigin}
                placeholder="Origin postal code or hub"
                placeholderTextColor="#6b7280"
              />
            </View>
          </View>

          <View style={styles.routeDivider} />

          <View style={styles.inputRow}>
            <View style={styles.dotDestination} />
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>Delivery Address</Text>
              <TextInput
                style={styles.textInput}
                value={destination}
                onChangeText={setDestination}
                placeholder="Destination postal code"
                placeholderTextColor="#6b7280"
              />
            </View>
          </View>
        </View>

        {/* Parcel Weight & Stepper */}
        <Text style={[styles.sectionTitle, { marginTop: 18 }]}>Package Weight</Text>
        <View style={styles.card}>
          <View style={styles.stepperRow}>
            <View>
              <Text style={styles.weightValue}>{weightKg.toFixed(1)} <Text style={styles.kgText}>kg</Text></Text>
              <Text style={styles.weightSub}>Standard Parcel Size (Max 30 kg)</Text>
            </View>

            <View style={styles.stepperControls}>
              <TouchableOpacity
                style={styles.stepBtn}
                onPress={() => setWeightKg((prev) => Math.max(0.5, prev - 0.5))}
              >
                <Feather name="minus" size={18} color="#ffffff" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.stepBtn}
                onPress={() => setWeightKg((prev) => Math.min(30, prev + 0.5))}
              >
                <Feather name="plus" size={18} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Value-Add Protection Toggles */}
        <Text style={[styles.sectionTitle, { marginTop: 18 }]}>Options & Protection</Text>
        <View style={styles.card}>
          <View style={styles.toggleRow}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={styles.toggleTitle}>Premium Insurance Shield (+$4.00)</Text>
              <Text style={styles.toggleSub}>Full value protection up to $2,500 with zero deductible</Text>
            </View>
            <Switch
              value={insurance}
              onValueChange={setInsurance}
              trackColor={{ false: '#374151', true: COLORS.green }}
              thumbColor="#ffffff"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.toggleRow}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={styles.toggleTitle}>Adult Signature Required (+$2.50)</Text>
              <Text style={styles.toggleSub}>Courier verifies identity before handover</Text>
            </View>
            <Switch
              value={signatureReq}
              onValueChange={setSignatureReq}
              trackColor={{ false: '#374151', true: COLORS.green }}
              thumbColor="#ffffff"
            />
          </View>
        </View>

        {/* Live Calculation Quote Card */}
        <View style={styles.quoteCard}>
          <Text style={styles.quoteCardTitle}>Price Breakdown</Text>

          <View style={styles.quoteRow}>
            <Text style={styles.quoteLabel}>Base Freight Rate</Text>
            <Text style={styles.quoteValue}>${baseRate.toFixed(2)}</Text>
          </View>

          <View style={styles.quoteRow}>
            <Text style={styles.quoteLabel}>Weight ({weightKg.toFixed(1)} kg)</Text>
            <Text style={styles.quoteValue}>${weightCost.toFixed(2)}</Text>
          </View>

          {insurance && (
            <View style={styles.quoteRow}>
              <Text style={styles.quoteLabel}>Premium Insurance Shield</Text>
              <Text style={styles.quoteValue}>$4.00</Text>
            </View>
          )}

          {signatureReq && (
            <View style={styles.quoteRow}>
              <Text style={styles.quoteLabel}>Adult Signature Handover</Text>
              <Text style={styles.quoteValue}>$2.50</Text>
            </View>
          )}

          <View style={styles.quoteTotalRow}>
            <Text style={styles.quoteTotalLabel}>Total Estimate</Text>
            <Text style={styles.quoteTotalValue}>${totalCost.toFixed(2)}</Text>
          </View>

          <TouchableOpacity
            style={styles.bookButton}
            onPress={handleBook}
            activeOpacity={0.85}
          >
            <Text style={styles.bookButtonText}>Book This Shipment →</Text>
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
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 10,
  },
  tierGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  tierOption: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    position: 'relative',
  },
  tierOptionActive: {
    borderColor: COLORS.green,
    backgroundColor: '#162319',
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    backgroundColor: COLORS.green,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  popularBadgeText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#000000',
  },
  tierOptionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 6,
    marginBottom: 2,
  },
  tierOptionTitleActive: {
    color: COLORS.green,
  },
  tierOptionTime: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  tierOptionPrice: {
    fontSize: 11,
    fontWeight: '700',
    color: '#d1d5db',
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dotOrigin: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.orange,
  },
  dotDestination: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.green,
  },
  inputLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  textInput: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    padding: 0,
  },
  routeDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 12,
    marginLeft: 22,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  weightValue: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
  },
  kgText: {
    fontSize: 16,
    color: COLORS.green,
    fontWeight: '700',
  },
  weightSub: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  stepperControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stepBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#252831',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  toggleTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  toggleSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 10,
  },
  quoteCard: {
    backgroundColor: '#162319',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#1e3a24',
    marginTop: 20,
  },
  quoteCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
  },
  quoteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  quoteLabel: {
    fontSize: 13,
    color: '#9ca3af',
  },
  quoteValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#d1d5db',
  },
  quoteTotalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#233827',
    paddingTop: 12,
    marginTop: 8,
    marginBottom: 16,
  },
  quoteTotalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
  },
  quoteTotalValue: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.green,
  },
  bookButton: {
    backgroundColor: COLORS.green,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  bookButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#000000',
  },
});
