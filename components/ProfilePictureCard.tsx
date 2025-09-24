
import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { createStyles } from '../styles/commonStyles';

interface ProfilePictureCardProps {
  profilePicture: string | null;
  onUpdate: () => void;
  isEnabled: boolean;
}

export default function ProfilePictureCard({ profilePicture, onUpdate, isEnabled }: ProfilePictureCardProps) {
  const { theme } = useTheme();
  const { commonStyles } = createStyles(theme);

  return (
    <View style={[commonStyles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
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
            Profile Picture
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
            {profilePicture ? 'Change' : 'Add'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={{ alignItems: 'center', marginBottom: 16 }}>
        {profilePicture ? (
          <Image
            source={{ uri: profilePicture }}
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
            }}
          />
        ) : (
          <View style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: theme.backgroundAlt,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 2,
            borderColor: theme.border,
            borderStyle: 'dashed',
          }}>
            <Ionicons name="camera" size={32} color={theme.textSecondary} />
          </View>
        )}
      </View>
      
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
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
