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
import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { getPackageById, PackageDetail } from '../data/mockData';

interface TrackingScreenProps {
  packageId?: string;
  onBack: () => void;
  onNavigateToCheckout: () => void;
}

export default function TrackingScreen({
  packageId = 'ship-1',
  onBack,
  onNavigateToCheckout,
}: TrackingScreenProps) {
  const data: PackageDetail = getPackageById(packageId);

  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({
    'step-transit': true,
    'step-received': true,
  });
  const [isPaymentOpen, setIsPaymentOpen] = useState(true);
  const [isParcelDataOpen, setIsParcelDataOpen] = useState(false);
  const [packageName, setPackageName] = useState(
    data.parcelData.category || 'My package'
  );
  const [isEditing, setIsEditing] = useState(false);

  const toggleStep = (stepId: string) => {
    setExpandedSteps((prev) => ({
      ...prev,
      [stepId]: !prev[stepId],
    }));
  };

  const handleShare = () => {
    Alert.alert('Share Tracking', `Tracking code №${data.trackingNumber} copied to clipboard!`);
  };

  const isOnTheWay = data.status === 'On the way';
  const isCompleted = data.status === 'Completed';

  return (
    <View style={styles.container}>
      {/* Top Navigation Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onBack}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather name="chevron-left" size={26} color="#ffffff" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>№{data.trackingNumber}</Text>
          <View
            style={[
              styles.headerStatusBadge,
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
            <View
              style={[
                styles.headerStatusDot,
                {
                  backgroundColor: isOnTheWay
                    ? COLORS.orange
                    : isCompleted
                    ? COLORS.green
                    : '#9ca3af',
                },
              ]}
            />
            <Text
              style={[
                styles.headerStatusText,
                {
                  color: isOnTheWay
                    ? COLORS.orange
                    : isCompleted
                    ? COLORS.green
                    : '#9ca3af',
                },
              ]}
            >
              {data.status}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={handleShare}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather name="share-2" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Parcel Data Pill / Card */}
        <TouchableOpacity
          style={styles.parcelDataCard}
          activeOpacity={0.85}
          onPress={() => setIsParcelDataOpen(!isParcelDataOpen)}
        >
          <View style={styles.parcelDataLeft}>
            <View style={styles.parcelIconContainer}>
              <Feather name="box" size={18} color={COLORS.green} />
            </View>
            <View>
              <Text style={styles.parcelDataTitle}>Parcel Data & Specifications</Text>
              <Text style={styles.parcelDataSub}>
                {data.parcelData.weight} • {data.parcelData.dimensions}
              </Text>
            </View>
          </View>
          <Feather
            name="chevron-right"
            size={18}
            color="#9ca3af"
            style={{ transform: [{ rotate: isParcelDataOpen ? '90deg' : '0deg' }] }}
          />
        </TouchableOpacity>

        {/* Expandable Parcel Details */}
        {isParcelDataOpen && (
          <View style={styles.parcelDetailsBox}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Weight:</Text>
              <Text style={styles.detailValue}>{data.parcelData.weight}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Dimensions:</Text>
              <Text style={styles.detailValue}>{data.parcelData.dimensions}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Category:</Text>
              <Text style={styles.detailValue}>{data.parcelData.category}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Origin:</Text>
              <Text style={styles.detailValue}>{data.parcelData.sender}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Destination:</Text>
              <Text style={styles.detailValue}>{data.parcelData.destination}</Text>
            </View>
            {data.recipientName && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Recipient:</Text>
                <Text style={styles.detailValue}>{data.recipientName}</Text>
              </View>
            )}
          </View>
        )}

        {/* Editable Package Title */}
        <View style={styles.sectionHeader}>
          {isEditing ? (
            <TextInput
              style={styles.nameInput}
              value={packageName}
              onChangeText={setPackageName}
              onBlur={() => setIsEditing(false)}
              autoFocus
            />
          ) : (
            <Text style={styles.sectionTitle}>{packageName}</Text>
          )}
          <TouchableOpacity
            onPress={() => setIsEditing(!isEditing)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Feather name="edit-2" size={16} color="#9ca3af" style={styles.editIcon} />
          </TouchableOpacity>
        </View>

        {/* Stepper Vertical Timeline */}
        <View style={styles.timelineContainer}>
          {data.timeline.map((step, index) => {
            const isLast = index === data.timeline.length - 1;
            const isStepExpanded = expandedSteps[step.id] ?? false;

            return (
              <View key={step.id} style={styles.stepItem}>
                {/* Step Icon Badge */}
                <View
                  style={[
                    styles.stepCircle,
                    step.completed
                      ? { backgroundColor: '#1e3a24', borderColor: COLORS.green, borderWidth: 1 }
                      : step.active
                      ? { backgroundColor: COLORS.orange }
                      : { backgroundColor: '#24262f', borderWidth: 1, borderColor: '#3b3e4a' },
                  ]}
                >
                  {step.completed ? (
                    <Ionicons name="checkmark" size={16} color={COLORS.green} />
                  ) : step.active ? (
                    <MaterialCommunityIcons name="truck-fast-outline" size={18} color="#ffffff" />
                  ) : (
                    <Ionicons name="ellipse-outline" size={14} color="#9ca3af" />
                  )}
                </View>

                {/* Connecting Vertical Line */}
                {!isLast && (
                  <View
                    style={[
                      styles.verticalLine,
                      { backgroundColor: step.completed ? '#1e3a24' : '#2b2f38' },
                    ]}
                  />
                )}

                <View style={styles.stepContent}>
                  <TouchableOpacity
                    style={styles.stepRowTop}
                    onPress={() => step.subSteps && toggleStep(step.id)}
                    activeOpacity={step.subSteps ? 0.7 : 1}
                  >
                    <View style={styles.expandableTitleRow}>
                      <Text
                        style={[
                          styles.stepTitle,
                          step.completed && { color: '#ffffff' },
                          step.active && { color: COLORS.orange },
                        ]}
                      >
                        {step.title}
                      </Text>
                      {step.subSteps && (
                        <Feather
                          name={isStepExpanded ? 'chevron-up' : 'chevron-down'}
                          size={16}
                          color="#9ca3af"
                        />
                      )}
                    </View>
                    {step.date && <Text style={styles.stepDate}>{step.date}</Text>}
                  </TouchableOpacity>

                  <Text style={styles.stepLocation}>{step.location}</Text>

                  {/* Verified Delivery Signature Badge */}
                  {step.signature && (
                    <View style={styles.signatureBadge}>
                      <Feather name="check-circle" size={14} color={COLORS.green} />
                      <Text style={styles.signatureText}>{step.signature}</Text>
                    </View>
                  )}

                  {/* Sub-steps dropdown */}
                  {step.subSteps && isStepExpanded && (
                    <View style={styles.subStepsContainer}>
                      {step.subSteps.map((sub, sIdx) => (
                        <View key={sIdx} style={styles.subStepRow}>
                          <View
                            style={[
                              styles.subStepDot,
                              { backgroundColor: sub.completed ? COLORS.green : '#4b5563' },
                            ]}
                          />
                          <Text
                            style={[
                              styles.subStepTitle,
                              sub.completed ? styles.subStepTitleCompleted : styles.subStepTitlePending,
                            ]}
                          >
                            {sub.title}
                          </Text>
                          {sub.date && <Text style={styles.subStepDate}>{sub.date}</Text>}
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* Payment Status Accordion / Card */}
        <View style={styles.paymentCard}>
          <TouchableOpacity
            style={styles.paymentHeader}
            onPress={() => setIsPaymentOpen(!isPaymentOpen)}
            activeOpacity={0.8}
          >
            <View style={styles.paymentHeaderLeft}>
              <View
                style={[
                  styles.walletIconContainer,
                  data.payment.isPaid && { backgroundColor: COLORS.greenBg },
                ]}
              >
                <Ionicons
                  name={data.payment.isPaid ? 'checkmark-circle' : 'wallet-outline'}
                  size={16}
                  color={data.payment.isPaid ? COLORS.green : '#9ca3af'}
                />
              </View>
              <View>
                <Text style={styles.paymentCardTitle}>Payment Status</Text>
                <Text style={styles.paymentCardSub}>
                  {data.payment.isPaid ? 'Paid in full' : 'Pending payment'}
                </Text>
              </View>
            </View>
            <Feather
              name={isPaymentOpen ? 'chevron-up' : 'chevron-down'}
              size={18}
              color="#9ca3af"
            />
          </TouchableOpacity>

          {isPaymentOpen && (
            <View style={styles.paymentBody}>
              <View style={styles.paymentLineItem}>
                <Text style={styles.paymentLabel}>Shipment cost</Text>
                <Text style={styles.paymentValue}>
                  ${data.payment.shipmentCost.toFixed(2)}
                </Text>
              </View>

              <View style={styles.paymentLineItem}>
                <Text style={styles.paymentLabel}>Insurance</Text>
                <Text style={styles.paymentValue}>
                  ${data.payment.insurance.toFixed(2)}
                </Text>
              </View>

              {data.payment.method && (
                <View style={styles.paymentLineItem}>
                  <Text style={styles.paymentLabel}>Payment Method</Text>
                  <Text style={styles.paymentMethodValue}>{data.payment.method}</Text>
                </View>
              )}

              <View style={styles.paymentTotalRow}>
                <Text style={styles.paymentTotalLabel}>Total</Text>
                <Text
                  style={[
                    styles.paymentTotalValue,
                    data.payment.isPaid && { color: COLORS.green },
                  ]}
                >
                  ${data.payment.total.toFixed(2)}
                </Text>
              </View>

              {/* Action Button: Checkout if unpaid, or receipt if paid */}
              {!data.payment.isPaid ? (
                <TouchableOpacity
                  style={styles.checkoutCTAButton}
                  activeOpacity={0.85}
                  onPress={onNavigateToCheckout}
                >
                  <Ionicons name="card-outline" size={18} color="#000000" />
                  <Text style={styles.checkoutCTAText}>
                    Pay Now (${data.payment.total.toFixed(2)})
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.paidReceiptButton}
                  activeOpacity={0.85}
                  onPress={() =>
                    Alert.alert(
                      '📄 Official Receipt',
                      `Invoice #INV-${data.trackingNumber}\nAmount: $${data.payment.total.toFixed(2)}\nStatus: PAID\nMethod: ${data.payment.method || 'Card'}\nDate: ${data.payment.paidDate || 'Processed'}`
                    )
                  }
                >
                  <Feather name="file-text" size={16} color={COLORS.green} />
                  <Text style={styles.paidReceiptButtonText}>View Official Receipt</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
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
  headerCenter: {
    alignItems: 'center',
    gap: 4,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  headerStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
  },
  headerStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  headerStatusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 110,
  },
  parcelDataCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  parcelDataLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  parcelIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.greenBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  parcelDataTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  parcelDataSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  parcelDetailsBox: {
    backgroundColor: '#16181e',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#262932',
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
    maxWidth: '65%',
    textAlign: 'right',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  nameInput: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.green,
    paddingVertical: 2,
    minWidth: 160,
  },
  editIcon: {
    marginLeft: 4,
  },
  timelineContainer: {
    marginBottom: 20,
  },
  stepItem: {
    flexDirection: 'row',
    position: 'relative',
    marginBottom: 20,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    marginRight: 14,
    marginTop: 2,
  },
  verticalLine: {
    position: 'absolute',
    left: 15,
    top: 34,
    bottom: -22,
    width: 2,
    zIndex: 1,
  },
  stepContent: {
    flex: 1,
    paddingBottom: 4,
  },
  stepRowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  expandableTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  stepDate: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  stepLocation: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  signatureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.greenBg,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1e3a24',
    marginTop: 4,
    marginBottom: 8,
  },
  signatureText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.green,
  },
  subStepsContainer: {
    backgroundColor: '#16181e',
    borderRadius: 12,
    padding: 12,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#262932',
    gap: 10,
  },
  subStepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  subStepDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  subStepTitle: {
    fontSize: 12,
    flex: 1,
  },
  subStepTitleCompleted: {
    color: '#d1d5db',
  },
  subStepTitlePending: {
    color: '#6b7280',
    fontStyle: 'italic',
  },
  subStepDate: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  paymentCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginBottom: 20,
  },
  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paymentHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  walletIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#252831',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  paymentCardSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  paymentBody: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#252831',
    paddingTop: 14,
    gap: 8,
  },
  paymentLineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  paymentValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  paymentMethodValue: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.green,
  },
  paymentTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#252831',
    paddingTop: 10,
    marginTop: 4,
    marginBottom: 8,
  },
  paymentTotalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  paymentTotalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.orange,
  },
  checkoutCTAButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.green,
    borderRadius: 14,
    paddingVertical: 12,
    marginTop: 6,
  },
  checkoutCTAText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#000000',
  },
  paidReceiptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.greenBg,
    borderRadius: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#1e3a24',
    marginTop: 6,
  },
  paidReceiptButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.green,
  },
});
