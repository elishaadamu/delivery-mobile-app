import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { initialUser, MobileUserProfile } from '../data/mockData';

interface CustomerCardProps {
  user?: MobileUserProfile;
  onScanPress?: () => void;
  compact?: boolean;
}

export const CustomerCard: React.FC<CustomerCardProps> = ({
  user = initialUser,
  onScanPress,
  compact = false,
}) => {
  const [showQrModal, setShowQrModal] = useState(false);
  const [balance, setBalance] = useState(user.walletBalance || 45500);
  const [showTopUpModal, setShowTopUpModal] = useState(false);

  const handleQuickTopUp = (amount: number) => {
    setBalance((prev) => prev + amount);
    setShowTopUpModal(false);
    Alert.alert(
      'Wallet Credited! 💳',
      `₦${amount.toLocaleString()} was added to your Swift Wallet via Paystack instant transfer.\nNew Balance: ₦${(balance + amount).toLocaleString()}`
    );
  };

  return (
    <View style={[styles.cardContainer, compact && styles.compactCard]}>
      {/* Background Decorative Rings */}
      <View style={styles.decorativeCircle1} />
      <View style={styles.decorativeCircle2} />

      {/* Card Header */}
      <View style={styles.cardHeader}>
        <View style={styles.brandGroup}>
          <View style={styles.logoBadge}>
            <Ionicons name="flash" size={16} color="#ffffff" />
          </View>
          <View>
            <Text style={styles.brandTitle}>SWIFT PRIORITY</Text>
            <Text style={styles.cardTier}>VIP MEMBER • NIGERIA</Text>
          </View>
        </View>
        <View style={styles.chipGraphic}>
          <Ionicons name="hardware-chip-outline" size={28} color="#fcd34d" />
          <Ionicons name="wifi" size={16} color="#94a3b8" style={{ marginLeft: 4, transform: [{ rotate: '90deg' }] }} />
        </View>
      </View>

      {/* Card Body - Balance & Member Info */}
      <View style={styles.cardBody}>
        <View>
          <Text style={styles.balanceLabel}>AVAILABLE LOGISTICS WALLET</Text>
          <Text style={styles.balanceAmount}>₦{balance.toLocaleString()}.00</Text>
        </View>

        <View style={styles.memberIdBadge}>
          <Text style={styles.memberIdText}>{user.membershipId || 'NG-7842-8920'}</Text>
        </View>
      </View>

      {/* Card Footer */}
      <View style={styles.cardFooter}>
        <View>
          <Text style={styles.cardholderLabel}>CARDHOLDER</Text>
          <Text style={styles.cardholderName}>{user.name.toUpperCase()}</Text>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.actionPill}
            onPress={() => setShowTopUpModal(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="add-circle" size={14} color="#ffffff" />
            <Text style={styles.actionText}>Top Up</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionPill, styles.qrPill]}
            onPress={() => setShowQrModal(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="qr-code" size={14} color="#0f172a" />
            <Text style={[styles.actionText, { color: '#0f172a' }]}>QR Pass</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* QR Pass Modal */}
      <Modal
        visible={showQrModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowQrModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.qrModalContent}>
            <View style={styles.qrModalHeader}>
              <Text style={styles.qrModalTitle}>Priority Member Pass</Text>
              <TouchableOpacity onPress={() => setShowQrModal(false)}>
                <Ionicons name="close-circle" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <View style={styles.qrDisplayBox}>
              <Ionicons name="qr-code" size={160} color="#0f172a" />
              <Text style={styles.qrCodeString}>{user.membershipId || 'NG-7842-8920'}</Text>
            </View>

            <Text style={styles.qrInstructions}>
              Show this QR code at any Swift Logistics Hub in Lagos, Abuja, or Port Harcourt for express drop-off and pickup without waiting.
            </Text>

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setShowQrModal(false)}
            >
              <Text style={styles.closeBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Top Up Modal */}
      <Modal
        visible={showTopUpModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTopUpModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.topUpModalContent}>
            <View style={styles.qrModalHeader}>
              <View>
                <Text style={styles.qrModalTitle}>Instant Wallet Top-Up</Text>
                <Text style={styles.topUpSubtitle}>Fund your Naira wallet via Paystack / Bank Card</Text>
              </View>
              <TouchableOpacity onPress={() => setShowTopUpModal(false)}>
                <Ionicons name="close-circle" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <View style={styles.quickAmountsGrid}>
              {[5000, 10000, 20000, 50000].map((amt) => (
                <TouchableOpacity
                  key={amt}
                  style={styles.amountOption}
                  onPress={() => handleQuickTopUp(amt)}
                >
                  <Text style={styles.amountOptionText}>+₦{amt.toLocaleString()}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.secureText}>
              <Ionicons name="shield-checkmark" size={14} color="#22c55e" /> Secured with 256-bit encryption & CBN compliant
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#0f172a',
    borderRadius: 22,
    padding: 22,
    marginVertical: 14,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  compactCard: {
    padding: 16,
    marginVertical: 8,
  },
  decorativeCircle1: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#22c55e',
    opacity: 0.12,
    right: -40,
    top: -50,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#3b82f6',
    opacity: 0.08,
    left: -40,
    bottom: -40,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#22c55e',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  brandTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
  },
  cardTier: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  chipGraphic: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 22,
  },
  balanceLabel: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  balanceAmount: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  memberIdBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  memberIdText: {
    color: '#38bdf8',
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: '700',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 14,
  },
  cardholderLabel: {
    color: '#64748b',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  cardholderName: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: '800',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    gap: 5,
    borderWidth: 1,
    borderColor: '#334155',
  },
  qrPill: {
    backgroundColor: '#ffffff',
    borderColor: '#ffffff',
  },
  actionText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  qrModalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  qrModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  qrModalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  qrDisplayBox: {
    backgroundColor: '#f8fafc',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
  },
  qrCodeString: {
    fontFamily: 'monospace',
    fontWeight: '700',
    fontSize: 13,
    color: '#475569',
    marginTop: 10,
  },
  qrInstructions: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  closeBtn: {
    backgroundColor: '#0f172a',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 15,
  },
  topUpModalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 360,
  },
  topUpSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  quickAmountsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginVertical: 20,
  },
  amountOption: {
    flexBasis: '47%',
    backgroundColor: '#f1f5f9',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  amountOptionText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },
  secureText: {
    fontSize: 11,
    color: '#64748b',
    textAlign: 'center',
  },
});
