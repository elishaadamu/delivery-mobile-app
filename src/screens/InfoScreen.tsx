import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { sampleFaqs } from '../data/mockData';

interface InfoScreenProps {
  onBack: () => void;
}

export default function InfoScreen({ onBack }: InfoScreenProps) {
  const insets = useSafeAreaInsets();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setExpandedFaq(expandedFaq === idx ? null : idx);
  };

  const handleClaim = () => {
    Alert.alert(
      '🛡️ Submit Insurance Claim',
      'Have your tracking number and parcel invoice ready. Claims under Premium Shield are reimbursed within 24 hours via Nigerian bank transfer.',
      [
        {
          text: 'File a Claim Now',
          onPress: () => Alert.alert('Claim Portal', 'Connecting to Swift Logistics Nigerian claims center...'),
        },
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

        <Text style={styles.headerTitle}>Service & Protection</Text>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => Alert.alert('Swift Nigerian Support', '24/7 Support Hotline: +234 1 889 0421\nWhatsApp: +234 803 456 7890')}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Feather name="headphones" size={20} color="#9ca3af" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Insurance Shield Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View style={styles.shieldIconCircle}>
              <MaterialCommunityIcons name="shield-check" size={26} color={COLORS.green} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.heroTitle}>Premium Protection Shield</Text>
              <Text style={styles.heroSubtitle}>Guaranteed complete peace of mind across Nigeria</Text>
            </View>
          </View>

          <View style={styles.heroPerks}>
            <View style={styles.perkRow}>
              <Feather name="check" size={14} color={COLORS.green} />
              <Text style={styles.perkText}>100% full replacement reimbursement up to ₦2,500,000</Text>
            </View>
            <View style={styles.perkRow}>
              <Feather name="check" size={14} color={COLORS.green} />
              <Text style={styles.perkText}>Covers transit damage, highway loss, and porch theft</Text>
            </View>
            <View style={styles.perkRow}>
              <Feather name="check" size={14} color={COLORS.green} />
              <Text style={styles.perkText}>24-hour fast payout directly to your Nigerian bank account</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.claimButton}
            onPress={handleClaim}
            activeOpacity={0.85}
          >
            <Text style={styles.claimButtonText}>File an Insurance Claim</Text>
          </TouchableOpacity>
        </View>

        {/* Coverage Tiers Comparison */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Coverage Tiers</Text>

          <View style={styles.tierCardsRow}>
            {/* Standard */}
            <View style={styles.tierCard}>
              <View style={styles.tierHeader}>
                <Text style={styles.tierName}>Standard</Text>
              </View>
              <Text style={styles.tierPrice}>Included Free</Text>
              <Text style={styles.tierDesc}>Basic protection for every standard package</Text>

              <View style={styles.tierFeatures}>
                <Text style={styles.tierFeatureItem}>✓ Up to ₦100,000 cover</Text>
                <Text style={styles.tierFeatureItem}>✓ Online GPS tracking</Text>
                <Text style={styles.tierFeatureItem}>✓ 7-day claim review</Text>
              </View>
            </View>

            {/* Premium Shield - Fixed badge collision */}
            <View style={[styles.tierCard, styles.tierCardFeatured]}>
              <View style={styles.tierHeaderWithBadge}>
                <Text style={[styles.tierName, { flex: 1 }]}>Premium</Text>
                <View style={styles.popularBadge}>
                  <Text style={styles.popularBadgeText}>POPULAR</Text>
                </View>
              </View>
              <Text style={[styles.tierPrice, { color: COLORS.green }]}>₦3,500 / parcel</Text>
              <Text style={styles.tierDesc}>Zero-deductible full value protection</Text>

              <View style={styles.tierFeatures}>
                <Text style={[styles.tierFeatureItem, { color: '#ffffff' }]}>✓ Up to ₦2.5M cover</Text>
                <Text style={[styles.tierFeatureItem, { color: '#ffffff' }]}>✓ Zero deductible</Text>
                <Text style={[styles.tierFeatureItem, { color: '#ffffff' }]}>✓ 24h rapid claims</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Delivery Guarantees */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transit Guarantees</Text>

          <View style={styles.guaranteeCard}>
            <View style={styles.guaranteeItem}>
              <View style={styles.guaranteeIcon}>
                <MaterialCommunityIcons name="clock-fast" size={18} color={COLORS.orange} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.guaranteeName}>Same-Day Metro Lagos & Abuja</Text>
                <Text style={styles.guaranteeSub}>Bookings before 11:00 AM delivered by 18:30 same day</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.guaranteeItem}>
              <View style={styles.guaranteeIcon}>
                <MaterialCommunityIcons name="truck-delivery" size={18} color={COLORS.green} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.guaranteeName}>Interstate Express Freight</Text>
                <Text style={styles.guaranteeSub}>Guaranteed overnight delivery across all 36 States & FCT</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.guaranteeItem}>
              <View style={styles.guaranteeIcon}>
                <MaterialCommunityIcons name="airplane" size={18} color="#60a5fa" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.guaranteeName}>International Air Express</Text>
                <Text style={styles.guaranteeSub}>3 - 5 business days to UK, US, Canada & UAE destinations</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Prohibited Items Accordion Link */}
        <TouchableOpacity
          style={styles.prohibitedCard}
          onPress={() =>
            Alert.alert(
              '⚠️ Prohibited Goods (Nigeria)',
              'The following items cannot be accepted for shipment:\n• Explosives & Flammable liquids\n• Unregistered Lithium-ion batteries\n• Perishable foods without temperature control\n• Unregistered cash & contraband substances'
            )
          }
          activeOpacity={0.8}
        >
          <View style={styles.prohibitedLeft}>
            <MaterialCommunityIcons name="alert-octagon-outline" size={22} color="#fbbf24" />
            <View style={{ flex: 1 }}>
              <Text style={styles.prohibitedTitle}>Prohibited & Restricted Items Guide</Text>
              <Text style={styles.prohibitedSub}>Review safety rules before dispatching your package</Text>
            </View>
          </View>
          <Feather name="chevron-right" size={18} color="#9ca3af" />
        </TouchableOpacity>

        {/* FAQs Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>

          <View style={styles.faqContainer}>
            {sampleFaqs.map((faq, index) => {
              const isOpen = expandedFaq === index;
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.faqItem}
                  onPress={() => toggleFaq(index)}
                  activeOpacity={0.8}
                >
                  <View style={styles.faqHeader}>
                    <Text style={styles.faqQuestion}>{faq.question}</Text>
                    <Feather
                      name={isOpen ? 'chevron-up' : 'chevron-down'}
                      size={18}
                      color="#9ca3af"
                    />
                  </View>

                  {isOpen && (
                    <Text style={styles.faqAnswer}>{faq.answer}</Text>
                  )}
                </TouchableOpacity>
              );
            })}
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
    paddingBottom: 110,
  },
  heroCard: {
    backgroundColor: '#162b1d',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#1e3a24',
    marginBottom: 20,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  shieldIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
  },
  heroSubtitle: {
    fontSize: 12,
    color: '#86efac',
    marginTop: 2,
  },
  heroPerks: {
    gap: 8,
    marginBottom: 16,
  },
  perkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  perkText: {
    fontSize: 12,
    color: '#d1fae5',
  },
  claimButton: {
    backgroundColor: COLORS.green,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  claimButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#000000',
  },
  section: {
    marginBottom: 22,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },
  tierCardsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  tierCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tierCardFeatured: {
    borderColor: COLORS.green,
    backgroundColor: '#151c17',
  },
  tierHeader: {
    marginBottom: 6,
  },
  tierHeaderWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  popularBadge: {
    backgroundColor: COLORS.green,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  popularBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#000000',
  },
  tierName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  tierPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  tierDesc: {
    fontSize: 11,
    color: COLORS.textMuted,
    lineHeight: 15,
    marginBottom: 12,
  },
  tierFeatures: {
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: '#252831',
    paddingTop: 10,
  },
  tierFeatureItem: {
    fontSize: 11,
    color: '#9ca3af',
  },
  guaranteeCard: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  guaranteeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  guaranteeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#252831',
    alignItems: 'center',
    justifyContent: 'center',
  },
  guaranteeName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  guaranteeSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 8,
  },
  prohibitedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#262013',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#4d3a17',
    marginBottom: 20,
  },
  prohibitedLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    paddingRight: 8,
  },
  prohibitedTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fbbf24',
  },
  prohibitedSub: {
    fontSize: 11,
    color: '#d97706',
    marginTop: 2,
  },
  faqContainer: {
    gap: 10,
  },
  faqItem: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  faqQuestion: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
    paddingRight: 10,
  },
  faqAnswer: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#252831',
    paddingTop: 8,
  },
});
