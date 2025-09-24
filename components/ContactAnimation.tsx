
import { View, Animated, Dimensions } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

interface ContactAnimationProps {
  onComplete: () => void;
}

const { width, height } = Dimensions.get('window');

export default function ContactAnimation({ onComplete }: ContactAnimationProps) {
  const { theme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Start the animation sequence
    Animated.sequence([
      // Fade in and scale up
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      // Pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
        { iterations: 2 }
      ),
      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onComplete();
    });
  }, [fadeAnim, scaleAnim, pulseAnim, onComplete]);

  return (
    <View style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme.background + 'E6',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [
            { scale: scaleAnim },
            { scale: pulseAnim },
          ],
          alignItems: 'center',
        }}
      >
        {/* Success Circle */}
        <View style={{
          width: 120,
          height: 120,
          borderRadius: 60,
          backgroundColor: theme.success,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 24,
        }}>
          <Ionicons name="checkmark" size={60} color={theme.background} />
        </View>
        
        {/* Success Text */}
        <Animated.Text style={{
          fontSize: 24,
          fontWeight: '600',
          color: theme.text,
          textAlign: 'center',
          marginBottom: 8,
        }}>
          Contact Shared!
        </Animated.Text>
        
        <Animated.Text style={{
          fontSize: 17,
          color: theme.textSecondary,
          textAlign: 'center',
        }}>
          Information exchanged successfully
        </Animated.Text>
      </Animated.View>
    </View>
  );
}
