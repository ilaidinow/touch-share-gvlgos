
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import SimpleBottomSheet from './BottomSheet';

interface FileShareSheetProps {
  isVisible: boolean;
  onClose: () => void;
  files: any[];
  onSelectFiles: () => void;
}

export default function FileShareSheet({ 
  isVisible, 
  onClose, 
  files, 
  onSelectFiles 
}: FileShareSheetProps) {
  const getFileIcon = (mimeType?: string) => {
    if (!mimeType) return 'document-outline';
    
    if (mimeType.startsWith('image/')) return 'image-outline';
    if (mimeType.startsWith('video/')) return 'videocam-outline';
    if (mimeType.startsWith('audio/')) return 'musical-notes-outline';
    if (mimeType.includes('pdf')) return 'document-text-outline';
    
    return 'document-outline';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <SimpleBottomSheet isVisible={isVisible} onClose={onClose}>
      <View style={{ padding: 20 }}>
        <View style={[commonStyles.row, { marginBottom: 24 }]}>
          <Text style={commonStyles.subtitle}>Selected Files</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={28} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {files.length === 0 ? (
          <View style={[commonStyles.center, { paddingVertical: 40 }]}>
            <Ionicons name="folder-open-outline" size={48} color={colors.textSecondary} />
            <Text style={[commonStyles.text, { marginTop: 16 }]}>
              No files selected
            </Text>
            <Text style={[commonStyles.textSecondary, { marginTop: 8, marginBottom: 24 }]}>
              Choose files to share with nearby devices
            </Text>
            <TouchableOpacity
              style={[buttonStyles.primary, { width: '100%' }]}
              onPress={onSelectFiles}
            >
              <Text style={buttonStyles.text}>Select Files</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <ScrollView style={{ maxHeight: 300 }} showsVerticalScrollIndicator={false}>
              {files.map((file, index) => (
                <View key={index} style={[commonStyles.card, { marginBottom: 12 }]}>
                  <View style={commonStyles.row}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                      <View style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        backgroundColor: colors.backgroundAlt,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 16,
                      }}>
                        <Ionicons 
                          name={getFileIcon(file.mimeType)} 
                          size={24} 
                          color={colors.text} 
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[commonStyles.text, { textAlign: 'left', marginBottom: 4 }]} numberOfLines={1}>
                          {file.name}
                        </Text>
                        <Text style={[commonStyles.textSecondary, { textAlign: 'left' }]}>
                          {formatFileSize(file.size)}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>

            <View style={{ marginTop: 20, gap: 12 }}>
              <TouchableOpacity
                style={[buttonStyles.secondary, { width: '100%' }]}
                onPress={onSelectFiles}
              >
                <Text style={buttonStyles.textSecondary}>Add More Files</Text>
              </TouchableOpacity>
              
              <View style={{ 
                padding: 16, 
                backgroundColor: colors.backgroundAlt, 
                borderRadius: 12,
                alignItems: 'center',
              }}>
                <Text style={[commonStyles.textSecondary, { marginBottom: 4 }]}>
                  Total: {files.length} file{files.length !== 1 ? 's' : ''}
                </Text>
                <Text style={commonStyles.text}>
                  {formatFileSize(files.reduce((total, file) => total + (file.size || 0), 0))}
                </Text>
              </View>
            </View>
          </>
        )}
      </View>
    </SimpleBottomSheet>
  );
}
