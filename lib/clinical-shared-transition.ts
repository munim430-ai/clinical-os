import { Easing } from "react-native-reanimated";

export const clinicalSharedTransition = {
  cardPressDuration: 90,
  cardExpandDuration: 360,
  contentEnterDuration: 180,
  contentEnterDelay: 120,
  easing: Easing.out(Easing.cubic),
};

export function medicineCardTransitionTag(id: string | number) {
  return `medicine-card-${id}`;
}

export function medicineTitleTransitionTag(id: string | number) {
  return `medicine-title-${id}`;
}

export function medicineIconTransitionTag(id: string | number) {
  return `medicine-icon-${id}`;
}

export function protocolCardTransitionTag(id: string | number) {
  return `protocol-card-${id}`;
}

export function protocolTitleTransitionTag(id: string | number) {
  return `protocol-title-${id}`;
}
