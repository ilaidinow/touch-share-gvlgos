
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import SimpleBottomSheet from './BottomSheet';
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';

interface NFCContactSheetProps {
  isVisible: boolean;
  onClose: () => void;
  phoneNumber: string | null;
  profilePicture: string | null;
  onContact: () => void;
}

export default function NFCContactSheet({ 
  isVisible, 
  onClose, 
  phoneNumber,
  profilePicture,
  onContact
}: NFCContactSheetProps) {
  const [isNFCEnabled, setIsNFCEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [nfcStatus, setNfcStatus] = useState<string>('Initializing...');

  useEffect(() => {
    if (isVisible) {
      initNFC();
    } else {
      cleanupNFC();
    }

    return () => {
      cleanupNFC();
    };
  }, [isVisible]);

  const initNFC = async () => {
    try {
      console.log('Initializing NFC...');
      const isSupported = await NfcManager.isSupported();
      
      if (!isSupported) {
        setNfcStatus('NFC not supported on this device');
        return;
      }

      await NfcManager.start();
      const isEnabled = await NfcManager.isEnabled();
      
      if (!isEnabled) {
        setNfcStatus('Please enable NFC in device settings');
        return;
      }

      setIsNFCEnabled(true);
      setNfcStatus('NFC ready');
      startListening();
    } catch (error) {
      console.log('NFC initialization error:', error);
      setNfcStatus('Failed to initialize NFC');
    }
  };

  const startListening = async () => {
    try {
      setIsListening(true);
      setNfcStatus('Listening for NFC contact...');
      
      // Listen for NFC tags
      await NfcManager.requestTechnology(NfcTech.Ndef);
      
      // Simulate NFC contact detection for demo
      // In a real app, this would be triggered by actual NFC contact
      setTimeout(() => {
        if (isListening) {
          handleNFCDetected();
        }
      }, 5000);
      
    } catch (error) {
      console.log('NFC listening error:', error);
      setNfcStatus('Error listening for NFC');
      setIsListening(false);
    }
  };

  const handleNFCDetected = async () => {
    try {
      console.log('NFC contact detected!');
      setNfcStatus('Contact detected! Exchanging information...');
      
      // Create contact data
      const contactData = {
        phoneNumber: phoneNumber,
        profilePicture: profilePicture,
        timestamp: new Date().toISOString(),
      };

      // In a real app, you would write/read NFC data here
      console.log('Sharing contact data:', contactData);
      
      // Trigger contact animation
      onContact();
      
      // Simulate data exchange
      setTimeout(() => {
        setNfcStatus('Contact information exchanged successfully!');
        
        setTimeout(() => {
          Alert.alert(
            'Success!',
            'Contact information has been shared successfully.',
            [{ text: 'OK', onPress: onClose }]
          );
        }, 1000);
      }, 2000);
      
    } catch (error) {
      console.log('NFC exchange error:', error);
      setNfcStatus('Failed to exchange contact information');
    }
  };

  const cleanupNFC = async () => {
    try {
      setIsListening(false);
      await NfcManager.cancelTechnologyRequest();
    } catch (error) {
      console.log('NFC cleanup error:', error);
    }
  };

  const handleManualTrigger = () => {
    if (isListening) {
      handleNFCDetected();
    }
  };

  return (
    <SimpleBottomSheet isVisible={isVisible} onClose={onClose}>
      <View style={{ padding: 20 }}>
        <View style={[commonStyles.row, { marginBottom: 24 }]}>
          <Text style={commonStyles.subtitle}>NFC Contact Sharing</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={28} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* NFC Status */}
        <View style={[commonStyles.center, { paddingVertical: 40 }]}>
          <View style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: isListening ? colors.success + '20' : colors.backgroundAlt,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 24,
            borderWidth: 3,
            borderColor: isListening ? colors.success : colors.grey,
          }}>
            {isListening ? (
              <View style={{ alignItems: 'center' }}>
                <Ionicons name="radio" size={40} color={colors.success} />
                <View style={{
                  position: 'absolute',
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  borderWidth: 2,
                  borderColor: colors.success + '40',
                  top: 20,
                  left: 20,
                }} />
                <View style={{
                  position: 'absolute',
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  borderWidth: 1,
                  borderColor: colors.success + '20',
                  top: 10,
                  left: 10,
                }} />
              </View>
            ) : (
              <Ionicons name="radio-outline" size={40} color={colors.textSecondary} />
            )}
          </View>
          
          <Text style={[commonStyles.text, { marginBottom: 8 }]}>
            {nfcStatus}
          </Text>
          
          {isListening && (
            <Text style={commonStyles.textSecondary}>
              Touch another phone to exchange contact info
            </Text>
          )}
        </View>

        {/* What's being shared */}
        <View style={{ marginTop: 20, padding: 16, backgroundColor: colors.backgroundAlt, borderRadius: 12 }}>
          <Text style={[commonStyles.textSecondary, { marginBottom: 12 }]}>
            Ready to share:
          </Text>
          
          <View style={{ gap: 8 }}>
            {phoneNumber && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Ionicons name="call" size={20} color={colors.success} />
                <Text style={commonStyles.text}>Phone: {phoneNumber}</Text>
              </View>
            )}
            
            {profilePicture && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Ionicons name="person" size={20} color={colors.success} />
                <Text style={commonStyles.text}>Profile Picture</Text>
              </View>
            )}
            
            {!phoneNumber && !profilePicture && (
              <Text style={[commonStyles.textSecondary, { fontStyle: 'italic' }]}>
                No information selected to share
              </Text>
            )}
          </View>
        </View>

        {/* Demo button for testing */}
        {isListening && (
          <TouchableOpacity
            style={[buttonStyles.secondary, { width: '100%', marginTop: 20 }]}
            onPress={handleManualTrigger}
          >
            <Text style={buttonStyles.textSecondary}>
              Simulate NFC Contact (Demo)
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SimpleBottomSheet>
  );
}
