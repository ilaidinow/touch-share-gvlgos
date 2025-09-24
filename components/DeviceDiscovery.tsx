
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import SimpleBottomSheet from './BottomSheet';

interface Device {
  id: string;
  name: string;
  distance: 'Very Close' | 'Close' | 'Nearby';
  rssi?: number;
}

interface DeviceDiscoveryProps {
  isVisible: boolean;
  onClose: () => void;
  isScanning: boolean;
  selectedFiles: any[];
  phoneNumber: string;
}

export default function DeviceDiscovery({ 
  isVisible, 
  onClose, 
  isScanning, 
  selectedFiles, 
  phoneNumber 
}: DeviceDiscoveryProps) {
  const [discoveredDevices, setDiscoveredDevices] = useState<Device[]>([]);
  const [isTransferring, setIsTransferring] = useState(false);

  useEffect(() => {
    if (isScanning && isVisible) {
      // Simulate device discovery
      const timer = setTimeout(() => {
        const mockDevices: Device[] = [
          { id: '1', name: 'John\'s Phone', distance: 'Very Close' },
          { id: '2', name: 'Sarah\'s Device', distance: 'Close' },
          { id: '3', name: 'Mike\'s Phone', distance: 'Nearby' },
        ];
        setDiscoveredDevices(mockDevices);
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      setDiscoveredDevices([]);
    }
  }, [isScanning, isVisible]);

  const handleDeviceSelect = async (device: Device) => {
    console.log('Connecting to device:', device.name);
    setIsTransferring(true);

    // Simulate file transfer
    setTimeout(() => {
      setIsTransferring(false);
      Alert.alert(
        'Transfer Complete',
        `Successfully shared ${selectedFiles.length > 0 ? selectedFiles.length + ' files' : 'phone number'} with ${device.name}`,
        [{ text: 'OK', onPress: onClose }]
      );
    }, 3000);
  };

  const getDistanceIcon = (distance: string) => {
    switch (distance) {
      case 'Very Close':
        return 'radio-button-on';
      case 'Close':
        return 'radio-button-off';
      case 'Nearby':
        return 'ellipse-outline';
      default:
        return 'ellipse-outline';
    }
  };

  const getDistanceColor = (distance: string) => {
    switch (distance) {
      case 'Very Close':
        return colors.success;
      case 'Close':
        return colors.warning;
      case 'Nearby':
        return colors.textSecondary;
      default:
        return colors.textSecondary;
    }
  };

  return (
    <SimpleBottomSheet isVisible={isVisible} onClose={onClose}>
      <View style={{ padding: 20 }}>
        <View style={[commonStyles.row, { marginBottom: 24 }]}>
          <Text style={commonStyles.subtitle}>Nearby Devices</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={28} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {isTransferring ? (
          <View style={[commonStyles.center, { paddingVertical: 40 }]}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[commonStyles.text, { marginTop: 16 }]}>
              Transferring...
            </Text>
          </View>
        ) : (
          <>
            {isScanning && discoveredDevices.length === 0 ? (
              <View style={[commonStyles.center, { paddingVertical: 40 }]}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={[commonStyles.text, { marginTop: 16 }]}>
                  Scanning for nearby devices...
                </Text>
                <Text style={[commonStyles.textSecondary, { marginTop: 8 }]}>
                  Make sure other devices have ShareDrop open
                </Text>
              </View>
            ) : (
              <>
                {discoveredDevices.map((device) => (
                  <TouchableOpacity
                    key={device.id}
                    style={[commonStyles.card, { marginBottom: 12 }]}
                    onPress={() => handleDeviceSelect(device)}
                  >
                    <View style={commonStyles.row}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                        <View style={{
                          width: 48,
                          height: 48,
                          borderRadius: 24,
                          backgroundColor: colors.backgroundAlt,
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: 16,
                        }}>
                          <Ionicons name="phone-portrait" size={24} color={colors.text} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={[commonStyles.text, { textAlign: 'left', marginBottom: 4 }]}>
                            {device.name}
                          </Text>
                          <Text style={[commonStyles.textSecondary, { textAlign: 'left' }]}>
                            {device.distance}
                          </Text>
                        </View>
                      </View>
                      <Ionicons 
                        name={getDistanceIcon(device.distance)} 
                        size={24} 
                        color={getDistanceColor(device.distance)} 
                      />
                    </View>
                  </TouchableOpacity>
                ))}

                {discoveredDevices.length === 0 && !isScanning && (
                  <View style={[commonStyles.center, { paddingVertical: 40 }]}>
                    <Ionicons name="search" size={48} color={colors.textSecondary} />
                    <Text style={[commonStyles.text, { marginTop: 16 }]}>
                      No devices found
                    </Text>
                    <Text style={[commonStyles.textSecondary, { marginTop: 8 }]}>
                      Make sure other devices are nearby and have ShareDrop open
                    </Text>
                  </View>
                )}
              </>
            )}
          </>
        )}

        {selectedFiles.length > 0 && !isTransferring && (
          <View style={{ marginTop: 20, padding: 16, backgroundColor: colors.backgroundAlt, borderRadius: 12 }}>
            <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
              Ready to share:
            </Text>
            <Text style={commonStyles.text}>
              {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''} + Phone number
            </Text>
          </View>
        )}
      </View>
    </SimpleBottomSheet>
  );
}
