import { Platform } from 'react-native';
import Vibration from 'react-native';

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
  duration?: number;
  pattern?: number[];
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

  private checkHapticsAvailability(): void {
    try {
      // Test vibration availability
      if (Platform.OS === 'ios') {
        // iOS has limited vibration support
        this.isHapticsEnabled = true;
      } else {
        // Android usually supports vibration
        this.isHapticsEnabled = true;
      }
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
    duration?: number;
    pattern?: number[];
  }): Promise<void> {
    if (!this.isHapticsEnabled) return;

    try {
      switch (type) {
        case 'light':
          Vibration.vibrate(10);
          break;

        case 'medium':
          Vibration.vibrate(25);
          break;

        case 'heavy':
          Vibration.vibrate(50);
          break;

        case 'success':
          Vibration.vibrate([50, 50, 50]);
          break;

        case 'warning':
          Vibration.vibrate([100, 100]);
          break;

        case 'error':
          Vibration.vibrate([200, 100, 200]);
          break;

        case 'selection':
          Vibration.vibrate(15);
          break;

        case 'impact':
          const impactDuration = this.getImpactDuration(options?.intensity || 'medium');
          Vibration.vibrate(impactDuration);
          break;

        case 'notification':
          const notificationPattern = this.getNotificationPattern(options?.intensity || 'medium');
          Vibration.vibrate(notificationPattern);
          break;

        case 'rhythmic':
          await this.triggerRhythmicPattern(options?.duration || 1000);
          break;

        case 'custom':
          if (options?.pattern) {
            Vibration.vibrate(options.pattern);
          } else {
            Vibration.vibrate(options?.duration || 25);
          }
          break;

        default:
          Vibration.vibrate(25);
      }
    } catch (error) {
      console.log('Haptic trigger failed:', error);
    }
  }

  private getImpactDuration(intensity: 'light' | 'medium' | 'heavy'): number {
    switch (intensity) {
      case 'light':
        return 10;
      case 'medium':
        return 25;
      case 'heavy':
        return 50;
      default:
        return 25;
    }
  }

  private getNotificationPattern(intensity: 'light' | 'medium' | 'heavy'): number[] {
    switch (intensity) {
      case 'light':
        return [50, 50];
      case 'medium':
        return [100, 100];
      case 'heavy':
        return [200, 100, 200];
      default:
        return [100, 100];
    }
  }

  private async triggerRhythmicPattern(duration: number): Promise<void> {
    const patternCount = Math.floor(duration / 200);
    const pattern: number[] = [];
    
    for (let i = 0; i < patternCount; i++) {
      pattern.push(50, 150); // 50ms vibration, 150ms pause
    }
    
    Vibration.vibrate(pattern);
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
    await this.trigger('custom', { pattern: [10, 50, 10] });
  }

  async protocolStep(): Promise<void> {
    await this.trigger('selection');
  }

  async erActivation(): Promise<void> {
    await this.trigger('custom', { pattern: [100, 50, 100, 50, 100] });
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
    await this.trigger('custom', { pattern: [200, 100, 200, 100, 200, 100] });
  }

  async subtle(): Promise<void> {
    // Very light haptic for subtle feedback
    if (Platform.OS === 'ios') {
      try {
        Vibration.vibrate(5);
      } catch (error) {
        // Silent fail for very subtle haptics
      }
    } else {
      Vibration.vibrate(5);
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
