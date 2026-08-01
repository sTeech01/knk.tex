"use client";

import { Button } from "@/components/ui/button";
import { useConsultation } from "@/components/shared/consultation-provider";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

export function ConsultationButton({
  subject,
  children,
  className,
  size,
  variant,
}: {
  subject?: string;
  children: React.ReactNode;
  className?: string;
  size?: ComponentProps<typeof Button>["size"];
  variant?: ComponentProps<typeof Button>["variant"];
}) {
  const { open } = useConsultation();
  return (
    <Button
      type="button"
      size={size}
      variant={variant}
      className={cn(className)}
      onClick={() => open(subject)}
    >
      {children}
    </Button>
  );
}
