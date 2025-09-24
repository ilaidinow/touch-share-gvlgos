
import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Contacts from 'expo-contacts';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../contexts/ThemeContext';
import { createStyles } from '../styles/commonStyles';
import NFCContactModal from '../components/NFCContactModal';
import PhoneNumberCard from '../components/PhoneNumberCard';
import ProfilePictureCard from '../components/ProfilePictureCard';
import ContactAnimation from '../components/ContactAnimation';

export default function MainScreen() {
  const { theme } = useTheme();
  const { commonStyles, buttonStyles } = createStyles(theme);
  
  const [isNFCModalVisible, setIsNFCModalVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [isNFCActive, setIsNFCActive] = useState(false);
  const [sharePhoneNumber, setSharePhoneNumber] = useState(true);
  const [shareProfilePicture, setShareProfilePicture] = useState(true);
  const [showContactAnimation, setShowContactAnimation] = useState(false);

  useEffect(() => {
    loadPhoneNumber();
    loadProfilePicture();
  }, []);

  const loadPhoneNumber = async () => {
    try {
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

  const loadProfilePicture = () => {
    // Load saved profile picture from storage if available
    // For demo, we'll start with null
    console.log('Loading profile picture from storage');
  };

  const handleStartNFC = () => {
    console.log('Starting NFC sharing');
    setIsNFCModalVisible(true);
    setIsNFCActive(true);
  };

  const handleStopNFC = () => {
    console.log('Stopping NFC sharing');
    setIsNFCModalVisible(false);
    setIsNFCActive(false);
  };

  const handleNFCContact = () => {
    console.log('NFC contact detected!');
    setShowContactAnimation(true);
    
    // Hide animation after 3 seconds
    setTimeout(() => {
      setShowContactAnimation(false);
    }, 3000);
  };

  const handleUpdatePhoneNumber = () => {
    Alert.prompt(
      'Update Phone Number',
      'Enter your new phone number:',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Update', 
          onPress: (text) => {
            if (text) {
              setPhoneNumber(text);
              console.log('Phone number updated:', text);
            }
          }
        }
      ],
      'plain-text',
      phoneNumber
    );
  };

  const handleUpdateProfilePicture = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to access your photos');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setProfilePicture(result.assets[0].uri);
        console.log('Profile picture updated:', result.assets[0].uri);
      }
    } catch (error) {
      console.log('Error updating profile picture:', error);
      Alert.alert('Error', 'Failed to update profile picture');
    }
  };

  const handleSettings = () => {
    router.push('/settings');
  };

  return (
    <SafeAreaView style={[commonStyles.container, { backgroundColor: theme.background }]}>
      {/* Header with Settings */}
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 20, paddingBottom: 0 }}>
        <TouchableOpacity
          onPress={handleSettings}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: theme.backgroundAlt,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="settings-outline" size={24} color={theme.text} />
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
              backgroundColor: theme.primary,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 24,
            }}>
              <Ionicons name="phone-portrait" size={60} color={theme.background} />
            </View>
            
            <Text style={[commonStyles.title, { color: theme.text }]}>ContactBeam</Text>
            <Text style={[commonStyles.textSecondary, { color: theme.textSecondary }]}>
              Touch phones together to exchange contact information
            </Text>
          </View>

          {/* Profile Picture Card */}
          <ProfilePictureCard 
            profilePicture={profilePicture}
            onUpdate={handleUpdateProfilePicture}
            isEnabled={shareProfilePicture}
          />

          {/* Phone Number Card */}
          <PhoneNumberCard 
            phoneNumber={phoneNumber} 
            onUpdate={handleUpdatePhoneNumber}
            isEnabled={sharePhoneNumber}
          />

          {/* Sharing Options */}
          <View style={[commonStyles.section, { marginBottom: 16 }]}>
            <Text style={[commonStyles.textSecondary, { marginBottom: 16, color: theme.textSecondary }]}>
              What to share:
            </Text>
            
            <View style={{ flexDirection: 'row', gap: 12, width: '100%' }}>
              <TouchableOpacity
                style={[
                  buttonStyles.secondary,
                  { 
                    flex: 1,
                    backgroundColor: sharePhoneNumber ? theme.primary : theme.backgroundAlt,
                  }
                ]}
                onPress={() => setSharePhoneNumber(!sharePhoneNumber)}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Ionicons 
                    name="call" 
                    size={20} 
                    color={sharePhoneNumber ? theme.background : theme.text} 
                  />
                  <Text style={[
                    buttonStyles.textSecondary,
                    { color: sharePhoneNumber ? theme.background : theme.text }
                  ]}>
                    Phone
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  buttonStyles.secondary,
                  { 
                    flex: 1,
                    backgroundColor: shareProfilePicture ? theme.primary : theme.backgroundAlt,
                  }
                ]}
                onPress={() => setShareProfilePicture(!shareProfilePicture)}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Ionicons 
                    name="person" 
                    size={20} 
                    color={shareProfilePicture ? theme.background : theme.text} 
                  />
                  <Text style={[
                    buttonStyles.textSecondary,
                    { color: shareProfilePicture ? theme.background : theme.text }
                  ]}>
                    Photo
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* NFC Action Button */}
          <View style={[commonStyles.section, { gap: 16 }]}>
            <TouchableOpacity
              style={[
                buttonStyles.primary, 
                { 
                  width: '100%',
                  backgroundColor: isNFCActive ? theme.success : theme.primary,
                }
              ]}
              onPress={isNFCActive ? handleStopNFC : handleStartNFC}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Ionicons 
                  name={isNFCActive ? "stop-circle" : "radio"} 
                  size={24} 
                  color={theme.background} 
                />
                <Text style={[buttonStyles.text, { color: theme.background }]}>
                  {isNFCActive ? 'Stop NFC Sharing' : 'Start NFC Sharing'}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Test Contact Button (for demo) */}
            <TouchableOpacity
              style={[buttonStyles.secondary, { width: '100%', backgroundColor: theme.backgroundAlt }]}
              onPress={handleNFCContact}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Ionicons name="flash" size={24} color={theme.text} />
                <Text style={[buttonStyles.textSecondary, { color: theme.text }]}>
                  Test Contact Animation
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Instructions */}
          <View style={[commonStyles.section, { marginTop: 'auto', marginBottom: 40 }]}>
            <Text style={[commonStyles.textSecondary, { color: theme.textSecondary }]}>
              {isNFCActive 
                ? 'Ready to share! Touch another phone with ContactBeam open'
                : 'Tap "Start NFC Sharing" then touch phones together'
              }
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* NFC Contact Modal */}
      <NFCContactModal
        isVisible={isNFCModalVisible}
        onClose={handleStopNFC}
        phoneNumber={sharePhoneNumber ? phoneNumber : null}
        profilePicture={shareProfilePicture ? profilePicture : null}
        onContact={handleNFCContact}
      />

      {/* Contact Animation Overlay */}
      {showContactAnimation && (
        <ContactAnimation onComplete={() => setShowContactAnimation(false)} />
      )}
    </SafeAreaView>
  );
}
