
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { commonStyles, colors } from '../styles/commonStyles';

interface PhoneNumberCardProps {
  phoneNumber: string;
  onUpdate: () => void;
  isEnabled: boolean;
}

export default function PhoneNumberCard({ 
  phoneNumber, 
  onUpdate, 
  isEnabled 
}: PhoneNumberCardProps) {
  return (
    <View style={[commonStyles.section, { marginBottom: 32 }]}>
      <View style={[
        commonStyles.card,
        { opacity: isEnabled ? 1 : 0.5 }
      ]}>
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
            onPress={onUpdate}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: colors.backgroundAlt,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="create" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
