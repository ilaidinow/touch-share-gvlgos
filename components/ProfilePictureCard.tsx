
import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { commonStyles, colors } from '../styles/commonStyles';

interface ProfilePictureCardProps {
  profilePicture: string | null;
  onUpdate: () => void;
  isEnabled: boolean;
}

export default function ProfilePictureCard({ 
  profilePicture, 
  onUpdate, 
  isEnabled 
}: ProfilePictureCardProps) {
  return (
    <View style={[commonStyles.section, { marginBottom: 16 }]}>
      <View style={[
        commonStyles.card,
        { opacity: isEnabled ? 1 : 0.5 }
      ]}>
        <View style={commonStyles.row}>
          <View style={{ flex: 1 }}>
            <Text style={[commonStyles.textSecondary, { textAlign: 'left', marginBottom: 4 }]}>
              Profile Picture
            </Text>
            <Text style={[commonStyles.text, { textAlign: 'left' }]}>
              {profilePicture ? 'Picture set' : 'No picture set'}
            </Text>
          </View>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            {/* Profile picture preview */}
            <View style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: colors.backgroundAlt,
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}>
              {profilePicture ? (
                <Image 
                  source={{ uri: profilePicture }} 
                  style={{ width: 48, height: 48, borderRadius: 24 }}
                  resizeMode="cover"
                />
              ) : (
                <Ionicons name="person" size={24} color={colors.textSecondary} />
              )}
            </View>
            
            {/* Update button */}
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
              <Ionicons name="camera" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
