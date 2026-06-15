export function generateBookingReference(): string {
  // Use Web Crypto API which works across browser, edge, and Node 19+
  const array = new Uint8Array(4);
  crypto.getRandomValues(array);
  
  // Convert to hex and uppercase
  const hex = Array.from(array)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();
    
  return `PIERO-${hex}`;
}
