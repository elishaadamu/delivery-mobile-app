import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PromoModalProps {
  visible: boolean;
  code?: string;
  discountPercentage?: number;
  discountAmount?: number;
  onClose: () => void;
}

export const PromoModal: React.FC<PromoModalProps> = ({
  visible,
  code = 'SWIFT20',
  discountPercentage = 20,
  discountAmount = 3000,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          {/* Confetti / Star burst header */}
          <View style={styles.iconCircle}>
            <Ionicons name="gift" size={44} color="#16a34a" />
          </View>

          <Text style={styles.congratsTitle}>PROMO CODE APPLIED! 🎉</Text>
          <Text style={styles.congratsSubtitle}>
            Your discount voucher has been successfully validated.
          </Text>

          {/* Voucher Ticket Box */}
          <View style={styles.ticketBox}>
            <View style={styles.ticketHeader}>
              <View style={styles.codeTag}>
                <Ionicons name="pricetag" size={14} color="#ffffff" />
                <Text style={styles.codeText}>{code}</Text>
              </View>
              <Text style={styles.percentBadge}>{discountPercentage}% OFF</Text>
            </View>

            <View style={styles.dashedDivider} />

            <View style={styles.savingsRow}>
              <Text style={styles.savingsLabel}>You Save on this Delivery:</Text>
              <Text style={styles.savingsValue}>-₦{discountAmount.toLocaleString()}</Text>
            </View>

            <Text style={styles.termsNote}>
              Applicable across all intra-state and inter-state logistics in Nigeria.
            </Text>
          </View>

          {/* Action Button */}
          <TouchableOpacity
            style={styles.confirmBtn}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.confirmBtnText}>Great, Continue Shipping</Text>
            <Ionicons name="arrow-forward" size={18} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 28,
    padding: 24,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#dcfce7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 4,
    borderColor: '#bbf7d0',
  },
  congratsTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0f172a',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  congratsSubtitle: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
    lineHeight: 18,
  },
  ticketBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
    padding: 16,
    width: '100%',
    marginBottom: 24,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  codeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16a34a',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 6,
  },
  codeText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 1,
  },
  percentBadge: {
    fontSize: 14,
    fontWeight: '900',
    color: '#16a34a',
  },
  dashedDivider: {
    height: 1,
    backgroundColor: '#cbd5e1',
    marginVertical: 14,
  },
  savingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  savingsLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  savingsValue: {
    fontSize: 17,
    fontWeight: '900',
    color: '#16a34a',
  },
  termsNote: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 10,
    textAlign: 'center',
  },
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#16a34a',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
});
