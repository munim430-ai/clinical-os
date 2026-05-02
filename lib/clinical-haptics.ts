import * as Haptics from "expo-haptics";

export function triggerSelectionHaptic() {
  void Haptics.selectionAsync();
}

export function triggerSuccessHaptic() {
  void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}

export function triggerAlertHaptic() {
  void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
}

export function triggerWarningHaptic() {
  void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
}

export function triggerEmergencyHaptic() {
  // Triple pulse for emergency situations
  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  setTimeout(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  }, 100);
  setTimeout(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  }, 200);
}

export function triggerCriticalHaptic() {
  // Long vibration for critical alerts
  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
}
