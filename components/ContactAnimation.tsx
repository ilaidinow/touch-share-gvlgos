
import { View, Animated, Dimensions } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

interface ContactAnimationProps {
  onComplete: () => void;
}

const { width, height } = Dimensions.get('window');

export default function ContactAnimation({ onComplete }: ContactAnimationProps) {
  const { theme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const ringAnim1 = useRef(new Animated.Value(0)).current;
  const ringAnim2 = useRef(new Animated.Value(0)).current;
  const ringAnim3 = useRef(new Animated.Value(0)).current;
  const checkmarkAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    playSuccessSound();
    triggerHaptics();
    startAnimation();
  }, []);

  const playSuccessSound = async () => {
    try {
      // Create a simple success sound using Audio API
      const { sound } = await Audio.Sound.createAsync(
        { uri: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eeyw=' },
        { shouldPlay: true }
      );
      
      // Unload the sound after playing
      setTimeout(async () => {
        await sound.unloadAsync();
      }, 1000);
    } catch (error) {
      console.log('Error playing sound:', error);
    }
  };

  const triggerHaptics = async () => {
    try {
      // Apple Pay-like haptic feedback
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      setTimeout(async () => {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }, 300);
    } catch (error) {
      console.log('Error with haptics:', error);
    }
  };

  const startAnimation = () => {
    // Start the Apple Pay-like animation sequence
    Animated.sequence([
      // Initial fade in and scale up
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
      ]),
      
      // Expanding rings animation (Apple Pay style)
      Animated.parallel([
        Animated.sequence([
          Animated.timing(ringAnim1, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.delay(200),
          Animated.timing(ringAnim2, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.delay(400),
          Animated.timing(ringAnim3, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
        // Checkmark animation
        Animated.sequence([
          Animated.delay(300),
          Animated.spring(checkmarkAnim, {
            toValue: 1,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }),
        ]),
      ]),
      
      // Hold for a moment
      Animated.delay(800),
      
      // Fade out
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      onComplete();
    });
  };

  return (
    <View style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme.background + 'F0',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
          alignItems: 'center',
        }}
      >
        {/* Expanding rings (Apple Pay style) */}
        <View style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center' }}>
          {/* Ring 1 */}
          <Animated.View
            style={{
              position: 'absolute',
              width: 200,
              height: 200,
              borderRadius: 100,
              borderWidth: 2,
              borderColor: theme.success + '40',
              opacity: ringAnim1.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0, 0.8, 0],
              }),
              transform: [{
                scale: ringAnim1.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 1.5],
                }),
              }],
            }}
          />
          
          {/* Ring 2 */}
          <Animated.View
            style={{
              position: 'absolute',
              width: 160,
              height: 160,
              borderRadius: 80,
              borderWidth: 2,
              borderColor: theme.success + '60',
              opacity: ringAnim2.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0, 0.9, 0],
              }),
              transform: [{
                scale: ringAnim2.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 1.3],
                }),
              }],
            }}
          />
          
          {/* Ring 3 */}
          <Animated.View
            style={{
              position: 'absolute',
              width: 120,
              height: 120,
              borderRadius: 60,
              borderWidth: 3,
              borderColor: theme.success + '80',
              opacity: ringAnim3.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0, 1, 0],
              }),
              transform: [{
                scale: ringAnim3.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 1.1],
                }),
              }],
            }}
          />
        </View>

        {/* Success Circle with Checkmark */}
        <View style={{
          width: 100,
          height: 100,
          borderRadius: 50,
          backgroundColor: theme.success,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 32,
          shadowColor: theme.success,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}>
          <Animated.View
            style={{
              opacity: checkmarkAnim,
              transform: [{ scale: checkmarkAnim }],
            }}
          >
            <Ionicons name="checkmark" size={50} color={theme.background} />
          </Animated.View>
        </View>
        
        {/* Success Text */}
        <Animated.Text style={{
          fontSize: 28,
          fontWeight: '700',
          color: theme.text,
          textAlign: 'center',
          marginBottom: 12,
          opacity: checkmarkAnim,
        }}>
          Contact Shared!
        </Animated.Text>
        
        <Animated.Text style={{
          fontSize: 18,
          fontWeight: '500',
          color: theme.textSecondary,
          textAlign: 'center',
          opacity: checkmarkAnim,
        }}>
          Information exchanged successfully
        </Animated.Text>
      </Animated.View>
    </View>
  );
}
