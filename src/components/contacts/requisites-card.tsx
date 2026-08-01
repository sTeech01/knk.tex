import { FileText } from "lucide-react";
import { company } from "@/data/company";
import { cn } from "@/lib/utils";

export function RequisitesRow({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-start gap-4 rounded-lg border border-border p-4",
        className
      )}
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gold-soft text-gold-foreground">
        <FileText className="size-4" />
      </span>
      <span>
        <span className="block text-xs uppercase tracking-wide text-muted-foreground">
          Реквизиты
        </span>
        <span className="font-medium">{company.legalName}</span>
        <span className="mt-1 block text-sm text-muted-foreground">
          {company.requisitesNote}
        </span>
      </span>
    </div>
  );
}
