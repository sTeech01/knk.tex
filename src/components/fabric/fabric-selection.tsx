"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { ConsultationButton } from "@/components/shared/consultation-button";

/**
 * Какой оттенок покупатель выбрал в палитре. Раньше этот выбор жил только
 * внутри галереи: покупатель находил нужный цвет, жал «заявку» — а менеджер
 * получал лишь название ткани, без номера. Весь смысл нумерованной палитры
 * терялся на последнем шаге.
 */
type Selection = {
  code: string | null;
  setCode: (code: string | null) => void;
};

const SelectionContext = createContext<Selection | null>(null);

export function FabricSelectionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [code, setCode] = useState<string | null>(null);
  const value = useMemo(() => ({ code, setCode }), [code]);
  return (
    <SelectionContext.Provider value={value}>
      {children}
    </SelectionContext.Provider>
  );
}

/** Вне карточки ткани галерея тоже работает — просто ничего не передаёт. */
export function useFabricSelection(): Selection {
  return useContext(SelectionContext) ?? { code: null, setCode: () => {} };
}

export function FabricOrderButton({
  fabricName,
  hasPalette,
}: {
  fabricName: string;
  hasPalette: boolean;
}) {
  const { code } = useFabricSelection();
  const subject = code ? `${fabricName}, оттенок ${code}` : fabricName;

  return (
    <div>
      <ConsultationButton
        subject={subject}
        className="h-12 w-full bg-navy text-base font-medium text-white hover:bg-navy/90 sm:w-auto sm:px-10"
      >
        Оставить заявку
      </ConsultationButton>
      {hasPalette && (
        <p className="mt-3 text-xs text-muted-foreground" aria-live="polite">
          {code
            ? `В заявке будет указан оттенок ${code}.`
            : "Выберите оттенок в палитре — он попадёт в заявку."}
        </p>
      )}
    </div>
  );
}
