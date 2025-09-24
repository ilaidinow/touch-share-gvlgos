
import React, { useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function SettingsScreen() {
  const [isDiscoverable, setIsDiscoverable] = useState(true);
  const [autoShare, setAutoShare] = useState(false);
  const [sharePhoneNumber, setSharePhoneNumber] = useState(true);
  const [shareProfilePicture, setShareProfilePicture] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleBack = () => {
    router.back();
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear Data',
      'This will clear your saved phone number and profile picture. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: () => {
          console.log('Clearing app data');
          Alert.alert('Success', 'App data cleared successfully');
        }}
      ]
    );
  };

  const handleNFCSettings = () => {
    Alert.alert(
      'NFC Settings',
      'To enable or disable NFC, please go to your device settings.',
      [
        { text: 'OK' }
      ]
    );
  };

  const SettingRow = ({ 
    title, 
    subtitle, 
    value, 
    onValueChange, 
    type = 'switch',
    onPress
  }: {
    title: string;
    subtitle?: string;
    value?: boolean;
    onValueChange?: (value: boolean) => void;
    type?: 'switch' | 'button';
    onPress?: () => void;
  }) => (
    <TouchableOpacity 
      style={[commonStyles.card, { marginBottom: 12 }]}
      onPress={type === 'button' ? onPress : undefined}
      disabled={type === 'switch'}
    >
      <View style={commonStyles.row}>
        <View style={{ flex: 1 }}>
          <Text style={[commonStyles.text, { textAlign: 'left', marginBottom: subtitle ? 4 : 0 }]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[commonStyles.textSecondary, { textAlign: 'left' }]}>
              {subtitle}
            </Text>
          )}
        </View>
        {type === 'switch' && (
          <Switch
            value={value}
            onValueChange={onValueChange}
            trackColor={{ false: colors.grey, true: colors.primary }}
            thumbColor={colors.background}
          />
        )}
        {type === 'button' && (
          <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20, paddingBottom: 0 }}>
        <TouchableOpacity
          onPress={handleBack}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: colors.backgroundAlt,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 16,
          }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={commonStyles.subtitle}>Settings</Text>
      </View>

      <ScrollView 
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ marginBottom: 32 }}>
          <Text style={[commonStyles.textSecondary, { textAlign: 'left', marginBottom: 16 }]}>
            NFC SHARING
          </Text>
          
          <SettingRow
            title="Make Device Discoverable"
            subtitle="Allow other devices to detect your device via NFC"
            value={isDiscoverable}
            onValueChange={setIsDiscoverable}
          />

          <SettingRow
            title="Auto Share"
            subtitle="Automatically share when NFC contact is detected"
            value={autoShare}
            onValueChange={setAutoShare}
          />

          <SettingRow
            title="NFC Settings"
            subtitle="Configure NFC in device settings"
            type="button"
            onPress={handleNFCSettings}
          />
        </View>

        <View style={{ marginBottom: 32 }}>
          <Text style={[commonStyles.textSecondary, { textAlign: 'left', marginBottom: 16 }]}>
            CONTACT INFORMATION
          </Text>
          
          <SettingRow
            title="Share Phone Number"
            subtitle="Include your phone number when sharing contact info"
            value={sharePhoneNumber}
            onValueChange={setSharePhoneNumber}
          />

          <SettingRow
            title="Share Profile Picture"
            subtitle="Include your profile picture when sharing contact info"
            value={shareProfilePicture}
            onValueChange={setShareProfilePicture}
          />
        </View>

        <View style={{ marginBottom: 32 }}>
          <Text style={[commonStyles.textSecondary, { textAlign: 'left', marginBottom: 16 }]}>
            NOTIFICATIONS
          </Text>
          
          <SettingRow
            title="Vibration"
            subtitle="Vibrate when contact is shared"
            value={vibrationEnabled}
            onValueChange={setVibrationEnabled}
          />

          <SettingRow
            title="Sound"
            subtitle="Play sound when contact is shared"
            value={soundEnabled}
            onValueChange={setSoundEnabled}
          />
        </View>

        <View style={{ marginBottom: 32 }}>
          <Text style={[commonStyles.textSecondary, { textAlign: 'left', marginBottom: 16 }]}>
            ABOUT
          </Text>
          
          <View style={[commonStyles.card, { marginBottom: 12 }]}>
            <View style={commonStyles.row}>
              <View style={{ flex: 1 }}>
                <Text style={[commonStyles.text, { textAlign: 'left', marginBottom: 4 }]}>
                  Version
                </Text>
                <Text style={[commonStyles.textSecondary, { textAlign: 'left' }]}>
                  1.0.0
                </Text>
              </View>
            </View>
          </View>

          <View style={[commonStyles.card, { marginBottom: 12 }]}>
            <View style={commonStyles.row}>
              <View style={{ flex: 1 }}>
                <Text style={[commonStyles.text, { textAlign: 'left', marginBottom: 4 }]}>
                  Device ID
                </Text>
                <Text style={[commonStyles.textSecondary, { textAlign: 'left' }]}>
                  NFC-{Math.random().toString(36).substr(2, 8).toUpperCase()}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{ marginBottom: 40 }}>
          <Text style={[commonStyles.textSecondary, { textAlign: 'left', marginBottom: 16 }]}>
            DATA MANAGEMENT
          </Text>
          
          <TouchableOpacity
            style={[buttonStyles.secondary, { width: '100%', backgroundColor: colors.error + '20' }]}
            onPress={handleClearData}
          >
            <Text style={[buttonStyles.textSecondary, { color: colors.error }]}>
              Clear Contact Data
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
