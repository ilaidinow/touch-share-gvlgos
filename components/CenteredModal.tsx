
import React, { useEffect, useRef } from 'react';
import {
  View,
  Modal,
  Animated,
  TouchableWithoutFeedback,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface CenteredModalProps {
  children?: React.ReactNode;
  isVisible?: boolean;
  onClose?: () => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function CenteredModal({
  children,
  isVisible = false,
  onClose,
}: CenteredModalProps) {
  const { theme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible, fadeAnim, scaleAnim]);

  const handleBackdropPress = () => {
    if (onClose) {
      onClose();
    }
  };

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    modalContainer: {
      backgroundColor: theme.card,
      borderRadius: 20,
      maxWidth: screenWidth * 0.9,
      maxHeight: screenHeight * 0.8,
      width: '100%',
      boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.3)',
      elevation: 10,
    },
  });

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.modalContainer,
                {
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              {children}
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
