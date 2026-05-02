import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

export type HapticType = 
  | 'light'           // For taps, small interactions
  | 'medium'          // For selections, confirmations
  | 'heavy'           // For critical actions, errors
  | 'success'         // For successful operations
  | 'warning'         // For warnings, cautions
  | 'error'           // For errors, failures
  | 'selection'       // For list item selection
  | 'impact'          // For impactful interactions
  | 'notification'    // For notifications
  | 'rhythmic'        // For rhythmic patterns
  | 'custom';         // For custom patterns

interface HapticPattern {
  type: HapticType;
  intensity?: 'light' | 'medium' | 'heavy';
  sharpness?: 'light' | 'medium' | 'heavy';
  duration?: number;
  delay?: number;
}

class HapticManager {
  private static instance: HapticManager;
  private isHapticsEnabled: boolean = true;

  private constructor() {
    this.checkHapticsAvailability();
  }

  static getInstance(): HapticManager {
    if (!HapticManager.instance) {
      HapticManager.instance = new HapticManager();
    }
    return HapticManager.instance;
  }

  private async checkHapticsAvailability(): Promise<void> {
    try {
      if (Platform.OS === 'ios') {
        // Test haptic availability on iOS
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      this.isHapticsEnabled = true;
    } catch (error) {
      console.log('Haptics not available:', error);
      this.isHapticsEnabled = false;
    }
  }

  setEnabled(enabled: boolean): void {
    this.isHapticsEnabled = enabled;
  }

  isEnabled(): boolean {
    return this.isHapticsEnabled;
  }

  async trigger(type: HapticType, options?: {
    intensity?: 'light' | 'medium' | 'heavy';
    sharpness?: 'light' | 'medium' | 'heavy';
    duration?: number;
  }): Promise<void> {
    if (!this.isHapticsEnabled) return;

    try {
      switch (type) {
        case 'light':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;

        case 'medium':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;

        case 'heavy':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;

        case 'success':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;

        case 'warning':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          break;

        case 'error':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          break;

        case 'selection':
          await Haptics.selectionAsync();
          break;

        case 'impact':
          const impactStyle = this.getImpactStyle(options?.intensity || 'medium');
          await Haptics.impactAsync(impactStyle);
          break;

        case 'notification':
          const notificationType = this.getNotificationType(options?.intensity || 'medium');
          await Haptics.notificationAsync(notificationType);
          break;

        case 'rhythmic':
          await this.triggerRhythmicPattern(options?.duration || 1000);
          break;

        case 'custom':
          await this.triggerCustomPattern(options);
          break;

        default:
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    } catch (error) {
      console.log('Haptic trigger failed:', error);
    }
  }

  private getImpactStyle(intensity: 'light' | 'medium' | 'heavy'): Haptics.ImpactFeedbackStyle {
    switch (intensity) {
      case 'light':
        return Haptics.ImpactFeedbackStyle.Light;
      case 'medium':
        return Haptics.ImpactFeedbackStyle.Medium;
      case 'heavy':
        return Haptics.ImpactFeedbackStyle.Heavy;
      default:
        return Haptics.ImpactFeedbackStyle.Medium;
    }
  }

  private getNotificationType(intensity: 'light' | 'medium' | 'heavy'): Haptics.NotificationFeedbackType {
    switch (intensity) {
      case 'light':
        return Haptics.NotificationFeedbackType.Success;
      case 'medium':
        return Haptics.NotificationFeedbackType.Warning;
      case 'heavy':
        return Haptics.NotificationFeedbackType.Error;
      default:
        return Haptics.NotificationFeedbackType.Success;
    }
  }

  private async triggerRhythmicPattern(duration: number): Promise<void> {
    const patternCount = Math.floor(duration / 200);
    
    for (let i = 0; i < patternCount; i++) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }

  private async triggerCustomPattern(options?: {
    intensity?: 'light' | 'medium' | 'heavy';
    sharpness?: 'light' | 'medium' | 'heavy';
    duration?: number;
  }): Promise<void> {
    const intensity = options?.intensity || 'medium';
    const duration = options?.duration || 500;
    
    if (Platform.OS === 'ios') {
      // Use Haptics Engine API for iOS 13+ custom patterns
      try {
        // Create a custom haptic pattern
        const impactStyle = this.getImpactStyle(intensity);
        await Haptics.impactAsync(impactStyle);
        
        if (duration > 300) {
          await new Promise(resolve => setTimeout(resolve, 200));
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      } catch (error) {
        // Fallback to standard haptics
        await Haptics.impactAsync(this.getImpactStyle(intensity));
      }
    } else {
      // Android - use standard haptics
      await Haptics.impactAsync(this.getImpactStyle(intensity));
    }
  }

  // Predefined haptic patterns for Clinical OS
  async tap(): Promise<void> {
    await this.trigger('light');
  }

  async select(): Promise<void> {
    await this.trigger('selection');
  }

  async confirm(): Promise<void> {
    await this.trigger('medium');
  }

  async critical(): Promise<void> {
    await this.trigger('heavy');
  }

  async success(): Promise<void> {
    await this.trigger('success');
  }

  async warning(): Promise<void> {
    await this.trigger('warning');
  }

  async error(): Promise<void> {
    await this.trigger('error');
  }

  async drugSearch(): Promise<void> {
    await this.trigger('light');
    setTimeout(() => this.trigger('light'), 50);
  }

  async protocolStep(): Promise<void> {
    await this.trigger('selection');
  }

  async erActivation(): Promise<void> {
    await this.trigger('heavy');
    setTimeout(() => this.trigger('heavy'), 100);
    setTimeout(() => this.trigger('heavy'), 200);
  }

  async calculationComplete(): Promise<void> {
    await this.trigger('success');
  }

  async navigation(): Promise<void> {
    await this.trigger('light');
  }

  async scanComplete(): Promise<void> {
    await this.trigger('rhythmic', { duration: 800 });
  }

  async emergency(): Promise<void> {
    await this.trigger('custom', { 
      intensity: 'heavy', 
      duration: 1000 
    });
  }

  async subtle(): Promise<void> {
    // Very light haptic for subtle feedback
    if (Platform.OS === 'ios') {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (error) {
        // Silent fail for very subtle haptics
      }
    }
  }
}

// Export singleton instance
export const haptics = HapticManager.getInstance();

// Export hook for React components
export const useHapticFeedback = () => {
  return {
    tap: () => haptics.tap(),
    select: () => haptics.select(),
    confirm: () => haptics.confirm(),
    critical: () => haptics.critical(),
    success: () => haptics.success(),
    warning: () => haptics.warning(),
    error: () => haptics.error(),
    drugSearch: () => haptics.drugSearch(),
    protocolStep: () => haptics.protocolStep(),
    erActivation: () => haptics.erActivation(),
    calculationComplete: () => haptics.calculationComplete(),
    navigation: () => haptics.navigation(),
    scanComplete: () => haptics.scanComplete(),
    emergency: () => haptics.emergency(),
    subtle: () => haptics.subtle(),
    trigger: (type: HapticType, options?: any) => haptics.trigger(type, options),
    setEnabled: (enabled: boolean) => haptics.setEnabled(enabled),
    isEnabled: () => haptics.isEnabled(),
  };
};

export default haptics;
