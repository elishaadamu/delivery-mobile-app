import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { packagesData, PackageDetail, markPackageAsPaid } from '../data/mockData';
import { pdfService } from '../services/pdfService';

interface CheckoutScreenProps {
  onBack: () => void;
  onPaymentSuccess?: (packageId: string) => void;
  onNavigateToTracking?: (packageId: string) => void;
  onNavigateToHome?: () => void;
  packageItem?: PackageDetail;
}

export default function CheckoutScreen({
  onBack,
  onPaymentSuccess,
  onNavigateToTracking,
  onNavigateToHome,
  packageItem = packagesData['ship-1'],
}: CheckoutScreenProps) {
  const insets = useSafeAreaInsets();
  const [currentPkg, setCurrentPkg] = useState<PackageDetail>(packageItem);
  const [isPaid, setIsPaid] = useState<boolean>(packageItem.payment.isPaid);
  const [payPreference, setPayPreference] = useState<'now' | 'later'>('now');
  const [paymentMethod, setPaymentMethod] = useState<'paystack' | 'card' | 'wallet' | 'bank'>('paystack');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const totalAmount = currentPkg.payment.total || 26337.50;

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const methodName =
        paymentMethod === 'paystack'
          ? 'Paystack Instant Transfer'
          : paymentMethod === 'card'
          ? 'Debit Card (Mastercard / Verve)'
          : paymentMethod === 'wallet'
          ? 'Swift Priority Wallet'
          : 'Direct Bank Transfer';

      const updated = markPackageAsPaid(currentPkg.id, methodName);
      setCurrentPkg({ ...updated });
      setIsPaid(true);
      setIsProcessing(false);
      onPaymentSuccess?.(currentPkg.id);
    }, 850);
  };

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      await pdfService.generateAndShareReceiptPdf(currentPkg);
    } catch (e) {
      Alert.alert('PDF Receipt Ready', `Invoice for package №${currentPkg.trackingNumber} generated.`);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // -------------------------------------------------------------
  // VIEW 1: PAYMENT CONFIRMED / ALREADY PAID (Next Steps Flow)
  // -------------------------------------------------------------
  if (isPaid) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Top Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onNavigateToHome || onBack}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Feather name="x" size={24} color="#ffffff" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Payment Confirmation</Text>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleDownloadPdf}
            disabled={isGeneratingPdf}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Feather name="share-2" size={20} color={COLORS.green} />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.successScrollContent, { paddingBottom: insets.bottom + 30 }]}
        >
          {/* Confirmed Hero Banner */}
          <View style={styles.successCard}>
            <View style={styles.successIconCircle}>
              <Ionicons name="checkmark-done" size={42} color="#16a34a" />
            </View>

            <View style={styles.paidBadgePill}>
              <Text style={styles.paidBadgePillText}>✓ PAYMENT CONFIRMED & CLEARED</Text>
            </View>

            <Text style={styles.successHeading}>₦{totalAmount.toLocaleString()}</Text>
            <Text style={styles.successSub}>
              Dispatched via Swift Express Logistics Nigeria
            </Text>

            {/* Receipt Summary Table */}
            <View style={styles.receiptSummaryBox}>
              <View style={styles.receiptSummaryRow}>
                <Text style={styles.summaryLabelText}>Waybill / Tracking №</Text>
                <Text style={styles.summaryValueText}>{currentPkg.trackingNumber}</Text>
              </View>

              <View style={styles.summaryDivider} />

              <View style={styles.receiptSummaryRow}>
                <Text style={styles.summaryLabelText}>Payment Channel</Text>
                <Text style={styles.summaryValueText}>{currentPkg.payment.method || 'Paystack Instant'}</Text>
              </View>

              <View style={styles.summaryDivider} />

              <View style={styles.receiptSummaryRow}>
                <Text style={styles.summaryLabelText}>Statutory VAT (7.5%)</Text>
                <Text style={styles.summaryValueText}>
                  ₦{(currentPkg.payment.vat || Math.round(currentPkg.payment.shipmentCost * 0.075)).toLocaleString()}
                </Text>
              </View>

              <View style={styles.summaryDivider} />

              <View style={styles.receiptSummaryRow}>
                <Text style={styles.summaryLabelText}>Transit Destination</Text>
                <Text style={[styles.summaryValueText, { maxWidth: '55%', textAlign: 'right' }]}>
                  {currentPkg.parcelData.destination}
                </Text>
              </View>
            </View>
          </View>

          {/* NEXT STEPS SECTION */}
          <Text style={styles.nextStepsSectionTitle}>WHAT WOULD YOU LIKE TO DO NEXT?</Text>

          {/* Action 1: Track Package in Real-Time */}
          <TouchableOpacity
            style={styles.primaryActionCard}
            onPress={() => onNavigateToTracking ? onNavigateToTracking(currentPkg.id) : onBack()}
            activeOpacity={0.85}
          >
            <View style={styles.actionIconBoxGreen}>
              <MaterialCommunityIcons name="truck-fast" size={26} color="#000000" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.primaryActionTitle}>Track Shipment Live</Text>
              <Text style={styles.primaryActionSub}>
                View real-time courier GPS progress and checkpoint timeline
              </Text>
            </View>
            <Feather name="arrow-right" size={20} color={COLORS.green} />
          </TouchableOpacity>

          {/* Action 2: Download / Print Real PDF Receipt */}
          <TouchableOpacity
            style={styles.secondaryActionCard}
            onPress={handleDownloadPdf}
            disabled={isGeneratingPdf}
            activeOpacity={0.85}
          >
            <View style={styles.actionIconBoxDark}>
              {isGeneratingPdf ? (
                <ActivityIndicator size="small" color="#22c55e" />
              ) : (
                <MaterialCommunityIcons name="file-pdf-box" size={26} color="#22c55e" />
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.secondaryActionTitle}>Download Official PDF Invoice</Text>
              <Text style={styles.secondaryActionSub}>
                Verified tax receipt with RC 1892842 & FIRS VAT breakdown
              </Text>
            </View>
            <Feather name="download" size={18} color="#94a3b8" />
          </TouchableOpacity>

          {/* Action 3: Return to Home */}
          <TouchableOpacity
            style={styles.homeReturnBtn}
            onPress={onNavigateToHome || onBack}
            activeOpacity={0.8}
          >
            <Ionicons name="home-outline" size={18} color="#94a3b8" />
            <Text style={styles.homeReturnBtnText}>Back to Home Dashboard</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: UNPAID CHECKOUT (Enter details & Pay)
  // -------------------------------------------------------------
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

        <Text style={styles.headerTitle}>Checkout & Payment</Text>

        <View style={styles.iconButton} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 110 }]}
      >
        {/* Order Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryTop}>
            <View>
              <Text style={styles.summaryTag}>WAYBILL №</Text>
              <Text style={styles.summaryTracking}>{currentPkg.trackingNumber}</Text>
            </View>
            <View style={styles.unpaidStatusPill}>
              <Text style={styles.unpaidStatusText}>PENDING PAYMENT</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.routeRow}>
            <Ionicons name="navigate-circle" size={18} color={COLORS.green} />
            <Text style={styles.routeText} numberOfLines={1}>
              {currentPkg.parcelData.sender}
            </Text>
          </View>
          <View style={[styles.routeRow, { marginTop: 8 }]}>
            <Ionicons name="location" size={18} color={COLORS.orange} />
            <Text style={styles.routeText} numberOfLines={1}>
              {currentPkg.parcelData.destination}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.specsRow}>
            <Text style={styles.specsText}>Category: <Text style={styles.specsValue}>{currentPkg.parcelData.category}</Text></Text>
            <Text style={styles.specsText}>Weight: <Text style={styles.specsValue}>{currentPkg.parcelData.weight}</Text></Text>
          </View>
        </View>

        {/* Section: Payment Timing Preference */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>When do you prefer to pay?</Text>

          {/* Option: Pay now */}
          <TouchableOpacity
            style={[
              styles.cardOption,
              payPreference === 'now' && styles.cardOptionSelected,
            ]}
            onPress={() => setPayPreference('now')}
            activeOpacity={0.85}
          >
            <View
              style={[
                styles.radioOuter,
                payPreference === 'now' && styles.radioOuterSelected,
              ]}
            >
              {payPreference === 'now' && <View style={styles.radioInner} />}
            </View>
            <View>
              <Text style={styles.optionLabelBold}>Pay Now (Instant Automated Clearance)</Text>
              <Text style={styles.optionSubtext}>
                Instant confirmation and priority courier dispatch
              </Text>
            </View>
          </TouchableOpacity>

          {/* Option: Pay later / On Delivery */}
          <TouchableOpacity
            style={[
              styles.cardOption,
              payPreference === 'later' && styles.cardOptionSelected,
            ]}
            onPress={() => setPayPreference('later')}
            activeOpacity={0.85}
          >
            <View
              style={[
                styles.radioOuter,
                payPreference === 'later' && styles.radioOuterSelected,
              ]}
            >
              {payPreference === 'later' && <View style={styles.radioInner} />}
            </View>
            <View>
              <Text style={styles.optionLabelBold}>Pay on Handover (POS / Cash)</Text>
              <Text style={styles.optionSubtext}>
                Pay courier rider upon delivery at destination
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Section: Nigerian Payment Channels */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Select Payment Channel</Text>

          <View style={styles.securityNoticeRow}>
            <Feather name="lock" size={13} color={COLORS.yellow} />
            <Text style={styles.securityText}>
              CBN Compliant • 256-Bit SSL Encrypted
            </Text>
          </View>

          {/* Paystack / Instant Bank Transfer */}
          <TouchableOpacity
            style={[
              styles.cardOptionBetween,
              paymentMethod === 'paystack' && styles.cardOptionSelected,
            ]}
            onPress={() => setPaymentMethod('paystack')}
            activeOpacity={0.85}
          >
            <View style={styles.optionLeft}>
              <View
                style={[
                  styles.radioOuter,
                  paymentMethod === 'paystack' && styles.radioOuterSelected,
                ]}
              >
                {paymentMethod === 'paystack' && <View style={styles.radioInner} />}
              </View>
              <View>
                <Text style={styles.optionLabel}>Paystack Instant Transfer</Text>
                <Text style={styles.optionSubtext}>Automated virtual bank account</Text>
              </View>
            </View>
            <View style={styles.paystackBadge}>
              <Text style={styles.paystackBadgeText}>PAYSTACK</Text>
            </View>
          </TouchableOpacity>

          {/* Naira Debit Card */}
          <TouchableOpacity
            style={[
              styles.cardOptionBetween,
              paymentMethod === 'card' && styles.cardOptionSelected,
            ]}
            onPress={() => setPaymentMethod('card')}
            activeOpacity={0.85}
          >
            <View style={styles.optionLeft}>
              <View
                style={[
                  styles.radioOuter,
                  paymentMethod === 'card' && styles.radioOuterSelected,
                ]}
              >
                {paymentMethod === 'card' && <View style={styles.radioInner} />}
              </View>
              <View>
                <Text style={styles.optionLabel}>Naira Debit Card</Text>
                <Text style={styles.optionSubtext}>Mastercard, Verve, Visa</Text>
              </View>
            </View>
            <View style={styles.visaBadgeBox}>
              <Text style={styles.visaBadgeText}>VERVE / VISA</Text>
            </View>
          </TouchableOpacity>

          {/* Swift Wallet */}
          <TouchableOpacity
            style={[
              styles.cardOptionBetween,
              paymentMethod === 'wallet' && styles.cardOptionSelected,
            ]}
            onPress={() => setPaymentMethod('wallet')}
            activeOpacity={0.85}
          >
            <View style={styles.optionLeft}>
              <View
                style={[
                  styles.radioOuter,
                  paymentMethod === 'wallet' && styles.radioOuterSelected,
                ]}
              >
                {paymentMethod === 'wallet' && <View style={styles.radioInner} />}
              </View>
              <View>
                <Text style={styles.optionLabel}>Swift Priority Wallet</Text>
                <Text style={styles.optionSubtext}>Available Balance: ₦45,800.00</Text>
              </View>
            </View>
            <View style={styles.walletBadge}>
              <Ionicons name="wallet" size={16} color="#22c55e" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Breakdown Card */}
        <View style={styles.breakdownCard}>
          <Text style={styles.breakdownTitle}>Fare Breakdown</Text>
          <View style={styles.breakdownLine}>
            <Text style={styles.breakdownLabel}>Freight Shipping Fee</Text>
            <Text style={styles.breakdownVal}>₦{currentPkg.payment.shipmentCost.toLocaleString()}</Text>
          </View>
          <View style={styles.breakdownLine}>
            <Text style={styles.breakdownLabel}>100% Transit Insurance Shield</Text>
            <Text style={styles.breakdownVal}>₦{currentPkg.payment.insurance.toLocaleString()}</Text>
          </View>
          <View style={styles.breakdownLine}>
            <Text style={styles.breakdownLabel}>Statutory FIRS VAT (7.5%)</Text>
            <Text style={styles.breakdownVal}>
              ₦{(currentPkg.payment.vat || Math.round(currentPkg.payment.shipmentCost * 0.075)).toLocaleString()}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Fully Unblocked Bottom Payment Bar (No tab bar overlapping) */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>Total Payable</Text>
          <Text style={styles.totalAmountText}>₦{totalAmount.toLocaleString()}</Text>
        </View>

        <TouchableOpacity
          style={styles.payNowBtn}
          onPress={handlePay}
          disabled={isProcessing}
          activeOpacity={0.85}
        >
          {isProcessing ? (
            <ActivityIndicator color="#000000" size="small" />
          ) : (
            <>
              <Feather name="lock" size={16} color="#000000" />
              <Text style={styles.payNowBtnText}>Pay Now</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
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
    paddingVertical: 14,
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
    paddingTop: 8,
  },
  summaryCard: {
    backgroundColor: '#161922',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#262a36',
    marginBottom: 20,
  },
  summaryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryTag: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 0.5,
  },
  summaryTracking: {
    fontSize: 17,
    fontWeight: '900',
    color: '#ffffff',
    marginTop: 2,
  },
  unpaidStatusPill: {
    backgroundColor: 'rgba(234, 179, 8, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(234, 179, 8, 0.3)',
  },
  unpaidStatusText: {
    color: '#facc15',
    fontSize: 10,
    fontWeight: '800',
  },
  divider: {
    height: 1,
    backgroundColor: '#262a36',
    marginVertical: 12,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  routeText: {
    fontSize: 12,
    color: '#cbd5e1',
    flex: 1,
    fontWeight: '600',
  },
  specsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  specsText: {
    fontSize: 12,
    color: '#94a3b8',
  },
  specsValue: {
    color: '#ffffff',
    fontWeight: '700',
  },
  sectionContainer: {
    marginBottom: 20,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  securityNoticeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  securityText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.yellow,
  },
  cardOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  cardOptionBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  cardOptionSelected: {
    borderColor: COLORS.green,
    backgroundColor: '#16221a',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#4b5563',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: COLORS.green,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.green,
  },
  optionLabelBold: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  optionSubtext: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  paystackBadge: {
    backgroundColor: '#0ba4db',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  paystackBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  visaBadgeBox: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  visaBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#1a1f71',
    letterSpacing: 0.5,
  },
  walletBadge: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  breakdownCard: {
    backgroundColor: '#161922',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#262a36',
    gap: 8,
    marginBottom: 20,
  },
  breakdownTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
  },
  breakdownLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  breakdownLabel: {
    fontSize: 12,
    color: '#94a3b8',
  },
  breakdownVal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#f1f5f9',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#161922',
    paddingHorizontal: 20,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#262a36',
  },
  totalBox: {
    justifyContent: 'center',
  },
  totalLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  totalAmountText: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  payNowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.green,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 26,
    gap: 8,
    shadowColor: COLORS.green,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  payNowBtnText: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '900',
  },

  // ---------------- SUCCESS FLOW STYLES ----------------
  successScrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  successCard: {
    backgroundColor: '#162b1d',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#1e3a24',
    alignItems: 'center',
    marginBottom: 24,
  },
  successIconCircle: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: '#dcfce7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 3,
    borderColor: '#86efac',
  },
  paidBadgePill: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.4)',
    marginBottom: 10,
  },
  paidBadgePillText: {
    color: '#86efac',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  successHeading: {
    fontSize: 32,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  successSub: {
    fontSize: 12,
    color: '#86efac',
    marginTop: 4,
    marginBottom: 18,
  },
  receiptSummaryBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 16,
    padding: 16,
    width: '100%',
    gap: 10,
  },
  receiptSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabelText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
  },
  summaryValueText: {
    fontSize: 13,
    color: '#ffffff',
    fontWeight: '800',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  nextStepsSectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 0.8,
    marginBottom: 12,
    marginLeft: 4,
  },
  primaryActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161922',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: COLORS.green,
    gap: 14,
    marginBottom: 12,
  },
  actionIconBoxGreen: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryActionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#ffffff',
  },
  primaryActionSub: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
    lineHeight: 16,
  },
  secondaryActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161922',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#262a36',
    gap: 14,
    marginBottom: 20,
  },
  actionIconBoxDark: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryActionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  secondaryActionSub: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
    lineHeight: 15,
  },
  homeReturnBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  homeReturnBtnText: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '700',
  },
});
