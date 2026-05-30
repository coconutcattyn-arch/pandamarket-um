import { getProductStatusLabel } from "@/lib/data";
import type { ProductStatusKey } from "@/lib/types";

const statusClass: Record<ProductStatusKey, string> = {
  available: "bg-[#FFF4CF] text-[#8A640F]",
  reserved: "bg-[#fff3c4] text-[#886600]",
  sold: "bg-[#ece8df] text-panda-muted",
  inactive: "bg-[#f1eeee] text-[#8a5d5d]"
};

export function StatusBadge({ status }: { status: ProductStatusKey }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass[status]}`}>
      {getProductStatusLabel(status)}
    </span>
  );
}
