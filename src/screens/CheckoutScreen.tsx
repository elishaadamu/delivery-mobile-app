import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { api } from '../services/api';

interface CheckoutScreenProps {
  onBack: () => void;
  onPaymentSuccess?: () => void;
}

export default function CheckoutScreen({
  onBack,
  onPaymentSuccess,
}: CheckoutScreenProps) {
  const [payPreference, setPayPreference] = useState<'now' | 'later'>('now');
  const [paymentMethod, setPaymentMethod] = useState<'apple' | 'visa' | 'stripe' | 'other'>('visa');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  const totalAmount = 60.30;

  const handlePay = async () => {
    setIsProcessing(true);
    try {
      await api.getPrices();
    } catch {
      // offline fallback
    }
    setTimeout(() => {
      setIsProcessing(false);
      setShowReceipt(true);
      onPaymentSuccess?.();
    }, 1000);
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

        <Text style={styles.headerTitle}>Checkout</Text>

        <View style={styles.iconButton} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Section: When do you prefer to pay? */}
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
            <Text style={styles.optionLabelBold}>Pay now</Text>
          </TouchableOpacity>

          {/* Option: Pay later */}
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
              <Text style={styles.optionLabelBold}>Pay later</Text>
              <Text style={styles.optionSubtext}>
                We'll charge your card on January 26
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Section: Payment method */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Payment method</Text>

          {/* Security Notice */}
          <View style={styles.securityNoticeRow}>
            <Feather name="lock" size={13} color={COLORS.yellow} />
            <Text style={styles.securityText}>
              Payments are secure and encrypted
            </Text>
          </View>

          {/* Method 1: Apple Pay */}
          <TouchableOpacity
            style={[
              styles.cardOptionBetween,
              paymentMethod === 'apple' && styles.cardOptionSelected,
            ]}
            onPress={() => setPaymentMethod('apple')}
            activeOpacity={0.85}
          >
            <View style={styles.optionLeft}>
              <View
                style={[
                  styles.radioOuter,
                  paymentMethod === 'apple' && styles.radioOuterSelected,
                ]}
              >
                {paymentMethod === 'apple' && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.optionLabel}>Apple Pay</Text>
            </View>

            <View style={styles.appleLogoBox}>
              <Ionicons name="logo-apple" size={18} color="#ffffff" />
            </View>
          </TouchableOpacity>

          {/* Method 2: Visa (Selected by default) */}
          <TouchableOpacity
            style={[
              styles.cardOptionBetween,
              paymentMethod === 'visa' && styles.cardOptionSelected,
            ]}
            onPress={() => setPaymentMethod('visa')}
            activeOpacity={0.85}
          >
            <View style={styles.optionLeft}>
              <View
                style={[
                  styles.radioOuter,
                  paymentMethod === 'visa' && styles.radioOuterSelected,
                ]}
              >
                {paymentMethod === 'visa' && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.optionLabel}>Visa</Text>
            </View>

            <View style={styles.visaBadgeBox}>
              <Text style={styles.visaBadgeText}>VISA</Text>
            </View>
          </TouchableOpacity>

          {/* Method 3: Stripe */}
          <TouchableOpacity
            style={[
              styles.cardOptionBetween,
              paymentMethod === 'stripe' && styles.cardOptionSelected,
            ]}
            onPress={() => setPaymentMethod('stripe')}
            activeOpacity={0.85}
          >
            <View style={styles.optionLeft}>
              <View
                style={[
                  styles.radioOuter,
                  paymentMethod === 'stripe' && styles.radioOuterSelected,
                ]}
              >
                {paymentMethod === 'stripe' && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.optionLabel}>Stripe</Text>
            </View>

            <View style={styles.stripeBadgeBox}>
              <Text style={styles.stripeBadgeText}>S</Text>
            </View>
          </TouchableOpacity>

          {/* Choose another button */}
          <TouchableOpacity
            style={styles.chooseAnotherButton}
            onPress={() => setPaymentMethod('other')}
          >
            <Text style={styles.chooseAnotherText}>Choose another</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Payment Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.alreadyPaidAction}
          onPress={handlePay}
          activeOpacity={0.85}
        >
          <View style={styles.checkCircleBox}>
            {isProcessing ? (
              <ActivityIndicator size="small" color={COLORS.green} />
            ) : (
              <Feather name="check" size={16} color={COLORS.green} />
            )}
          </View>
          <Text style={styles.alreadyPaidText}>Already paid</Text>
        </TouchableOpacity>

        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmountText}>$ {totalAmount.toFixed(2)}</Text>
        </View>
      </View>

      {/* Receipt Modal */}
      <Modal
        visible={showReceipt}
        transparent
        animationType="fade"
        onRequestClose={() => setShowReceipt(false)}
      >
        <View style={styles.receiptOverlay}>
          <View style={styles.receiptBox}>
            <View style={styles.receiptCheckCircle}>
              <Ionicons name="checkmark-done" size={28} color={COLORS.green} />
            </View>
            <Text style={styles.receiptTitle}>Payment Confirmed</Text>
            <Text style={styles.receiptSub}>
              Processed via SM Data API Gateway (api.smdata.com.ng)
            </Text>

            <View style={styles.receiptCard}>
              <View style={styles.receiptLine}>
                <Text style={styles.receiptLineLabel}>Tracking №</Text>
                <Text style={styles.receiptLineValue}>A425HYJ8</Text>
              </View>
              <View style={styles.receiptLine}>
                <Text style={styles.receiptLineLabel}>Method</Text>
                <Text style={styles.receiptLineValue}>
                  {paymentMethod.toUpperCase()}
                </Text>
              </View>
              <View style={styles.receiptLine}>
                <Text style={styles.receiptLineLabel}>Amount</Text>
                <Text style={styles.receiptLineHighlight}>${totalAmount.toFixed(2)}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.receiptDoneButton}
              onPress={() => setShowReceipt(false)}
            >
              <Text style={styles.receiptDoneText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    paddingBottom: 24,
  },
  sectionContainer: {
    marginBottom: 24,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 16,
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
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 14,
  },
  cardOptionBetween: {
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
  cardOptionSelected: {
    borderColor: COLORS.green,
    borderWidth: 2,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#6b7280',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: COLORS.green,
    backgroundColor: 'rgba(34,197,94,0.1)',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.green,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  optionLabelBold: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  optionSubtext: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  appleLogoBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  visaBadgeBox: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#1f222d',
    borderWidth: 1,
    borderColor: '#374151',
  },
  visaBadgeText: {
    fontSize: 12,
    fontWeight: '900',
    fontStyle: 'italic',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  stripeBadgeBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: COLORS.stripePurple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stripeBadgeText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#ffffff',
  },
  chooseAnotherButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  chooseAnotherText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#d1d5db',
  },
  bottomBar: {
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: '#21242d',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 88 : 78,
  },
  alreadyPaidAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkCircleBox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.greenBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.3)',
  },
  alreadyPaidText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.green,
  },
  totalBox: {
    alignItems: 'flex-end',
  },
  totalLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  totalAmountText: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.text,
  },
  receiptOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  receiptBox: {
    width: '100%',
    backgroundColor: COLORS.card,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 24,
    alignItems: 'center',
  },
  receiptCheckCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.greenBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  receiptTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  receiptSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 18,
  },
  receiptCard: {
    width: '100%',
    backgroundColor: '#14161c',
    borderRadius: 16,
    padding: 14,
    gap: 10,
    marginBottom: 18,
  },
  receiptLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  receiptLineLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  receiptLineValue: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
  },
  receiptLineHighlight: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.green,
  },
  receiptDoneButton: {
    width: '100%',
    backgroundColor: COLORS.green,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  receiptDoneText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#000000',
  },
});
