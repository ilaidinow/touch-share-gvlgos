
import React, { useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { createStyles } from '../styles/commonStyles';

export default function SettingsScreen() {
  const { theme, isDark, toggleTheme, themeMode, setThemeMode } = useTheme();
  const { commonStyles, buttonStyles } = createStyles(theme);
  
  const [nfcEnabled, setNfcEnabled] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [autoShare, setAutoShare] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will remove all your saved contact information and settings. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear Data', 
          style: 'destructive',
          onPress: () => {
            console.log('Clearing all data...');
            Alert.alert('Success', 'All data has been cleared.');
          }
        }
      ]
    );
  };

  const handleNFCSettings = () => {
    Alert.alert(
      'NFC Settings',
      'Open device NFC settings to configure NFC functionality.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Settings', onPress: () => console.log('Opening NFC settings...') }
      ]
    );
  };

  const handleThemeModeChange = (mode: 'light' | 'dark' | 'system') => {
    setThemeMode(mode);
  };

  const SettingRow = ({ 
    title, 
    subtitle, 
    value, 
    onValueChange, 
    type = 'switch', 
    onPress,
    rightElement 
  }: {
    title: string;
    subtitle?: string;
    value?: boolean;
    onValueChange?: (value: boolean) => void;
    type?: 'switch' | 'button' | 'custom';
    onPress?: () => void;
    rightElement?: React.ReactNode;
  }) => (
    <TouchableOpacity
      style={{
        backgroundColor: theme.card,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
      onPress={onPress}
      disabled={type === 'switch'}
    >
      <View style={{ flex: 1 }}>
        <Text style={{
          fontSize: 17,
          fontWeight: '500',
          color: theme.text,
          marginBottom: subtitle ? 4 : 0,
        }}>
          {title}
        </Text>
        {subtitle && (
          <Text style={{
            fontSize: 15,
            color: theme.textSecondary,
          }}>
            {subtitle}
          </Text>
        )}
      </View>
      
      {type === 'switch' && (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: theme.grey, true: theme.primary }}
          thumbColor={theme.background}
        />
      )}
      
      {type === 'button' && (
        <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
      )}
      
      {type === 'custom' && rightElement}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[commonStyles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: theme.border,
      }}>
        <TouchableOpacity
          onPress={handleBack}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: theme.backgroundAlt,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 16,
          }}
        >
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        
        <Text style={[commonStyles.subtitle, { color: theme.text, marginBottom: 0 }]}>
          Settings
        </Text>
      </View>

      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Appearance Section */}
        <View style={{ marginBottom: 32 }}>
          <Text style={{
            fontSize: 20,
            fontWeight: '600',
            color: theme.text,
            marginBottom: 16,
          }}>
            Appearance
          </Text>
          
          <SettingRow
            title="Theme"
            subtitle={`Currently using ${themeMode === 'system' ? 'system' : themeMode} theme`}
            type="custom"
            rightElement={
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {(['light', 'dark', 'system'] as const).map((mode) => (
                  <TouchableOpacity
                    key={mode}
                    onPress={() => handleThemeModeChange(mode)}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 8,
                      backgroundColor: themeMode === mode ? theme.primary : theme.backgroundAlt,
                    }}
                  >
                    <Text style={{
                      fontSize: 14,
                      fontWeight: '500',
                      color: themeMode === mode ? theme.background : theme.text,
                      textTransform: 'capitalize',
                    }}>
                      {mode}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            }
          />
        </View>

        {/* NFC Section */}
        <View style={{ marginBottom: 32 }}>
          <Text style={{
            fontSize: 20,
            fontWeight: '600',
            color: theme.text,
            marginBottom: 16,
          }}>
            NFC & Sharing
          </Text>
          
          <SettingRow
            title="NFC Enabled"
            subtitle="Allow NFC contact sharing"
            value={nfcEnabled}
            onValueChange={setNfcEnabled}
          />
          
          <SettingRow
            title="Auto Share"
            subtitle="Automatically share when NFC contact is detected"
            value={autoShare}
            onValueChange={setAutoShare}
          />
          
          <SettingRow
            title="Device NFC Settings"
            subtitle="Configure system NFC settings"
            type="button"
            onPress={handleNFCSettings}
          />
        </View>

        {/* Experience Section */}
        <View style={{ marginBottom: 32 }}>
          <Text style={{
            fontSize: 20,
            fontWeight: '600',
            color: theme.text,
            marginBottom: 16,
          }}>
            Experience
          </Text>
          
          <SettingRow
            title="Haptic Feedback"
            subtitle="Vibrate on NFC contact and interactions"
            value={hapticFeedback}
            onValueChange={setHapticFeedback}
          />
        </View>

        {/* Data Section */}
        <View style={{ marginBottom: 32 }}>
          <Text style={{
            fontSize: 20,
            fontWeight: '600',
            color: theme.text,
            marginBottom: 16,
          }}>
            Data & Privacy
          </Text>
          
          <SettingRow
            title="Clear All Data"
            subtitle="Remove all saved contact information"
            type="button"
            onPress={handleClearData}
          />
        </View>

        {/* About Section */}
        <View style={{ marginBottom: 40 }}>
          <Text style={{
            fontSize: 20,
            fontWeight: '600',
            color: theme.text,
            marginBottom: 16,
          }}>
            About
          </Text>
          
          <View style={{
            backgroundColor: theme.card,
            borderRadius: 12,
            padding: 16,
          }}>
            <Text style={{
              fontSize: 17,
              fontWeight: '600',
              color: theme.text,
              marginBottom: 8,
            }}>
              ContactBeam
            </Text>
            <Text style={{
              fontSize: 15,
              color: theme.textSecondary,
              marginBottom: 4,
            }}>
              Version 1.0.0
            </Text>
            <Text style={{
              fontSize: 15,
              color: theme.textSecondary,
              lineHeight: 20,
            }}>
              Share your contact information instantly using NFC technology. 
              Simply touch phones together to exchange phone numbers and profile pictures.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
