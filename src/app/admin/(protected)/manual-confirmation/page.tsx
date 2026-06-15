import { getDynamicRooms } from "@/lib/resort-data";
import { ManualConfirmationClient } from "./ManualConfirmationClient";

export const metadata = {
  title: "Manual Confirmation | Piero Admin",
};

export default async function ManualConfirmationPage() {
  const rooms = await getDynamicRooms();
  return <ManualConfirmationClient rooms={rooms} />;
}
