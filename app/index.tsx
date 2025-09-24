
import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Contacts from 'expo-contacts';
import SimpleBottomSheet from '../components/BottomSheet';
import DeviceDiscovery from '../components/DeviceDiscovery';
import FileShareSheet from '../components/FileShareSheet';
import PhoneNumberCard from '../components/PhoneNumberCard';

export default function MainScreen() {
  const [isDiscoveryVisible, setIsDiscoveryVisible] = useState(false);
  const [isFileShareVisible, setIsFileShareVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [selectedFiles, setSelectedFiles] = useState<any[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    loadPhoneNumber();
  }, []);

  const loadPhoneNumber = async () => {
    try {
      // Try to get phone number from contacts (user's own contact)
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        // For demo purposes, we'll use a placeholder
        // In a real app, you'd implement proper phone number detection
        setPhoneNumber('+1 (555) 123-4567');
      }
    } catch (error) {
      console.log('Error loading phone number:', error);
      setPhoneNumber('Not available');
    }
  };

  const handleStartSharing = () => {
    console.log('Starting device discovery');
    setIsDiscoveryVisible(true);
    setIsScanning(true);
  };

  const handleSelectFiles = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        multiple: true,
        type: '*/*',
      });

      if (!result.canceled && result.assets) {
        setSelectedFiles(result.assets);
        setIsFileShareVisible(true);
        console.log('Selected files:', result.assets);
      }
    } catch (error) {
      console.log('Error selecting files:', error);
      Alert.alert('Error', 'Failed to select files');
    }
  };

  const handleShareFiles = () => {
    if (selectedFiles.length > 0) {
      setIsFileShareVisible(true);
    } else {
      handleSelectFiles();
    }
  };

  const clearSelectedFiles = () => {
    setSelectedFiles([]);
    setIsFileShareVisible(false);
  };

  const handleSettings = () => {
    router.push('/settings');
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      {/* Header with Settings */}
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 20, paddingBottom: 0 }}>
        <TouchableOpacity
          onPress={handleSettings}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: colors.backgroundAlt,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="settings-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={commonStyles.content}>
          {/* Header */}
          <View style={[commonStyles.section, { marginTop: 20 }]}>
            <View style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 24,
            }}>
              <Ionicons name="phone-portrait" size={60} color={colors.background} />
            </View>
            
            <Text style={commonStyles.title}>ShareDrop</Text>
            <Text style={commonStyles.textSecondary}>
              Share files and contact info when devices are nearby
            </Text>
          </View>

          {/* Phone Number Card */}
          <PhoneNumberCard phoneNumber={phoneNumber} />

          {/* Action Buttons */}
          <View style={[commonStyles.section, { gap: 16 }]}>
            <TouchableOpacity
              style={[buttonStyles.primary, { width: '100%' }]}
              onPress={handleStartSharing}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Ionicons name="wifi" size={24} color={colors.background} />
                <Text style={buttonStyles.text}>Start Sharing</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[buttonStyles.secondary, { width: '100%' }]}
              onPress={handleShareFiles}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Ionicons name="document" size={24} color={colors.text} />
                <Text style={buttonStyles.textSecondary}>
                  {selectedFiles.length > 0 ? `Share ${selectedFiles.length} Files` : 'Select Files'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Selected Files Preview */}
          {selectedFiles.length > 0 && (
            <View style={commonStyles.section}>
              <Text style={commonStyles.subtitle}>Selected Files</Text>
              {selectedFiles.slice(0, 3).map((file, index) => (
                <View key={index} style={[commonStyles.card, { marginBottom: 8 }]}>
                  <View style={commonStyles.row}>
                    <View style={{ flex: 1 }}>
                      <Text style={[commonStyles.text, { textAlign: 'left', marginBottom: 4 }]}>
                        {file.name}
                      </Text>
                      <Text style={[commonStyles.textSecondary, { textAlign: 'left' }]}>
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </Text>
                    </View>
                    <Ionicons name="document-outline" size={24} color={colors.textSecondary} />
                  </View>
                </View>
              ))}
              {selectedFiles.length > 3 && (
                <Text style={commonStyles.textSecondary}>
                  +{selectedFiles.length - 3} more files
                </Text>
              )}
              <TouchableOpacity
                onPress={clearSelectedFiles}
                style={{ marginTop: 12 }}
              >
                <Text style={[commonStyles.textSecondary, { color: colors.error }]}>
                  Clear Selection
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Instructions */}
          <View style={[commonStyles.section, { marginTop: 'auto', marginBottom: 40 }]}>
            <Text style={commonStyles.textSecondary}>
              Bring devices close together to share files and contact information
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Device Discovery Bottom Sheet */}
      <DeviceDiscovery
        isVisible={isDiscoveryVisible}
        onClose={() => {
          setIsDiscoveryVisible(false);
          setIsScanning(false);
        }}
        isScanning={isScanning}
        selectedFiles={selectedFiles}
        phoneNumber={phoneNumber}
      />

      {/* File Share Bottom Sheet */}
      <FileShareSheet
        isVisible={isFileShareVisible}
        onClose={() => setIsFileShareVisible(false)}
        files={selectedFiles}
        onSelectFiles={handleSelectFiles}
      />
    </SafeAreaView>
  );
}
