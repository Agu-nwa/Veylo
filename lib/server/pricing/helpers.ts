export function createQuoteId() {
  return `QUOTE-${Date.now().toString().slice(-7)}-${Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()}`;
}

export function roundMoney(value: number) {
  return Math.round(value / 50) * 50;
}

export function hashText(text: string) {
  return text.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

export function estimateDistanceKm(pickup: string, dropoff: string) {
  const seed = hashText(`${pickup}-${dropoff}`);
  return Math.max(2, Math.min(18, 2 + (seed % 17)));
}
