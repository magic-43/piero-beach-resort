import { getDynamicRooms } from "@/lib/resort-data";
import { ManualConfirmationClient } from "../../manual-confirmation/ManualConfirmationClient";

export const metadata = {
  title: "Manual Confirmation | Piero Admin",
};

export default async function PieroManualConfirmationPage() {
  // Fetch only Piero rooms for the manual confirmation tool
  const allRooms = await getDynamicRooms();
  return <ManualConfirmationClient rooms={allRooms} />;
}
