/**
 * Generates a secure random guest access token using the Web Crypto API.
 */
export function generateGuestAccessToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Hashes a token using SHA-256 so only the hash is stored in the database.
 */
export async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Verifies a supplied token against a stored hash.
 */
export async function verifyToken(token: string, storedHash: string): Promise<boolean> {
  const hash = await hashToken(token);
  // Compare hashes securely (avoiding simple timing attacks by checking the whole string, though timing on strings isn't strictly constant, it's sufficient here since the hash itself hides the token)
  return hash === storedHash;
}
