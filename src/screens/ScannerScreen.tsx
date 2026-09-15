import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { sampleShipments } from '../data/mockData';

interface ScannerScreenProps {
  onBack: () => void;
  onTrackPackage: (trackingNumber: string) => void;
}

export default function ScannerScreen({ onBack, onTrackPackage }: ScannerScreenProps) {
  const [manualCode, setManualCode] = useState('');
  const [flashOn, setFlashOn] = useState(false);

  const handleScanPreset = (trackingNumber: string) => {
    onTrackPackage(trackingNumber);
  };

  const handleManualTrack = () => {
    if (!manualCode.trim()) {
      Alert.alert('Invalid Code', 'Please enter a valid tracking number.');
      return;
    }
    onTrackPackage(manualCode.trim());
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

        <Text style={styles.headerTitle}>Scan Parcel Code</Text>

        <TouchableOpacity
          style={[styles.iconButton, flashOn && styles.iconButtonActive]}
          onPress={() => setFlashOn(!flashOn)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
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
            {/* 4 Corner Markers */}
            <View style={[styles.corner, styles.cornerTopLeft]} />
            <View style={[styles.corner, styles.cornerTopRight]} />
            <View style={[styles.corner, styles.cornerBottomLeft]} />
            <View style={[styles.corner, styles.cornerBottomRight]} />

            {/* Simulated Scanning Laser Line */}
            <View style={styles.scanningLaser} />

            <MaterialCommunityIcons
              name="barcode-scan"
              size={64}
              color="rgba(34, 197, 94, 0.4)"
            />
          </View>

          <Text style={styles.viewfinderHint}>
            Align package QR code or standard 1D barcode within the viewfinder
          </Text>
        </View>

        {/* Quick Sample Tracking Presets */}
        <View style={styles.presetsSection}>
          <Text style={styles.presetsTitle}>Quick Sample Codes (Tap to Test)</Text>
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
                <Text style={styles.presetChipNumber}>{ship.trackingNumber}</Text>
                <Text style={styles.presetChipStatus}>{ship.status}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Manual Code Input Bar */}
        <View style={styles.manualSection}>
          <Text style={styles.manualTitle}>Or Enter Code Manually</Text>
          <View style={styles.manualInputRow}>
            <TextInput
              style={styles.manualInput}
              placeholder="e.g. A425HYJ8, C782BN91"
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
              <Text style={styles.trackButtonText}>Track</Text>
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
  iconButtonActive: {
    backgroundColor: '#3b2d11',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    paddingBottom: 30,
  },
  viewfinderContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  viewfinderFrame: {
    width: 250,
    height: 250,
    borderRadius: 24,
    backgroundColor: '#16181e',
    borderWidth: 1,
    borderColor: '#2d313c',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: COLORS.green,
  },
  cornerTopLeft: {
    top: 14,
    left: 14,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 6,
  },
  cornerTopRight: {
    top: 14,
    right: 14,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 6,
  },
  cornerBottomLeft: {
    bottom: 14,
    left: 14,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 6,
  },
  cornerBottomRight: {
    bottom: 14,
    right: 14,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 6,
  },
  scanningLaser: {
    position: 'absolute',
    width: '80%',
    height: 2,
    backgroundColor: COLORS.green,
    shadowColor: COLORS.green,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  viewfinderHint: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 16,
    maxWidth: 240,
    lineHeight: 17,
  },
  presetsSection: {
    marginVertical: 16,
  },
  presetsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 10,
    textAlign: 'center',
  },
  presetChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  presetChip: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  presetChipOrange: {
    borderColor: '#4d2d14',
    backgroundColor: '#201610',
  },
  presetChipGreen: {
    borderColor: '#193b22',
    backgroundColor: '#122016',
  },
  presetChipNumber: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.text,
  },
  presetChipStatus: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  manualSection: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  manualTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 10,
  },
  manualInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  manualInput: {
    flex: 1,
    backgroundColor: '#111215',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  trackButton: {
    backgroundColor: COLORS.green,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 13,
  },
  trackButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#000000',
  },
});
