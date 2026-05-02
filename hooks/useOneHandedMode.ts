import { useState, useCallback, useEffect } from 'react';
import { Dimensions, Platform } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface OneHandedConfig {
  enabled: boolean;
  preferredHand: 'left' | 'right' | 'auto';
  touchZoneHeight: number; // Percentage of screen height (0-100)
  largeText: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
}

class OneHandedManager {
  private static instance: OneHandedManager;
  private config: OneHandedConfig;
  private listeners: Set<() => void> = new Set();
  private dimensions: { width: number; height: number };

  private constructor() {
    this.config = {
      enabled: true,
      preferredHand: 'auto',
      touchZoneHeight: 66, // Lower 2/3 of screen
      largeText: false,
      highContrast: false,
      reducedMotion: false,
    };
    
    this.dimensions = { width: screenWidth, height: screenHeight };
    this.loadSavedConfig();
    this.setupDimensionListener();
  }

  static getInstance(): OneHandedManager {
    if (!OneHandedManager.instance) {
      OneHandedManager.instance = new OneHandedManager();
    }
    return OneHandedManager.instance;
  }

  private loadSavedConfig(): void {
    try {
      // In a real app, load from AsyncStorage or MMKV
      const saved = localStorage.getItem('clinical-os-onehanded-config');
      if (saved) {
        this.config = { ...this.config, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.log('Failed to load one-handed config:', error);
    }
  }

  private saveConfig(): void {
    try {
      // In a real app, save to AsyncStorage or MMKV
      localStorage.setItem('clinical-os-onehanded-config', JSON.stringify(this.config));
    } catch (error) {
      console.log('Failed to save one-handed config:', error);
    }
  }

  private setupDimensionListener(): void {
    Dimensions.addEventListener('change', ({ window }) => {
      this.dimensions = { width: window.width, height: window.height };
      this.notifyListeners();
    });
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }

  getConfig(): OneHandedConfig {
    return { ...this.config };
  }

  updateConfig(updates: Partial<OneHandedConfig>): void {
    this.config = { ...this.config, ...updates };
    this.saveConfig();
    this.notifyListeners();
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Calculate optimal touch zones for one-handed use
  getTouchZones(): {
    safeArea: { top: number; bottom: number; left: number; right: number };
    primaryZone: { x: number; y: number; width: number; height: number };
    secondaryZone: { x: number; y: number; width: number; height: number };
  } {
    const { preferredHand, touchZoneHeight } = this.config;
    const { width, height } = this.dimensions;
    
    // Safe area for critical controls
    const safeArea = {
      top: height * 0.1,        // Top 10%
      bottom: height * 0.1,     // Bottom 10%
      left: width * 0.05,        // Left 5%
      right: width * 0.05,       // Right 5%
    };

    // Primary touch zone (lower portion)
    const primaryZoneHeight = height * (touchZoneHeight / 100);
    const primaryZoneY = height - primaryZoneHeight;
    
    let primaryZoneX, primaryZoneWidth;
    
    if (preferredHand === 'left') {
      // Left-handed: use left side
      primaryZoneX = 0;
      primaryZoneWidth = width * 0.6;
    } else if (preferredHand === 'right') {
      // Right-handed: use right side
      primaryZoneX = width * 0.4;
      primaryZoneWidth = width * 0.6;
    } else {
      // Auto: use center area
      primaryZoneX = width * 0.2;
      primaryZoneWidth = width * 0.6;
    }

    const primaryZone = {
      x: primaryZoneX,
      y: primaryZoneY,
      width: primaryZoneWidth,
      height: primaryZoneHeight,
    };

    // Secondary zone (upper portion for less frequent actions)
    const secondaryZone = {
      x: width * 0.25,
      y: height * 0.1,
      width: width * 0.5,
      height: height * 0.3,
    };

    return { safeArea, primaryZone, secondaryZone };
  }

  // Check if a point is in the optimal touch zone
  isInOptimalZone(x: number, y: number): boolean {
    const { primaryZone } = this.getTouchZones();
    
    return (
      x >= primaryZone.x &&
      x <= primaryZone.x + primaryZone.width &&
      y >= primaryZone.y &&
      y <= primaryZone.y + primaryZone.height
    );
  }

  // Get optimal position for a component
  getOptimalPosition(preferredPosition?: 'top' | 'bottom' | 'left' | 'right' | 'center'): {
    x: number;
    y: number;
    align: 'flex-start' | 'flex-end' | 'center';
  } {
    const { primaryZone, secondaryZone } = this.getTouchZones();
    const { width, height } = this.dimensions;

    switch (preferredPosition) {
      case 'top':
        return {
          x: width / 2,
          y: secondaryZone.y + 50,
          align: 'center',
        };
      case 'bottom':
        return {
          x: this.config.preferredHand === 'left' ? width * 0.3 : width * 0.7,
          y: primaryZone.y + primaryZone.height / 2,
          align: this.config.preferredHand === 'left' ? 'flex-start' : 'flex-end',
        };
      case 'left':
        return {
          x: width * 0.15,
          y: height / 2,
          align: 'flex-start',
        };
      case 'right':
        return {
          x: width * 0.85,
          y: height / 2,
          align: 'flex-end',
        };
      case 'center':
      default:
        return {
          x: width / 2,
          y: height / 2,
          align: 'center',
        };
    }
  }

  // Get accessibility settings
  getAccessibilitySettings(): {
    fontSize: number;
    fontWeight: string;
    colorContrast: 'normal' | 'high';
    animationDuration: number;
  } {
    const baseFontSize = 16;
    const fontSize = this.config.largeText ? baseFontSize * 1.5 : baseFontSize;
    const fontWeight = this.config.highContrast ? '700' : '400';
    const colorContrast = this.config.highContrast ? 'high' : 'normal';
    const animationDuration = this.config.reducedMotion ? 0 : 300;

    return {
      fontSize,
      fontWeight,
      colorContrast,
      animationDuration,
    };
  }

  // Detect user's preferred hand based on touch patterns
  detectPreferredHand(touchPoints: { x: number; y: number }[]): 'left' | 'right' | 'unknown' {
    if (touchPoints.length < 5) return 'unknown';

    const leftSideTouches = touchPoints.filter(point => point.x < screenWidth / 2).length;
    const rightSideTouches = touchPoints.filter(point => point.x >= screenWidth / 2).length;

    const leftPercentage = leftSideTouches / touchPoints.length;
    const rightPercentage = rightSideTouches / touchPoints.length;

    if (leftPercentage > 0.7) return 'left';
    if (rightPercentage > 0.7) return 'right';
    
    return 'unknown';
  }

  // Auto-detect and set preferred hand
  autoDetectHand(touchPoints: { x: number; y: number }[]): void {
    if (this.config.preferredHand === 'auto') {
      const detected = this.detectPreferredHand(touchPoints);
      if (detected !== 'unknown') {
        this.updateConfig({ preferredHand: detected });
      }
    }
  }

  // Get gesture suggestions for one-handed use
  getGestureSuggestions(): {
    swipeGestures: string[];
    tapGestures: string[];
    longPressGestures: string[];
  } {
    const { preferredHand } = this.config;

    const swipeGestures = [
      preferredHand === 'left' ? 'Swipe right to go back' : 'Swipe left to go back',
      'Swipe up for quick actions',
      'Swipe down for options menu',
    ];

    const tapGestures = [
      'Double-tap to favorite',
      'Long-press for details',
      'Tap and hold for context menu',
    ];

    const longPressGestures = [
      'Long-press ER button to activate',
      'Long-press drug to see alternatives',
      'Long-press protocol step to mark complete',
    ];

    return { swipeGestures, tapGestures, longPressGestures };
  }

  // Get layout adjustments for one-handed mode
  getLayoutAdjustments(): {
    buttonSize: number;
    iconSize: number;
    spacing: number;
    padding: number;
  } {
    const baseSize = this.config.largeText ? 48 : 44;
    const multiplier = this.config.largeText ? 1.2 : 1;

    return {
      buttonSize: baseSize * multiplier,
      iconSize: 24 * multiplier,
      spacing: 16 * multiplier,
      padding: 12 * multiplier,
    };
  }
}

// Export singleton instance
export const oneHanded = OneHandedManager.getInstance();

// Export hook for React components
export const useOneHandedMode = () => {
  const [config, setConfig] = useState(oneHanded.getConfig());

  useEffect(() => {
    const unsubscribe = oneHanded.subscribe(() => {
      setConfig(oneHanded.getConfig());
    });

    return unsubscribe;
  }, []);

  const updateConfig = useCallback((updates: Partial<OneHandedConfig>) => {
    oneHanded.updateConfig(updates);
  }, []);

  const getTouchZones = useCallback(() => {
    return oneHanded.getTouchZones();
  }, []);

  const isInOptimalZone = useCallback((x: number, y: number) => {
    return oneHanded.isInOptimalZone(x, y);
  }, []);

  const getOptimalPosition = useCallback((preferredPosition?: 'top' | 'bottom' | 'left' | 'right' | 'center') => {
    return oneHanded.getOptimalPosition(preferredPosition);
  }, []);

  const getAccessibilitySettings = useCallback(() => {
    return oneHanded.getAccessibilitySettings();
  }, []);

  const autoDetectHand = useCallback((touchPoints: { x: number; y: number }[]) => {
    oneHanded.autoDetectHand(touchPoints);
  }, []);

  const getGestureSuggestions = useCallback(() => {
    return oneHanded.getGestureSuggestions();
  }, []);

  const getLayoutAdjustments = useCallback(() => {
    return oneHanded.getLayoutAdjustments();
  }, []);

  return {
    config,
    updateConfig,
    getTouchZones,
    isInOptimalZone,
    getOptimalPosition,
    getAccessibilitySettings,
    autoDetectHand,
    getGestureSuggestions,
    getLayoutAdjustments,
  };
};

export default oneHanded;
