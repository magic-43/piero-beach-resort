export type PaymentOption = "full" | "half";

export interface PricingInput {
  roomDiscountedRate: number;
  roomRegularRate: number;
  standardGuests: number;
  adultGuests: number;
  childGuests: number;
  maxExtraGuests: number;
  extraPersonFee: number;
  securityDeposit: number;
  checkIn: string;
  checkOut: string;
  paymentOption: 'full' | 'half';
}

export interface PricingOutput {
  nights: number;
  regularRateSnapshot: number;
  discountedRateSnapshot: number;
  roomTotal: number;
  extraPersonTotal: number;
  grandTotal: number;
  amountDueNow: number;
  remainingBalance: number;
  securityDepositSnapshot: number;
  extraPersonFeeSnapshot: number;
}

function roundPHP(amount: number): number {
  return Math.round(amount * 100) / 100;
}

export function calculatePricing(input: PricingInput): PricingOutput {
  const start = new Date(input.checkIn);
  const end = new Date(input.checkOut);
  
  // Calculate nights
  const timeDiff = end.getTime() - start.getTime();
  const nights = Math.max(0, Math.ceil(timeDiff / (1000 * 3600 * 24)));

  if (nights <= 0) {
    return {
      nights: 0,
      regularRateSnapshot: input.roomRegularRate,
      discountedRateSnapshot: input.roomDiscountedRate,
      roomTotal: 0,
      extraPersonTotal: 0,
      grandTotal: 0,
      amountDueNow: 0,
      remainingBalance: 0,
      securityDepositSnapshot: input.securityDeposit,
      extraPersonFeeSnapshot: input.extraPersonFee,
    };
  }

  // Room total uses discounted rate as the actual booking rate
  const roomTotal = roundPHP(input.roomDiscountedRate * nights);

  // Extra persons (only count adults for extra fee)
  const extraAdults = Math.max(0, input.adultGuests - input.standardGuests);
  const extraPersonTotal = roundPHP(extraAdults * input.extraPersonFee * nights);

  // Grand total
  const grandTotal = roundPHP(roomTotal + extraPersonTotal);

  // Amount due now based on payment option (excluding deposit)
  let amountDueNow = grandTotal;
  let remainingBalance = 0;

  if (input.paymentOption === 'half') {
    amountDueNow = roundPHP(grandTotal / 2);
    remainingBalance = roundPHP(grandTotal - amountDueNow);
  }

  return {
    nights,
    regularRateSnapshot: input.roomRegularRate,
    discountedRateSnapshot: input.roomDiscountedRate,
    roomTotal,
    extraPersonTotal,
    grandTotal,
    amountDueNow,
    remainingBalance,
    securityDepositSnapshot: input.securityDeposit,
    extraPersonFeeSnapshot: input.extraPersonFee,
  };
}
