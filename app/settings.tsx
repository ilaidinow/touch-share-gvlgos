
import React, { useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function SettingsScreen() {
  const [isDiscoverable, setIsDiscoverable] = useState(true);
  const [autoAcceptFiles, setAutoAcceptFiles] = useState(false);
  const [sharePhoneNumber, setSharePhoneNumber] = useState(true);

  const handleBack = () => {
    router.back();
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear Data',
      'This will clear all app data including saved files and preferences. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: () => {
          console.log('Clearing app data');
          Alert.alert('Success', 'App data cleared successfully');
        }}
      ]
    );
  };

  const SettingRow = ({ 
    title, 
    subtitle, 
    value, 
    onValueChange, 
    type = 'switch' 
  }: {
    title: string;
    subtitle?: string;
    value?: boolean;
    onValueChange?: (value: boolean) => void;
    type?: 'switch' | 'button';
  }) => (
    <View style={[commonStyles.card, { marginBottom: 12 }]}>
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
      </View>
    </View>
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
            SHARING PREFERENCES
          </Text>
          
          <SettingRow
            title="Make Device Discoverable"
            subtitle="Allow other devices to find and connect to your device"
            value={isDiscoverable}
            onValueChange={setIsDiscoverable}
          />

          <SettingRow
            title="Auto-Accept Files"
            subtitle="Automatically accept incoming files from trusted devices"
            value={autoAcceptFiles}
            onValueChange={setAutoAcceptFiles}
          />

          <SettingRow
            title="Share Phone Number"
            subtitle="Include your phone number when sharing with other devices"
            value={sharePhoneNumber}
            onValueChange={setSharePhoneNumber}
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
                  SD-{Math.random().toString(36).substr(2, 8).toUpperCase()}
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
              Clear All Data
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
