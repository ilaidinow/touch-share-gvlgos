
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import CenteredModal from './CenteredModal';
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';

interface NFCContactModalProps {
  isVisible: boolean;
  onClose: () => void;
  phoneNumber: string | null;
  profilePicture: string | null;
  onContact: () => void;
}

export default function NFCContactModal({ 
  isVisible, 
  onClose, 
  phoneNumber,
  profilePicture,
  onContact
}: NFCContactModalProps) {
  const { theme } = useTheme();
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
    <CenteredModal isVisible={isVisible} onClose={onClose}>
      <View style={{ padding: 24 }}>
        {/* Header */}
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: 32 
        }}>
          <Text style={{
            fontSize: 22,
            fontWeight: '600',
            color: theme.text,
          }}>
            NFC Contact Sharing
          </Text>
          <TouchableOpacity 
            onPress={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: theme.backgroundAlt,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="close" size={20} color={theme.text} />
          </TouchableOpacity>
        </View>

        {/* NFC Status Circle */}
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <View style={{
            width: 140,
            height: 140,
            borderRadius: 70,
            backgroundColor: isListening ? theme.success + '20' : theme.backgroundAlt,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 24,
            borderWidth: 3,
            borderColor: isListening ? theme.success : theme.grey,
            position: 'relative',
          }}>
            {isListening ? (
              <View style={{ alignItems: 'center' }}>
                <Ionicons name="radio" size={50} color={theme.success} />
                {/* Animated rings */}
                <View style={{
                  position: 'absolute',
                  width: 90,
                  height: 90,
                  borderRadius: 45,
                  borderWidth: 2,
                  borderColor: theme.success + '40',
                  top: 25,
                  left: 25,
                }} />
                <View style={{
                  position: 'absolute',
                  width: 110,
                  height: 110,
                  borderRadius: 55,
                  borderWidth: 1,
                  borderColor: theme.success + '20',
                  top: 15,
                  left: 15,
                }} />
              </View>
            ) : (
              <Ionicons name="radio-outline" size={50} color={theme.textSecondary} />
            )}
          </View>
          
          <Text style={{
            fontSize: 17,
            fontWeight: '500',
            color: theme.text,
            marginBottom: 8,
            textAlign: 'center',
          }}>
            {nfcStatus}
          </Text>
          
          {isListening && (
            <Text style={{
              fontSize: 15,
              color: theme.textSecondary,
              textAlign: 'center',
            }}>
              Touch another phone to exchange contact info
            </Text>
          )}
        </View>

        {/* What's being shared */}
        <View style={{ 
          padding: 20, 
          backgroundColor: theme.backgroundAlt, 
          borderRadius: 16,
          marginBottom: 24,
        }}>
          <Text style={{
            fontSize: 15,
            color: theme.textSecondary,
            marginBottom: 16,
            textAlign: 'center',
          }}>
            Ready to share:
          </Text>
          
          <View style={{ gap: 12 }}>
            {phoneNumber && (
              <View style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                gap: 12,
                justifyContent: 'center',
              }}>
                <Ionicons name="call" size={20} color={theme.success} />
                <Text style={{ fontSize: 17, color: theme.text }}>
                  {phoneNumber}
                </Text>
              </View>
            )}
            
            {profilePicture && (
              <View style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                gap: 12,
                justifyContent: 'center',
              }}>
                <Ionicons name="person" size={20} color={theme.success} />
                <Text style={{ fontSize: 17, color: theme.text }}>
                  Profile Picture
                </Text>
              </View>
            )}
            
            {!phoneNumber && !profilePicture && (
              <Text style={{
                fontSize: 15,
                color: theme.textSecondary,
                fontStyle: 'italic',
                textAlign: 'center',
              }}>
                No information selected to share
              </Text>
            )}
          </View>
        </View>

        {/* Demo button for testing */}
        {isListening && (
          <TouchableOpacity
            style={{
              backgroundColor: theme.backgroundAlt,
              borderRadius: 12,
              paddingVertical: 16,
              paddingHorizontal: 24,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={handleManualTrigger}
          >
            <Text style={{
              fontSize: 17,
              fontWeight: '600',
              color: theme.text,
            }}>
              Simulate NFC Contact (Demo)
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </CenteredModal>
  );
}
