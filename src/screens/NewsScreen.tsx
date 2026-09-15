import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { sampleNews, LogisticsNewsItem } from '../data/mockData';

interface NewsScreenProps {
  onBack: () => void;
}

export default function NewsScreen({ onBack }: NewsScreenProps) {
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeArticle, setActiveArticle] = useState<LogisticsNewsItem | null>(null);

  const categories = ['All', 'Green Logistics', 'Service Alert', 'Customs & Trade', 'Innovation'];

  const filteredNews = sampleNews.filter(
    (item) => selectedCategory === 'All' || item.category === selectedCategory
  );

  const featuredItem = sampleNews.find((n) => n.isFeatured) || sampleNews[0];

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

        <Text style={styles.headerTitle}>Shipping & Logistics News</Text>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => Alert.alert('Notifications', 'Subscribed to logistics operational alerts.')}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="notifications-outline" size={20} color="#9ca3af" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Featured Hero Story */}
        <TouchableOpacity
          style={styles.featuredCard}
          activeOpacity={0.9}
          onPress={() => setActiveArticle(featuredItem)}
        >
          <View style={styles.featuredTagRow}>
            <View style={styles.featuredBadge}>
              <MaterialCommunityIcons name="lightning-bolt" size={12} color="#000000" />
              <Text style={styles.featuredBadgeText}>FEATURED STORY</Text>
            </View>
            <Text style={styles.featuredCategory}>{featuredItem.category}</Text>
          </View>

          <Text style={styles.featuredTitle}>{featuredItem.title}</Text>
          <Text style={styles.featuredSummary} numberOfLines={3}>
            {featuredItem.summary}
          </Text>

          <View style={styles.featuredMetaRow}>
            <View style={styles.metaLeft}>
              <Feather name="calendar" size={12} color="#86efac" />
              <Text style={styles.metaText}>{featuredItem.date}</Text>
              <Text style={styles.metaDot}>•</Text>
              <Feather name="clock" size={12} color="#86efac" />
              <Text style={styles.metaText}>{featuredItem.readTime}</Text>
            </View>
            <View style={styles.readMorePill}>
              <Text style={styles.readMoreText}>Read Story →</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Category Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesRow}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryChip, selectedCategory === cat && styles.categoryChipActive]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategory === cat && styles.categoryChipTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* News Feed Items */}
        <View style={styles.newsList}>
          {filteredNews.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.newsCard}
              activeOpacity={0.85}
              onPress={() => setActiveArticle(item)}
            >
              <View style={styles.newsCardHeader}>
                <View style={styles.newsCategoryPill}>
                  <Text style={styles.newsCategoryText}>{item.category}</Text>
                </View>
                <Text style={styles.newsDateText}>{item.date}</Text>
              </View>

              <Text style={styles.newsTitle}>{item.title}</Text>
              <Text style={styles.newsSnippet} numberOfLines={2}>
                {item.summary}
              </Text>

              <View style={styles.newsCardFooter}>
                <View style={styles.readTimeRow}>
                  <Feather name="clock" size={12} color="#9ca3af" />
                  <Text style={styles.readTimeText}>{item.readTime}</Text>
                </View>
                <Text style={styles.openText}>View Details →</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Article Detail Reader Modal */}
      <Modal
        visible={!!activeArticle}
        transparent
        animationType="slide"
        onRequestClose={() => setActiveArticle(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalCategoryBadge}>
                <Text style={styles.modalCategoryText}>{activeArticle?.category}</Text>
              </View>
              <TouchableOpacity
                onPress={() => setActiveArticle(null)}
                style={styles.modalCloseBtn}
              >
                <Feather name="x" size={20} color="#ffffff" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>{activeArticle?.title}</Text>

              <View style={styles.modalMeta}>
                <Text style={styles.modalDate}>{activeArticle?.date}</Text>
                <Text style={styles.metaDot}>•</Text>
                <Text style={styles.modalDate}>{activeArticle?.readTime}</Text>
              </View>

              <View style={styles.modalQuoteBox}>
                <Text style={styles.modalSummary}>{activeArticle?.summary}</Text>
              </View>

              <Text style={styles.modalBody}>{activeArticle?.content}</Text>

              <TouchableOpacity
                style={styles.modalShareButton}
                onPress={() => {
                  Alert.alert('Article Shared', 'Link copied to clipboard.');
                }}
              >
                <Feather name="share-2" size={16} color="#000000" />
                <Text style={styles.modalShareButtonText}>Share Logistics Update</Text>
              </TouchableOpacity>
            </ScrollView>
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
    paddingBottom: 120,
  },
  featuredCard: {
    backgroundColor: '#162b1d',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#1e3a24',
    marginBottom: 16,
  },
  featuredTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.green,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  featuredBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#000000',
  },
  featuredCategory: {
    fontSize: 12,
    color: '#86efac',
    fontWeight: '600',
  },
  featuredTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#ffffff',
    lineHeight: 23,
    marginBottom: 8,
  },
  featuredSummary: {
    fontSize: 13,
    color: '#d1fae5',
    lineHeight: 18,
    marginBottom: 14,
  },
  featuredMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#1e3a24',
    paddingTop: 10,
  },
  metaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 11,
    color: '#86efac',
  },
  metaDot: {
    color: '#86efac',
    fontSize: 12,
  },
  readMorePill: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  readMoreText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.green,
  },
  categoriesRow: {
    gap: 8,
    paddingBottom: 14,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryChipActive: {
    backgroundColor: COLORS.green,
    borderColor: COLORS.green,
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9ca3af',
  },
  categoryChipTextActive: {
    color: '#000000',
    fontWeight: '800',
  },
  newsList: {
    gap: 12,
  },
  newsCard: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  newsCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  newsCategoryPill: {
    backgroundColor: '#252831',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  newsCategoryText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.green,
  },
  newsDateText: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  newsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    lineHeight: 20,
    marginBottom: 6,
  },
  newsSnippet: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  newsCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#252831',
    paddingTop: 10,
  },
  readTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  readTimeText: {
    fontSize: 11,
    color: '#9ca3af',
  },
  openText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.green,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#16181e',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    maxHeight: '85%',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  modalCategoryBadge: {
    backgroundColor: COLORS.greenBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  modalCategoryText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.green,
  },
  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#252831',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: COLORS.text,
    lineHeight: 25,
    marginBottom: 8,
  },
  modalMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  modalDate: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  modalQuoteBox: {
    backgroundColor: '#20232b',
    borderLeftWidth: 3,
    borderLeftColor: COLORS.green,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  modalSummary: {
    fontSize: 13,
    color: '#e5e7eb',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  modalBody: {
    fontSize: 14,
    color: '#d1d5db',
    lineHeight: 22,
    marginBottom: 24,
  },
  modalShareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.green,
    borderRadius: 16,
    paddingVertical: 14,
    marginBottom: 16,
  },
  modalShareButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#000000',
  },
});
