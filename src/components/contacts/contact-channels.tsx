import { Clock, Mail, MessageCircle, Phone, Send } from "lucide-react";
import { company } from "@/data/company";
import { cn } from "@/lib/utils";

export function ContactChannels({ className }: { className?: string }) {
  const channels = [
    {
      icon: Phone,
      label: "Телефон",
      value: company.phone,
      href: company.phoneHref,
    },
    {
      icon: Send,
      label: "Telegram",
      value: "Написать в Telegram",
      href: company.telegram,
      external: true,
    },
    {
      icon: MessageCircle,
      label: "MAX",
      value: "Написать в MAX",
      href: company.max,
      external: true,
    },
    {
      icon: Mail,
      label: "Email",
      value: company.email,
      href: `mailto:${company.email}`,
    },
  ];

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {channels.map((channel) => (
        <a
          key={channel.label}
          href={channel.href}
          target={channel.external ? "_blank" : undefined}
          rel={channel.external ? "noopener noreferrer" : undefined}
          className="group flex items-center gap-4 rounded-lg border border-border p-4 transition-colors hover:border-accent/50 hover:bg-muted/60"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gold-soft text-gold-foreground">
            <channel.icon className="size-4" />
          </span>
          <span>
            <span className="block text-xs uppercase tracking-wide text-muted-foreground">
              {channel.label}
            </span>
            <span className="font-medium">{channel.value}</span>
          </span>
        </a>
      ))}

      <div className="flex items-center gap-4 rounded-lg border border-border p-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gold-soft text-gold-foreground">
          <Clock className="size-4" />
        </span>
        <span>
          <span className="block text-xs uppercase tracking-wide text-muted-foreground">
            Режим работы
          </span>
          <span className="font-medium">{company.workingHours}</span>
        </span>
      </div>
    </div>
  );
}
