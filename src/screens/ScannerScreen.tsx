import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { sampleShipments } from '../data/mockData';

interface ScannerScreenProps {
  onBack: () => void;
  onTrackPackage: (trackingNumber: string) => void;
}

export default function ScannerScreen({ onBack, onTrackPackage }: ScannerScreenProps) {
  const insets = useSafeAreaInsets();
  const [manualCode, setManualCode] = useState('');
  const [flashOn, setFlashOn] = useState(false);

  // Animated sweep laser
  const laserAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const sweep = Animated.loop(
      Animated.sequence([
        Animated.timing(laserAnim, {
          toValue: 200,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(laserAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    sweep.start();
    return () => sweep.stop();
  }, [laserAnim]);

  const handleScanPreset = (trackingNumber: string) => {
    onTrackPackage(trackingNumber);
  };

  const handleManualTrack = () => {
    if (!manualCode.trim()) {
      Alert.alert('Invalid Code', 'Please enter a valid tracking number.');
      return;
    }
    onTrackPackage(manualCode.trim().toUpperCase());
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

        <Text style={styles.headerTitle}>Scan Waybill Barcode</Text>

        <TouchableOpacity
          style={[styles.iconButton, flashOn && styles.iconButtonActive]}
          onPress={() => setFlashOn(!flashOn)}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons
            name={flashOn ? 'flash' : 'flash-outline'}
            size={20}
            color={flashOn ? '#facc15' : '#9ca3af'}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Scanner Viewfinder Box */}
        <View style={styles.viewfinderContainer}>
          <View style={styles.viewfinderFrame}>
            {/* 4 Corner Reticle Markers */}
            <View style={[styles.corner, styles.cornerTopLeft]} />
            <View style={[styles.corner, styles.cornerTopRight]} />
            <View style={[styles.corner, styles.cornerBottomLeft]} />
            <View style={[styles.corner, styles.cornerBottomRight]} />

            {/* Smooth Sweeping Laser Line */}
            <Animated.View
              style={[
                styles.scanningLaser,
                {
                  transform: [{ translateY: laserAnim }],
                },
              ]}
            />

            <MaterialCommunityIcons
              name="barcode-scan"
              size={64}
              color="rgba(34, 197, 94, 0.3)"
            />
          </View>

          <Text style={styles.viewfinderHint}>
            Align Swift waybill QR code or 1D barcode inside the target frame
          </Text>
        </View>

        {/* Quick Sample Tracking Presets */}
        <View style={styles.presetsSection}>
          <Text style={styles.presetsTitle}>Tap Live Nigerian Package to Scan:</Text>
          <View style={styles.presetChips}>
            {sampleShipments.map((ship) => (
              <TouchableOpacity
                key={ship.id}
                style={[
                  styles.presetChip,
                  ship.status === 'On the way' && styles.presetChipOrange,
                  ship.status === 'Completed' && styles.presetChipGreen,
                ]}
                onPress={() => handleScanPreset(ship.trackingNumber)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={ship.status === 'Completed' ? 'checkmark-circle' : 'cube-outline'}
                  size={14}
                  color={ship.status === 'Completed' ? COLORS.green : COLORS.orange}
                />
                <Text style={styles.presetChipNumber}>{ship.trackingNumber}</Text>
                <Text style={styles.presetChipStatus}>• {ship.status}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Manual Code Input Bar */}
        <View style={styles.manualSection}>
          <Text style={styles.manualTitle}>Or Enter Tracking Number Manually</Text>
          <View style={styles.manualInputRow}>
            <TextInput
              style={styles.manualInput}
              placeholder="e.g. SW-LAG-9428, SW-ABJ-1530"
              placeholderTextColor="#6b7280"
              value={manualCode}
              onChangeText={setManualCode}
              autoCapitalize="characters"
            />
            <TouchableOpacity
              style={styles.trackButton}
              onPress={handleManualTrack}
              activeOpacity={0.85}
            >
              <Text style={styles.trackButtonText}>Lookup</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  iconButtonActive: {
    backgroundColor: 'rgba(250, 204, 21, 0.2)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-around',
    paddingBottom: 40,
  },
  viewfinderContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  viewfinderFrame: {
    width: 240,
    height: 240,
    borderRadius: 24,
    backgroundColor: '#12141a',
    borderWidth: 1,
    borderColor: '#262a36',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: COLORS.green,
  },
  cornerTopLeft: {
    top: 12,
    left: 12,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 6,
  },
  cornerTopRight: {
    top: 12,
    right: 12,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 6,
  },
  cornerBottomLeft: {
    bottom: 12,
    left: 12,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 6,
  },
  cornerBottomRight: {
    bottom: 12,
    right: 12,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 6,
  },
  scanningLaser: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 20,
    height: 3,
    backgroundColor: COLORS.green,
    shadowColor: COLORS.green,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 6,
  },
  viewfinderHint: {
    color: COLORS.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 18,
    maxWidth: 240,
  },
  presetsSection: {
    marginTop: 10,
  },
  presetsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 10,
  },
  presetChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1d26',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#2b303d',
    gap: 6,
  },
  presetChipOrange: {
    borderColor: 'rgba(249, 115, 22, 0.4)',
    backgroundColor: 'rgba(249, 115, 22, 0.08)',
  },
  presetChipGreen: {
    borderColor: 'rgba(34, 197, 94, 0.4)',
    backgroundColor: 'rgba(34, 197, 94, 0.08)',
  },
  presetChipNumber: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  presetChipStatus: {
    color: '#9ca3af',
    fontSize: 11,
    fontWeight: '600',
  },
  manualSection: {
    marginTop: 10,
  },
  manualTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  manualInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  manualInput: {
    flex: 1,
    height: 50,
    backgroundColor: COLORS.card,
    borderRadius: 14,
    paddingHorizontal: 16,
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  trackButton: {
    backgroundColor: COLORS.green,
    paddingHorizontal: 20,
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackButtonText: {
    color: '#000000',
    fontWeight: '800',
    fontSize: 14,
  },
});
