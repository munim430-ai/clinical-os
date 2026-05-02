import React, { useState, useEffect, useRef } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');
import { BlurView } from 'expo-blur';
import { Sparkles, MessageCircle, X } from 'lucide-react';
import { MotiView } from 'moti';
import { FrostedGlass } from '@/components/ui/glassmorphism';
import { triggerSelectionHaptic, triggerSuccessHaptic } from '@/lib/clinical-haptics';

interface AIAssistantButtonProps {
  onPress?: () => void;
  onChatToggle?: (isOpen: boolean) => void;
  visible?: boolean;
}

export function AIAssistantButton({ 
  onPress, 
  onChatToggle, 
  visible = true 
}: AIAssistantButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPulsing, setIsPulsing] = useState(true);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;
  const slideAnim = useRef(new Animated.Value(100)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Breathing animation
  useEffect(() => {
    if (isPulsing && !isExpanded) {
      const pulseLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      );
      pulseLoop.start();

      // Glow animation
      const glowLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 0.8,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.3,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      );
      glowLoop.start();

      return () => {
        pulseLoop.stop();
        glowLoop.stop();
      };
    } else {
      // Stop animations when expanded
      pulseAnim.setValue(1);
      glowAnim.setValue(0.3);
    }
  }, [isPulsing, isExpanded]);

  const handlePress = () => {
    triggerSelectionHaptic();
    
    if (isExpanded) {
      // Collapse
      setIsExpanded(false);
      setIsPulsing(true);
      onChatToggle?.(false);
      
      // Animate out
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 100,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Expand
      setIsExpanded(true);
      setIsPulsing(false);
      onChatToggle?.(true);
      onPress?.();
      
      // Animate in
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const handleQuickAction = (action: string) => {
    triggerSuccessHaptic();
    console.log('Quick action:', action);
    // Handle quick actions here
  };

  if (!visible) return null;

  return (
    <>
      {/* Main Floating Button */}
      <MotiView
        animate={{
          scale: isExpanded ? 0.9 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
        }}
        style={[styles.container, { bottom: 100 }]} // Positioned for one-handed reach
      >
        <TouchableOpacity
          style={styles.mainButton}
          onPress={handlePress}
          activeOpacity={0.8}
        >
          {/* Glow Effect */}
          <Animated.View
            style={[
              styles.glow,
              {
                opacity: glowAnim,
                transform: [{ scale: pulseAnim }],
              },
            ]}
          />
          
          {/* Button Content */}
          <BlurView
            intensity={100}
            tint="dark"
            style={styles.buttonBlur}
          >
            <View style={styles.buttonContent}>
              <MotiView
                animate={{
                  rotate: isExpanded ? '180deg' : '0deg',
                }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 30,
                }}
              >
                {isExpanded ? (
                  <X size={24} color="#FFFFFF" />
                ) : (
                  <Sparkles size={24} color="#B8FFD2" />
                )}
              </MotiView>
            </View>
          </BlurView>
        </TouchableOpacity>
      </MotiView>

      {/* Expanded Actions */}
      {isExpanded && (
        <Animated.View
          style={[
            styles.expandedContainer,
            {
              transform: [{ translateY: slideAnim }],
              opacity: fadeAnim,
            },
          ]}
        >
          <FrostedGlass style={styles.actionsContainer}>
            <Text style={styles.actionsTitle}>Clinical AI Assistant</Text>
            
            {/* Quick Actions */}
            <View style={styles.quickActions}>
              <TouchableOpacity
                style={styles.quickAction}
                onPress={() => handleQuickAction('diagnosis')}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: '#00D7B5' + '20' }]}>
                  <MessageCircle size={20} color="#00D7B5" />
                </View>
                <Text style={styles.quickActionText}>Diagnosis Help</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickAction}
                onPress={() => handleQuickAction('drug')}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: '#B8FFD2' + '20' }]}>
                  <Sparkles size={20} color="#B8FFD2" />
                </View>
                <Text style={styles.quickActionText}>Drug Interactions</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickAction}
                onPress={() => handleQuickAction('protocol')}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: '#64D2FF' + '20' }]}>
                  <MessageCircle size={20} color="#64D2FF" />
                </View>
                <Text style={styles.quickActionText}>Protocol Guide</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickAction}
                onPress={() => handleQuickAction('emergency')}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: '#FF453A' + '20' }]}>
                  <Sparkles size={20} color="#FF453A" />
                </View>
                <Text style={styles.quickActionText}>Emergency Support</Text>
              </TouchableOpacity>
            </View>

            {/* Input Hint */}
            <View style={styles.inputHint}>
              <Text style={styles.inputHintText}>Ask me anything about clinical practice...</Text>
            </View>
          </FrostedGlass>
        </Animated.View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 20,
    zIndex: 1000,
  },
  mainButton: {
    width: 64,
    height: 64,
    position: 'relative',
  },
  glow: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: 42,
    backgroundColor: '#B8FFD2',
    opacity: 0.3,
  },
  buttonBlur: {
    flex: 1,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(184, 255, 210, 0.3)',
    overflow: 'hidden',
  },
  buttonContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(184, 255, 210, 0.1)',
  },
  expandedContainer: {
    position: 'absolute',
    right: 20,
    bottom: 180,
    width: screenWidth - 40,
    maxWidth: 400,
  },
  actionsContainer: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionsTitle: {
    fontSize: 18,
    fontFamily: 'Geist-Bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  quickActions: {
    gap: 12,
  },
  quickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  quickActionText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#FFFFFF',
  },
  inputHint: {
    marginTop: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  inputHintText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#7A7A80',
    textAlign: 'center',
  },
});
