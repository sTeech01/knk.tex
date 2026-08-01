import { PackageCheck } from "lucide-react";
import { Reveal } from "@/components/shared/reveal";
import { company } from "@/data/company";
import { homeCopy } from "@/data/copy";

export function MinOrderBanner() {
  return (
    <section className="mx-auto max-w-7xl px-6">
      <Reveal>
        <div className="flex flex-col items-start gap-6 rounded-lg border border-gold/30 bg-gradient-to-br from-graphite to-graphite/95 px-6 py-8 text-white sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-10">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold sm:size-14">
              <PackageCheck className="size-6 sm:size-7" />
            </div>
            <div>
              <h3 className="font-heading text-xl sm:text-2xl">
                {homeCopy.minOrderHeading}: от {company.minOrderMeters} метров
              </h3>
              <p className="mt-1 max-w-xl text-sm text-ivory/70">
                {homeCopy.minOrderBody}
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
