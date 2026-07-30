/**
 * Generates an alphanumeric nonce (letters + digits only) for SIWE messages.
 * World App's walletAuth requires nonce to be alphanumeric, at least 8 chars.
 * crypto.randomUUID() is NOT valid because it contains hyphens.
 */
export function generateAlphanumericNonce(length = 32): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  const array = new Uint32Array(length);
  crypto.getRandomValues(array);

  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars[array[i] % chars.length];
  }

  return result;
}
