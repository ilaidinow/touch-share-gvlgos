
import React, { useEffect, useRef } from 'react';
import { View, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/commonStyles';

interface ContactAnimationProps {
  onComplete: () => void;
}

const { width, height } = Dimensions.get('window');

export default function ContactAnimation({ onComplete }: ContactAnimationProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const sparkleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start the animation sequence
    Animated.sequence([
      // Fade in and scale up
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
      
      // Pulse effect
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
        { iterations: 2 }
      ),
      
      // Sparkle effect
      Animated.timing(sparkleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      
      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onComplete();
    });
  }, []);

  return (
    <View style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
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
        {/* Main contact icon */}
        <View style={{
          width: 120,
          height: 120,
          borderRadius: 60,
          backgroundColor: colors.success,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 20,
        }}>
          <Ionicons name="checkmark" size={60} color={colors.background} />
        </View>

        {/* Success text */}
        <Animated.Text
          style={{
            fontSize: 24,
            fontWeight: '600',
            color: colors.background,
            textAlign: 'center',
            opacity: fadeAnim,
          }}
        >
          Contact Shared!
        </Animated.Text>

        {/* Sparkle effects */}
        <Animated.View
          style={{
            position: 'absolute',
            opacity: sparkleAnim,
            transform: [
              {
                rotate: sparkleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
          }}
        >
          {[...Array(8)].map((_, index) => {
            const angle = (index * 45) * (Math.PI / 180);
            const radius = 80;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            return (
              <View
                key={index}
                style={{
                  position: 'absolute',
                  left: x,
                  top: y,
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: colors.accent,
                }}
              />
            );
          })}
        </Animated.View>

        {/* Ripple effect */}
        <Animated.View
          style={{
            position: 'absolute',
            width: 200,
            height: 200,
            borderRadius: 100,
            borderWidth: 2,
            borderColor: colors.success + '40',
            opacity: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.6],
            }),
            transform: [
              {
                scale: pulseAnim.interpolate({
                  inputRange: [1, 1.2],
                  outputRange: [1, 1.5],
                }),
              },
            ],
          }}
        />
      </Animated.View>
    </View>
  );
}
