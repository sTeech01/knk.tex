"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConsultationForm } from "@/components/shared/consultation-form";

type ConsultationContextValue = {
  open: (subject?: string) => void;
};

const ConsultationContext = createContext<ConsultationContextValue | null>(
  null
);

export function useConsultation() {
  const ctx = useContext(ConsultationContext);
  if (!ctx) {
    throw new Error(
      "useConsultation должен использоваться внутри ConsultationProvider"
    );
  }
  return ctx;
}

export function ConsultationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [subject, setSubject] = useState<string | undefined>(undefined);

  const open = useCallback((nextSubject?: string) => {
    setSubject(nextSubject);
    setIsOpen(true);
  }, []);

  const value = useMemo(() => ({ open }), [open]);

  return (
    <ConsultationContext.Provider value={value}>
      {children}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            {/* С карточки ткани человек пришёл с конкретным товаром — это
                заявка, а не просьба о консультации. */}
            <DialogTitle className="font-heading text-2xl">
              {subject ? "Оставить заявку" : "Получить консультацию"}
            </DialogTitle>
            <DialogDescription>
              Оставьте контакты — менеджер свяжется с вами в течение рабочего
              дня.
            </DialogDescription>
          </DialogHeader>
          {/* key сбрасывает форму при каждом открытии: иначе после отправки
              следующая заявка открывалась бы на экране «спасибо». */}
          <ConsultationForm key={`${isOpen}-${subject ?? ""}`} subject={subject} />
        </DialogContent>
      </Dialog>
    </ConsultationContext.Provider>
  );
}
