
import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { commonStyles, colors } from '../styles/commonStyles';
import * as Sharing from 'expo-sharing';

interface PhoneNumberCardProps {
  phoneNumber: string;
}

export default function PhoneNumberCard({ phoneNumber }: PhoneNumberCardProps) {
  const handleSharePhoneNumber = async () => {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync('', {
          mimeType: 'text/plain',
          dialogTitle: 'Share Phone Number',
        });
      } else {
        Alert.alert('Phone Number', phoneNumber);
      }
    } catch (error) {
      console.log('Error sharing phone number:', error);
      Alert.alert('Phone Number', phoneNumber);
    }
  };

  return (
    <View style={[commonStyles.section, { marginBottom: 32 }]}>
      <View style={commonStyles.card}>
        <View style={commonStyles.row}>
          <View style={{ flex: 1 }}>
            <Text style={[commonStyles.textSecondary, { textAlign: 'left', marginBottom: 4 }]}>
              Your Phone Number
            </Text>
            <Text style={[commonStyles.text, { textAlign: 'left', fontSize: 20, fontWeight: '600' }]}>
              {phoneNumber}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleSharePhoneNumber}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: colors.backgroundAlt,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="share-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
