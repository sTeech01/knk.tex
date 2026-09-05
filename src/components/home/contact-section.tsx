import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { ConsultationForm } from "@/components/shared/consultation-form";
import { ContactChannels } from "@/components/contacts/contact-channels";
import { homeCopy } from "@/data/copy";

export function ContactSection() {
  return (
    <section id="contacts" className="bg-mist py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <SectionHeading
            eyebrow="Связаться с нами"
            title={homeCopy.contactFormHeading}
            description={homeCopy.contactFormBody}
          />
          <div className="mt-8 rounded-lg border border-border bg-background p-6 sm:p-8">
            <ConsultationForm />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <h3 className="font-heading text-xl">Контакты</h3>
          <ContactChannels className="mt-6" />
        </Reveal>
      </div>
    </section>
  );
}
