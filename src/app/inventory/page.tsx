import { montserrat } from "@/lib/fonts";
import InventoryClient from "@/components/inventory/InventoryClient";

export default async function InventoryPage() {
  return (
    <div className={montserrat.className}>
      <div className="flex h-screen flex-col bg-[#F9F1E9] p-6">
        <InventoryClient />
      </div>
    </div>
  );
}
