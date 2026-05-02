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
