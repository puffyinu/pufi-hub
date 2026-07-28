export function createNonce(): string {
  return crypto.randomUUID();
}

export function createTimestamp(): number {
  return Math.floor(Date.now() / 1000);
}

export function createExpiration(minutes = 5): number {
  return createTimestamp() + minutes * 60;
}