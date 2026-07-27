export function generateRxNumber(latestRxNumber?: string | null): string {
  const year = new Date().getFullYear();
  if (latestRxNumber) {
    const parts = latestRxNumber.split("-");
    const seq = Number.parseInt(parts[parts.length - 1], 10) + 1;
    return `RX-${year}-${String(seq).padStart(5, "0")}`;
  }
  return `RX-${year}-00001`;
}
