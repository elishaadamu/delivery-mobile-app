import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, ViewStyle, DimensionValue } from 'react-native';

interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: ViewStyle;
}

export const SkeletonItem: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 8,
  style,
}) => {
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.85,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 750,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          opacity: pulseAnim,
        },
        style,
      ]}
    />
  );
};

export const ScreenSkeleton: React.FC = () => {
  return (
    <View style={styles.screenContainer}>
      {/* Header Skeleton */}
      <View style={styles.headerRow}>
        <SkeletonItem width={46} height={46} borderRadius={23} />
        <View style={styles.headerTextGroup}>
          <SkeletonItem width="55%" height={16} borderRadius={6} style={{ marginBottom: 8 }} />
          <SkeletonItem width="35%" height={12} borderRadius={4} />
        </View>
        <SkeletonItem width={42} height={42} borderRadius={12} />
      </View>

      {/* Featured Card Skeleton */}
      <View style={styles.cardSkeleton}>
        <SkeletonItem width="40%" height={14} borderRadius={6} style={{ marginBottom: 12 }} />
        <SkeletonItem width="80%" height={26} borderRadius={8} style={{ marginBottom: 16 }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
          <SkeletonItem width="30%" height={18} borderRadius={6} />
          <SkeletonItem width="25%" height={18} borderRadius={6} />
        </View>
      </View>

      {/* Search Bar Skeleton */}
      <SkeletonItem width="100%" height={52} borderRadius={16} style={{ marginVertical: 18 }} />

      {/* List Item Skeletons */}
      <View style={styles.listContainer}>
        <SkeletonItem width="45%" height={18} borderRadius={6} style={{ marginBottom: 14 }} />
        {[1, 2, 3].map((item) => (
          <View key={item} style={styles.listItem}>
            <SkeletonItem width={46} height={46} borderRadius={12} style={{ marginRight: 14 }} />
            <View style={{ flex: 1 }}>
              <SkeletonItem width="65%" height={15} borderRadius={6} style={{ marginBottom: 8 }} />
              <SkeletonItem width="45%" height={12} borderRadius={4} />
            </View>
            <SkeletonItem width={60} height={24} borderRadius={12} />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#e2e8f0',
  },
  screenContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTextGroup: {
    flex: 1,
    marginLeft: 14,
  },
  cardSkeleton: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  listContainer: {
    marginTop: 6,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
});
