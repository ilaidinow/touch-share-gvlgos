
import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Contacts from 'expo-contacts';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../contexts/ThemeContext';
import { createStyles } from '../styles/commonStyles';
import NFCContactModal from '../components/NFCContactModal';
import PhoneNumberCard from '../components/PhoneNumberCard';
import ProfilePictureCard from '../components/ProfilePictureCard';
import ContactAnimation from '../components/ContactAnimation';
import NameCard from '../components/NameCard';

export default function MainScreen() {
  const { theme } = useTheme();
  const { commonStyles, buttonStyles } = createStyles(theme);
  
  const [isNFCModalVisible, setIsNFCModalVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [isNFCActive, setIsNFCActive] = useState(false);
  const [sharePhoneNumber, setSharePhoneNumber] = useState(true);
  const [shareProfilePicture, setShareProfilePicture] = useState(true);
  const [shareName, setShareName] = useState(true);
  const [showContactAnimation, setShowContactAnimation] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      // Load saved data from AsyncStorage
      const savedPhoneNumber = await AsyncStorage.getItem('phoneNumber');
      const savedFirstName = await AsyncStorage.getItem('firstName');
      const savedLastName = await AsyncStorage.getItem('lastName');
      const savedProfilePicture = await AsyncStorage.getItem('profilePicture');
      
      if (savedPhoneNumber) setPhoneNumber(savedPhoneNumber);
      if (savedFirstName) setFirstName(savedFirstName);
      if (savedLastName) setLastName(savedLastName);
      if (savedProfilePicture) setProfilePicture(savedProfilePicture);
      
      console.log('User data loaded from storage');
    } catch (error) {
      console.log('Error loading user data:', error);
    }
  };

  const saveUserData = async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(key, value);
      console.log(`${key} saved:`, value);
    } catch (error) {
      console.log(`Error saving ${key}:`, error);
    }
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
    
    // Hide animation after completion
    setTimeout(() => {
      setShowContactAnimation(false);
    }, 4000);
  };

  const handleUpdatePhoneNumber = () => {
    if (Platform.OS === 'ios') {
      Alert.prompt(
        'Update Phone Number',
        'Enter your phone number:',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Save', 
            onPress: (text) => {
              if (text && text.trim()) {
                setPhoneNumber(text.trim());
                saveUserData('phoneNumber', text.trim());
              }
            }
          }
        ],
        'plain-text',
        phoneNumber
      );
    } else {
      // For Android, we'll use a simple alert for now
      // In a real app, you'd implement a proper input modal
      Alert.alert(
        'Update Phone Number',
        'This feature requires a custom input modal on Android. For demo purposes, using a default number.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Use Demo Number', 
            onPress: () => {
              const demoNumber = '+1 (555) 123-4567';
              setPhoneNumber(demoNumber);
              saveUserData('phoneNumber', demoNumber);
            }
          }
        ]
      );
    }
  };

  const handleUpdateName = () => {
    if (Platform.OS === 'ios') {
      Alert.prompt(
        'Update First Name',
        'Enter your first name:',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Next', 
            onPress: (text) => {
              if (text && text.trim()) {
                setFirstName(text.trim());
                saveUserData('firstName', text.trim());
                
                // Now prompt for last name
                setTimeout(() => {
                  Alert.prompt(
                    'Update Last Name',
                    'Enter your last name:',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { 
                        text: 'Save', 
                        onPress: (lastNameText) => {
                          if (lastNameText && lastNameText.trim()) {
                            setLastName(lastNameText.trim());
                            saveUserData('lastName', lastNameText.trim());
                          }
                        }
                      }
                    ],
                    'plain-text',
                    lastName
                  );
                }, 100);
              }
            }
          }
        ],
        'plain-text',
        firstName
      );
    } else {
      // For Android demo
      Alert.alert(
        'Update Name',
        'This feature requires a custom input modal on Android. For demo purposes, using default names.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Use Demo Name', 
            onPress: () => {
              setFirstName('John');
              setLastName('Doe');
              saveUserData('firstName', 'John');
              saveUserData('lastName', 'Doe');
            }
          }
        ]
      );
    }
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
        saveUserData('profilePicture', result.assets[0].uri);
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

          {/* Name Card */}
          <NameCard 
            firstName={firstName}
            lastName={lastName}
            onUpdate={handleUpdateName}
            isEnabled={shareName}
          />

          {/* Phone Number Card */}
          <PhoneNumberCard 
            phoneNumber={phoneNumber} 
            onUpdate={handleUpdatePhoneNumber}
            isEnabled={sharePhoneNumber}
          />

          {/* Profile Picture Card */}
          <ProfilePictureCard 
            profilePicture={profilePicture}
            onUpdate={handleUpdateProfilePicture}
            isEnabled={shareProfilePicture}
          />

          {/* Sharing Options */}
          <View style={[commonStyles.section, { marginBottom: 16 }]}>
            <Text style={[commonStyles.textSecondary, { marginBottom: 16, color: theme.textSecondary }]}>
              What to share:
            </Text>
            
            <View style={{ gap: 12, width: '100%' }}>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <TouchableOpacity
                  style={[
                    buttonStyles.secondary,
                    { 
                      flex: 1,
                      backgroundColor: shareName ? theme.primary : theme.backgroundAlt,
                    }
                  ]}
                  onPress={() => setShareName(!shareName)}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Ionicons 
                      name="person" 
                      size={20} 
                      color={shareName ? theme.background : theme.text} 
                    />
                    <Text style={[
                      buttonStyles.textSecondary,
                      { color: shareName ? theme.background : theme.text }
                    ]}>
                      Name
                    </Text>
                  </View>
                </TouchableOpacity>

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
              </View>

              <TouchableOpacity
                style={[
                  buttonStyles.secondary,
                  { 
                    backgroundColor: shareProfilePicture ? theme.primary : theme.backgroundAlt,
                  }
                ]}
                onPress={() => setShareProfilePicture(!shareProfilePicture)}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                  <Ionicons 
                    name="image" 
                    size={20} 
                    color={shareProfilePicture ? theme.background : theme.text} 
                  />
                  <Text style={[
                    buttonStyles.textSecondary,
                    { color: shareProfilePicture ? theme.background : theme.text }
                  ]}>
                    Profile Picture
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
        firstName={shareName ? firstName : null}
        lastName={shareName ? lastName : null}
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
