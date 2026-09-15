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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

interface PriceScreenProps {
  onBack: () => void;
  onProceedToCheckout?: () => void;
}

export default function PriceScreen({ onBack, onProceedToCheckout }: PriceScreenProps) {
  const insets = useSafeAreaInsets();
  const [tier, setTier] = useState<'ground' | 'air' | 'same_day'>('air');
  const [origin, setOrigin] = useState('Ikeja, Lagos State');
  const [destination, setDestination] = useState('Wuse II, Abuja FCT');
  const [weightKg, setWeightKg] = useState(2.5);
  const [insurance, setInsurance] = useState(true);
  const [signatureReq, setSignatureReq] = useState(true);

  // Rate calculations in Nigerian Naira (₦)
  const baseRate = tier === 'ground' ? 8500 : tier === 'air' ? 18000 : 25000;
  const weightCost = weightKg * 2000;
  const insuranceCost = insurance ? 2500 : 0;
  const signatureCost = signatureReq ? 1000 : 0;
  const totalCost = baseRate + weightCost + insuranceCost + signatureCost;

  const handleBook = () => {
    Alert.alert(
      '📦 Shipment Quote Confirmed',
      `Total: ₦${totalCost.toLocaleString()}\nOrigin: ${origin}\nDestination: ${destination}\nTier: ${
        tier === 'ground'
          ? 'Standard Interstate Freight'
          : tier === 'air'
          ? 'Express Next-Day Air'
          : 'Same-Day Metro VIP'
      }`,
      [
        { text: 'Proceed to Payment', onPress: () => onProceedToCheckout?.() },
        { text: 'Cancel', style: 'cancel' },
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

        <Text style={styles.headerTitle}>Nigeria Rate Calculator</Text>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => {
            setWeightKg(2.5);
            setTier('air');
            setInsurance(true);
            setSignatureReq(true);
            setOrigin('Ikeja, Lagos State');
            setDestination('Wuse II, Abuja FCT');
          }}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Feather name="rotate-ccw" size={18} color="#9ca3af" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Speed Tier Selection */}
        <Text style={styles.sectionTitle}>Delivery Speed & Transit Mode</Text>
        <View style={styles.tierGrid}>
          {/* Ground */}
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
            <Text style={styles.tierOptionTime}>2-3 Days</Text>
            <Text style={styles.tierOptionPrice}>From ₦8,500</Text>
          </TouchableOpacity>

          {/* Air Express */}
          <TouchableOpacity
            style={[styles.tierOption, tier === 'air' && styles.tierOptionActive]}
            onPress={() => setTier('air')}
            activeOpacity={0.85}
          >
            <MaterialCommunityIcons
              name="airplane"
              size={22}
              color={tier === 'air' ? COLORS.green : '#9ca3af'}
            />
            <Text style={[styles.tierOptionTitle, tier === 'air' && styles.tierOptionTitleActive]}>
              Express
            </Text>
            <Text style={styles.tierOptionTime}>Next Day</Text>
            <Text style={styles.tierOptionPrice}>From ₦18,000</Text>
          </TouchableOpacity>

          {/* Same Day */}
          <TouchableOpacity
            style={[styles.tierOption, tier === 'same_day' && styles.tierOptionActive]}
            onPress={() => setTier('same_day')}
            activeOpacity={0.85}
          >
            <MaterialCommunityIcons
              name="lightning-bolt"
              size={22}
              color={tier === 'same_day' ? COLORS.green : '#9ca3af'}
            />
            <Text style={[styles.tierOptionTitle, tier === 'same_day' && styles.tierOptionTitleActive]}>
              Same Day
            </Text>
            <Text style={styles.tierOptionTime}>Within 6h</Text>
            <Text style={styles.tierOptionPrice}>From ₦25,000</Text>
          </TouchableOpacity>
        </View>

        {/* Origin & Destination Inputs */}
        <Text style={styles.sectionTitle}>Nigerian Route</Text>
        <View style={styles.routeCard}>
          <View style={styles.routeInputRow}>
            <Ionicons name="radio-button-on" size={18} color={COLORS.green} />
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Pickup / Origin</Text>
              <TextInput
                style={styles.textInput}
                value={origin}
                onChangeText={setOrigin}
                placeholder="e.g. Ikeja, Lagos"
                placeholderTextColor="#6b7280"
              />
            </View>
          </View>

          <View style={styles.routeDivider} />

          <View style={styles.routeInputRow}>
            <Ionicons name="location" size={18} color={COLORS.orange} />
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Delivery / Destination</Text>
              <TextInput
                style={styles.textInput}
                value={destination}
                onChangeText={setDestination}
                placeholder="e.g. Wuse II, Abuja"
                placeholderTextColor="#6b7280"
              />
            </View>
          </View>
        </View>

        {/* Parcel Weight Selector */}
        <Text style={styles.sectionTitle}>Estimated Weight</Text>
        <View style={styles.weightCard}>
          <View style={styles.weightDisplayRow}>
            <Text style={styles.weightValue}>{weightKg.toFixed(1)} <Text style={styles.weightUnit}>kg</Text></Text>
            <Text style={styles.weightRate}>₦2,000 / kg standard freight</Text>
          </View>

          <View style={styles.weightButtonsRow}>
            {[0.5, 1.0, 2.5, 5.0, 10.0].map((w) => (
              <TouchableOpacity
                key={w}
                style={[styles.weightPill, weightKg === w && styles.weightPillActive]}
                onPress={() => setWeightKg(w)}
              >
                <Text style={[styles.weightPillText, weightKg === w && styles.weightPillTextActive]}>
                  {w} kg
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Protection & Extras */}
        <Text style={styles.sectionTitle}>Add-on Protection</Text>
        <View style={styles.extrasCard}>
          <View style={styles.extraRow}>
            <View style={styles.extraLeft}>
              <MaterialCommunityIcons name="shield-check" size={20} color={COLORS.green} />
              <View>
                <Text style={styles.extraTitle}>Full Transit Insurance (₦2,500)</Text>
                <Text style={styles.extraSub}>100% loss/damage reimbursement up to ₦2.5M</Text>
              </View>
            </View>
            <Switch
              value={insurance}
              onValueChange={setInsurance}
              trackColor={{ false: '#374151', true: COLORS.green }}
              thumbColor="#ffffff"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.extraRow}>
            <View style={styles.extraLeft}>
              <Feather name="pen-tool" size={18} color="#60a5fa" />
              <View>
                <Text style={styles.extraTitle}>Digital Signature Proof (₦1,000)</Text>
                <Text style={styles.extraSub}>Biometric / OTP recipient handover verification</Text>
              </View>
            </View>
            <Switch
              value={signatureReq}
              onValueChange={setSignatureReq}
              trackColor={{ false: '#374151', true: COLORS.green }}
              thumbColor="#ffffff"
            />
          </View>
        </View>

        {/* Cost Summary & Booking CTA */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryLine}>
            <Text style={styles.summaryLabel}>Base Courier Freight</Text>
            <Text style={styles.summaryValue}>₦{baseRate.toLocaleString()}</Text>
          </View>
          <View style={styles.summaryLine}>
            <Text style={styles.summaryLabel}>Weight Charge ({weightKg} kg)</Text>
            <Text style={styles.summaryValue}>₦{weightCost.toLocaleString()}</Text>
          </View>
          {insurance && (
            <View style={styles.summaryLine}>
              <Text style={styles.summaryLabel}>Transit Insurance Shield</Text>
              <Text style={styles.summaryValue}>₦{insuranceCost.toLocaleString()}</Text>
            </View>
          )}
          {signatureReq && (
            <View style={styles.summaryLine}>
              <Text style={styles.summaryLabel}>Verified Recipient Handover</Text>
              <Text style={styles.summaryValue}>₦{signatureCost.toLocaleString()}</Text>
            </View>
          )}

          <View style={styles.totalRow}>
            <View>
              <Text style={styles.totalLabel}>Estimated Total</Text>
              <Text style={styles.totalAmount}>₦{totalCost.toLocaleString()}</Text>
            </View>

            <TouchableOpacity style={styles.bookButton} onPress={handleBook} activeOpacity={0.85}>
              <Text style={styles.bookButtonText}>Book Delivery</Text>
              <Feather name="arrow-right" size={16} color="#000000" />
            </TouchableOpacity>
          </View>
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
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 10,
    marginTop: 16,
  },
  tierGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  tierOption: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tierOptionActive: {
    borderColor: COLORS.green,
    backgroundColor: '#16221a',
  },
  tierOptionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 6,
  },
  tierOptionTitleActive: {
    color: COLORS.green,
  },
  tierOptionTime: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  tierOptionPrice: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 6,
  },
  routeCard: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  routeInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  routeDivider: {
    height: 1,
    backgroundColor: '#262a36',
    marginVertical: 12,
    marginLeft: 30,
  },
  inputWrapper: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  textInput: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
    padding: 0,
  },
  weightCard: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  weightDisplayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 14,
  },
  weightValue: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.text,
  },
  weightUnit: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  weightRate: {
    fontSize: 12,
    color: COLORS.green,
    fontWeight: '600',
  },
  weightButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  weightPill: {
    flex: 1,
    backgroundColor: '#1c1f26',
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#262a36',
  },
  weightPillActive: {
    backgroundColor: COLORS.greenBg,
    borderColor: COLORS.green,
  },
  weightPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  weightPillTextActive: {
    color: COLORS.green,
  },
  extrasCard: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  extraRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  extraLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    marginRight: 10,
  },
  extraTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  extraSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#262a36',
    marginVertical: 12,
  },
  summaryCard: {
    backgroundColor: '#161922',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#262a36',
    marginTop: 20,
  },
  summaryLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#262a36',
    paddingTop: 14,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.green,
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.green,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 18,
    gap: 6,
  },
  bookButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#000000',
  },
});
