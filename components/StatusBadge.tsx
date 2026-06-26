import { StatusLabel } from "@/components/I18nProvider";
import type { ProductStatusKey } from "@/lib/types";

const statusClass: Record<ProductStatusKey, string> = {
  available: "bg-[#E9FBEF] text-[#1F8A4C]",
  reserved: "bg-[#FFF0D6] text-[#B76B12]",
  sold: "bg-[#EFEFEF] text-panda-muted",
  inactive: "bg-[#FCE7E7] text-[#B83E3E]"
};

export function StatusBadge({ status }: { status: ProductStatusKey }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-bold shadow-sm ${statusClass[status]}`}>
      <StatusLabel value={status} />
    </span>
  );
}
