import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { getPackageById, sampleShipments, PackageDetail, packagesData } from '../data/mockData';
import { pdfService } from '../services/pdfService';
import { ScreenSkeleton } from '../components/SkeletonLoader';

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
  const insets = useSafeAreaInsets();
  const [selectedId, setSelectedId] = useState<string>(packageId);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);

  const data: PackageDetail = getPackageById(selectedId);

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

  // Switch package with simulated skeleton loader
  const handleSelectPackage = (id: string) => {
    if (id === selectedId) return;
    setIsLoading(true);
    setSelectedId(id);
    setTimeout(() => {
      setIsLoading(false);
    }, 450);
  };

  useEffect(() => {
    setPackageName(data.parcelData.category || 'My package');
  }, [selectedId]);

  const toggleStep = (stepId: string) => {
    setExpandedSteps((prev) => ({
      ...prev,
      [stepId]: !prev[stepId],
    }));
  };

  const handleShare = () => {
    Alert.alert('Share Tracking', `Tracking code №${data.trackingNumber} copied to clipboard!`);
  };

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      await pdfService.generateAndShareReceiptPdf(data);
    } catch (e) {
      Alert.alert('PDF Receipt', `Receipt for №${data.trackingNumber} generated.`);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const isOnTheWay = data.status === 'On the way';
  const isCompleted = data.status === 'Completed';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top Navigation Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onBack}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
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
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Feather name="share-2" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Horizontal Package Switcher (Show all trackings) */}
      <View style={styles.packageSwitcherContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.packageSwitcherScroll}
        >
          {sampleShipments.map((ship) => {
            const isSelected = ship.id === selectedId;
            return (
              <TouchableOpacity
                key={ship.id}
                style={[
                  styles.packagePill,
                  isSelected && styles.packagePillSelected,
                ]}
                onPress={() => handleSelectPackage(ship.id)}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.pillDot,
                    {
                      backgroundColor:
                        ship.status === 'On the way'
                          ? COLORS.orange
                          : ship.status === 'Completed'
                          ? COLORS.green
                          : '#9ca3af',
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.packagePillText,
                    isSelected && styles.packagePillTextSelected,
                  ]}
                >
                  {ship.trackingNumber}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {isLoading ? (
        <ScreenSkeleton />
      ) : (
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

              {isEditing ? (
                <View style={styles.editRow}>
                  <TextInput
                    style={styles.editInput}
                    value={packageName}
                    onChangeText={setPackageName}
                    autoFocus
                    returnKeyType="done"
                    onSubmitEditing={() => setIsEditing(false)}
                  />
                  <TouchableOpacity
                    onPress={() => setIsEditing(false)}
                    style={styles.saveEditBtn}
                  >
                    <Feather name="check" size={16} color={COLORS.green} />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.nameRow}>
                  <Text style={styles.parcelCategoryText}>{packageName}</Text>
                  <TouchableOpacity
                    onPress={() => setIsEditing(true)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Feather name="edit-2" size={13} color="#6b7280" />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <Feather
              name={isParcelDataOpen ? 'chevron-up' : 'chevron-down'}
              size={18}
              color="#9ca3af"
            />
          </TouchableOpacity>

          {/* Parcel Data Drawer Details */}
          {isParcelDataOpen && (
            <View style={styles.parcelDataDrawer}>
              <View style={styles.drawerItem}>
                <Text style={styles.drawerLabel}>Category</Text>
                <Text style={styles.drawerValue}>{data.parcelData.category}</Text>
              </View>
              <View style={styles.drawerItem}>
                <Text style={styles.drawerLabel}>Weight & Size</Text>
                <Text style={styles.drawerValue}>
                  {data.parcelData.weight} • {data.parcelData.dimensions}
                </Text>
              </View>
              <View style={styles.drawerItem}>
                <Text style={styles.drawerLabel}>Origin Depot</Text>
                <Text style={styles.drawerValue}>{data.parcelData.sender}</Text>
              </View>
              <View style={styles.drawerItem}>
                <Text style={styles.drawerLabel}>Destination Address</Text>
                <Text style={styles.drawerValue}>{data.parcelData.destination}</Text>
              </View>
            </View>
          )}

          {/* Status Header Card */}
          <View style={styles.statusHeroCard}>
            <View style={styles.statusHeroTop}>
              <View style={styles.statusBadgeRow}>
                <View
                  style={[
                    styles.statusBadgeDot,
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
                    styles.statusHeroTitle,
                    {
                      color: isOnTheWay
                        ? COLORS.orange
                        : isCompleted
                        ? COLORS.green
                        : '#9ca3af',
                    },
                  ]}
                >
                  {data.status.toUpperCase()}
                </Text>
              </View>

              {data.estimatedDelivery && (
                <Text style={styles.etaText}>
                  Est. Delivery: {data.estimatedDelivery}
                </Text>
              )}
            </View>

            <View style={styles.heroRouteBox}>
              <View style={styles.heroRoutePoint}>
                <Ionicons name="radio-button-on" size={14} color={COLORS.green} />
                <Text style={styles.heroRouteAddress} numberOfLines={1}>
                  {data.parcelData.sender}
                </Text>
              </View>
              <View style={styles.routeVerticalDashed} />
              <View style={styles.heroRoutePoint}>
                <Ionicons name="location" size={16} color={COLORS.orange} />
                <Text style={styles.heroRouteAddress} numberOfLines={1}>
                  {data.parcelData.destination}
                </Text>
              </View>
            </View>
          </View>

          {/* Timeline Section */}
          <View style={styles.timelineCard}>
            <Text style={styles.sectionHeader}>Shipment Timeline</Text>

            {data.timeline.map((step, idx) => {
              const isStepExpanded = expandedSteps[step.id] ?? false;
              const isLast = idx === data.timeline.length - 1;

              return (
                <View key={step.id} style={styles.timelineStepContainer}>
                  {/* Left Column: Icon & Vertical Line */}
                  <View style={styles.stepLeftCol}>
                    <View
                      style={[
                        styles.stepIconCircle,
                        step.completed && { backgroundColor: COLORS.greenBg },
                        step.active && { backgroundColor: COLORS.orangeBg },
                      ]}
                    >
                      {step.icon === 'created' && (
                        <Feather
                          name="file-text"
                          size={14}
                          color={step.completed ? COLORS.green : '#9ca3af'}
                        />
                      )}
                      {step.icon === 'transit' && (
                        <MaterialCommunityIcons
                          name="truck-delivery"
                          size={16}
                          color={step.active ? COLORS.orange : step.completed ? COLORS.green : '#9ca3af'}
                        />
                      )}
                      {step.icon === 'received' && (
                        <Feather
                          name="check"
                          size={14}
                          color={step.completed ? COLORS.green : '#9ca3af'}
                        />
                      )}
                    </View>
                    {!isLast && <View style={styles.stepVerticalLine} />}
                  </View>

                  {/* Right Column: Details */}
                  <View style={styles.stepRightCol}>
                    <TouchableOpacity
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
                  <Text style={styles.paymentCardTitle}>Payment Breakdown</Text>
                  <Text style={styles.paymentCardSub}>
                    {data.payment.isPaid ? 'Paid in full (Paystack)' : 'Pending payment'}
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
                  <Text style={styles.paymentLabel}>Freight & Transit Fee</Text>
                  <Text style={styles.paymentValue}>
                    ₦{data.payment.shipmentCost.toLocaleString()}
                  </Text>
                </View>

                <View style={styles.paymentLineItem}>
                  <Text style={styles.paymentLabel}>Transit Insurance (100% Shield)</Text>
                  <Text style={styles.paymentValue}>
                    ₦{data.payment.insurance.toLocaleString()}
                  </Text>
                </View>

                <View style={styles.paymentLineItem}>
                  <Text style={styles.paymentLabel}>FIRS Statutory VAT (7.5%)</Text>
                  <Text style={styles.paymentValue}>
                    ₦{(data.payment.vat || Math.round(data.payment.shipmentCost * 0.075)).toLocaleString()}
                  </Text>
                </View>

                {data.payment.method && (
                  <View style={styles.paymentLineItem}>
                    <Text style={styles.paymentLabel}>Payment Channel</Text>
                    <Text style={styles.paymentMethodValue}>{data.payment.method}</Text>
                  </View>
                )}

                <View style={styles.paymentTotalRow}>
                  <Text style={styles.paymentTotalLabel}>Total Amount</Text>
                  <Text
                    style={[
                      styles.paymentTotalValue,
                      data.payment.isPaid && { color: COLORS.green },
                    ]}
                  >
                    ₦{data.payment.total.toLocaleString()}
                  </Text>
                </View>

                {/* Real PDF Receipt Button */}
                <TouchableOpacity
                  style={styles.realPdfBtn}
                  activeOpacity={0.85}
                  onPress={handleDownloadPdf}
                  disabled={isGeneratingPdf}
                >
                  {isGeneratingPdf ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <>
                      <MaterialCommunityIcons name="file-pdf-box" size={20} color="#ffffff" />
                      <Text style={styles.realPdfBtnText}>
                        {data.payment.isPaid ? 'Official PDF Tax Receipt' : 'Download Invoice PDF'}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>

                {/* Pay Now Button if Unpaid */}
                {!data.payment.isPaid && (
                  <TouchableOpacity
                    style={styles.checkoutCTAButton}
                    activeOpacity={0.85}
                    onPress={onNavigateToCheckout}
                  >
                    <Ionicons name="card-outline" size={18} color="#000000" />
                    <Text style={styles.checkoutCTAText}>
                      Pay Now (₦{data.payment.total.toLocaleString()})
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        </ScrollView>
      )}
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
  headerCenter: {
    alignItems: 'center',
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
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 4,
    borderWidth: 1,
  },
  headerStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  headerStatusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  packageSwitcherContainer: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#20242e',
  },
  packageSwitcherScroll: {
    paddingHorizontal: 18,
    gap: 8,
  },
  packagePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161922',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2d3342',
    gap: 6,
  },
  packagePillSelected: {
    backgroundColor: '#1e382b',
    borderColor: COLORS.green,
  },
  pillDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  packagePillText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '700',
  },
  packagePillTextSelected: {
    color: '#ffffff',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 120,
  },
  parcelDataCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  parcelDataLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  parcelIconContainer: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.greenBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  parcelCategoryText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  editInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '700',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.green,
    paddingVertical: 2,
  },
  saveEditBtn: {
    marginLeft: 8,
    padding: 4,
  },
  parcelDataDrawer: {
    backgroundColor: '#161922',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#262a36',
    gap: 8,
  },
  drawerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  drawerLabel: {
    fontSize: 12,
    color: '#94a3b8',
  },
  drawerValue: {
    fontSize: 12,
    color: '#f1f5f9',
    fontWeight: '600',
    maxWidth: '65%',
    textAlign: 'right',
  },
  statusHeroCard: {
    backgroundColor: '#151922',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#262a36',
    marginBottom: 16,
  },
  statusHeroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusBadgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusHeroTitle: {
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  etaText: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
  },
  heroRouteBox: {
    backgroundColor: '#0f1218',
    padding: 12,
    borderRadius: 12,
  },
  heroRoutePoint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  routeVerticalDashed: {
    width: 1,
    height: 10,
    backgroundColor: '#374151',
    marginLeft: 6,
    marginVertical: 2,
  },
  heroRouteAddress: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  timelineCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 16,
  },
  timelineStepContainer: {
    flexDirection: 'row',
  },
  stepLeftCol: {
    alignItems: 'center',
    width: 32,
    marginRight: 10,
  },
  stepIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#1f222b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepVerticalLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#262a36',
    marginVertical: 4,
  },
  stepRightCol: {
    flex: 1,
    paddingBottom: 22,
  },
  expandableTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#9ca3af',
  },
  stepDate: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  stepLocation: {
    fontSize: 12,
    color: '#cbd5e1',
    marginTop: 4,
  },
  signatureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 6,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  signatureText: {
    fontSize: 11,
    color: COLORS.green,
    fontWeight: '700',
  },
  subStepsContainer: {
    marginTop: 10,
    paddingLeft: 10,
    borderLeftWidth: 1,
    borderLeftColor: '#334155',
    gap: 8,
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
    color: '#cbd5e1',
  },
  subStepTitlePending: {
    color: '#64748b',
  },
  subStepDate: {
    fontSize: 10,
    color: '#64748b',
  },
  paymentCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  walletIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1f222b',
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
    borderTopColor: '#262a36',
    paddingTop: 14,
    gap: 10,
  },
  paymentLineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  paymentValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  paymentMethodValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#38bdf8',
  },
  paymentTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#262a36',
    paddingTop: 10,
    marginTop: 4,
  },
  paymentTotalLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text,
  },
  paymentTotalValue: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.text,
  },
  realPdfBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#15803d',
    borderRadius: 14,
    paddingVertical: 13,
    gap: 8,
    marginTop: 8,
  },
  realPdfBtnText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 13,
  },
  checkoutCTAButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.green,
    borderRadius: 14,
    paddingVertical: 14,
    gap: 8,
    marginTop: 4,
  },
  checkoutCTAText: {
    color: '#000000',
    fontWeight: '800',
    fontSize: 14,
  },
});
