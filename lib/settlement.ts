export type FeeModel = "FULL" | "SPLIT" | "RENT";

export function computeDoctorShare(
  grossFee: number,
  model: FeeModel,
  splitPercent?: number | null,
  monthlyRent?: number | null,
  visitsThisMonth?: number,
): { doctorShare: number; chamberShare: number } {
  switch (model) {
    case "SPLIT": {
      const pct = (splitPercent ?? 100) / 100;
      const doctorShare = Math.round(grossFee * pct);
      return { doctorShare, chamberShare: grossFee - doctorShare };
    }
    case "RENT": {
      const perVisitRent =
        visitsThisMonth && visitsThisMonth > 0
          ? (monthlyRent ?? 0) / visitsThisMonth
          : 0;
      return {
        doctorShare: Math.round(grossFee - perVisitRent),
        chamberShare: Math.round(perVisitRent),
      };
    }
    default:
      return { doctorShare: grossFee, chamberShare: 0 };
  }
}
