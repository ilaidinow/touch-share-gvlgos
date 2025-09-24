
import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { createStyles } from '../styles/commonStyles';

interface NameCardProps {
  firstName: string;
  lastName: string;
  onUpdate: () => void;
  isEnabled: boolean;
}

export default function NameCard({ firstName, lastName, onUpdate, isEnabled }: NameCardProps) {
  const { theme } = useTheme();
  const { commonStyles } = createStyles(theme);

  const displayName = firstName || lastName 
    ? `${firstName} ${lastName}`.trim()
    : 'Not set';

  return (
    <View style={[commonStyles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: theme.primary + '20',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Ionicons name="person" size={20} color={theme.primary} />
          </View>
          <Text style={{
            fontSize: 17,
            fontWeight: '600',
            color: theme.text,
          }}>
            Name
          </Text>
        </View>
        
        <TouchableOpacity
          onPress={onUpdate}
          style={{
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 8,
            backgroundColor: theme.backgroundAlt,
          }}
        >
          <Text style={{
            fontSize: 14,
            fontWeight: '500',
            color: theme.text,
          }}>
            Edit
          </Text>
        </TouchableOpacity>
      </View>
      
      <Text style={{
        fontSize: 19,
        fontWeight: '500',
        color: theme.text,
        marginBottom: 8,
      }}>
        {displayName}
      </Text>
      
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <View style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: isEnabled ? theme.success : theme.grey,
        }} />
        <Text style={{
          fontSize: 15,
          color: theme.textSecondary,
        }}>
          {isEnabled ? 'Will be shared' : 'Not sharing'}
        </Text>
      </View>
    </View>
  );
}
