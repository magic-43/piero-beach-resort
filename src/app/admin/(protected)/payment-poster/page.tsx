import { redirect } from "next/navigation";

export default function PaymentPosterFallback() {
  redirect("/admin/piero/payment-poster");
}

