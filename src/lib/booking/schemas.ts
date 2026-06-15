import { z } from 'zod';

export const bookingCreationSchema = z.object({
  roomSlug: z.string().min(1, "Room is required"),
  checkIn: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid check-in date"),
  checkOut: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid check-out date"),
  adultGuests: z.number().int().min(1, "At least 1 adult is required"),
  childGuests: z.number().int().min(0, "Children cannot be negative"),
  guestName: z.string().min(2, "Name must be at least 2 characters").max(100),
  guestEmail: z.string().email("Invalid email address"),
  guestPhone: z.string().min(5, "Phone number is too short").max(30),
  specialRequests: z.string().max(1000).optional().nullable(),
  paymentOption: z.enum(['full', 'half']),
  clientRequestId: z.string().uuid("Invalid client request ID for idempotency"),
});

export const paymentProofSchema = z.object({
  paymentMethod: z.enum(['bank_transfer', 'gcash']),
  amountClaimed: z.string().transform(Number).refine(val => !isNaN(val) && val > 0, "Amount must be a positive number"),
});
