"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";
import { CURRENCIES } from "@/lib/currency";
import { useCurrency } from "@/lib/currency-context";
import { CurrencyIcon } from "@/components/tools/CurrencyIcon";
import { cn } from "@/lib/utils";

const MENU_HEIGHT = 320;
const MENU_WIDTH = 220;
const GAP = 8;

export function CurrencySwitcher({
  className,
  sticky = false,
}: {
  className?: string;
  sticky?: boolean;
}) {
  const { currency, setCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<CSSProperties>({});
  const [active, setActive] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const optionRefs = useRef<(HTMLLIElement | null)[]>([]);

  const selected = CURRENCIES.find((c) => c.code === currency) ?? CURRENCIES[0];

  // The menu is portalled to <body> so ancestor stacking contexts (Reveal
  // transforms, overflow-hidden cards) can't paint over it or clip it.
  const position = useCallback(() => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;
    const openUp =
      window.innerHeight - rect.bottom < MENU_HEIGHT && rect.top > MENU_HEIGHT;
    const alignRight = rect.left + MENU_WIDTH > window.innerWidth - 16;
    setMenuStyle({
      position: "fixed",
      ...(openUp
        ? { bottom: window.innerHeight - rect.top + GAP }
        : { top: rect.bottom + GAP }),
      ...(alignRight
        ? { right: window.innerWidth - rect.right }
        : { left: rect.left }),
    });
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    position();
    window.addEventListener("scroll", position, true);
    window.addEventListener("resize", position);
    return () => {
      window.removeEventListener("scroll", position, true);
      window.removeEventListener("resize", position);
    };
  }, [open, position]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      const target = e.target as Node;
      if (
        !buttonRef.current?.contains(target) &&
        !menuRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open]);

  useEffect(() => {
    if (open) optionRefs.current[active]?.focus({ preventScroll: true });
  }, [open, active]);

  const openMenu = () => {
    setActive(Math.max(0, CURRENCIES.findIndex((c) => c.code === currency)));
    setOpen(true);
  };

  const choose = (index: number) => {
    setCurrency(CURRENCIES[index].code);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const onMenuKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % CURRENCIES.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + CURRENCIES.length) % CURRENCIES.length);
    } else if (e.key === "Home") {
      e.preventDefault();
      setActive(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActive(CURRENCIES.length - 1);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      choose(active);
    } else if (e.key === "Escape" || e.key === "Tab") {
      setOpen(false);
      if (e.key === "Escape") buttonRef.current?.focus();
    }
  };

  const menu = (
    <ul
      ref={menuRef}
      role="listbox"
      aria-label="Display currency"
      onKeyDown={onMenuKey}
      style={menuStyle}
      className="z-[100] min-w-[200px] overflow-hidden rounded-2xl border border-slate/10 bg-canvas p-1 shadow-lg"
    >
      {CURRENCIES.map((c, i) => {
        const isSelected = c.code === currency;
        return (
          <li
            key={c.code}
            ref={(el) => {
              optionRefs.current[i] = el;
            }}
            role="option"
            aria-selected={isSelected}
            tabIndex={i === active ? 0 : -1}
            onClick={() => choose(i)}
            onMouseEnter={() => setActive(i)}
            className={cn(
              "flex cursor-pointer items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm outline-none",
              i === active ? "bg-sand" : "",
            )}
          >
            <CurrencyIcon code={c.code} size={20} />
            <span className="font-medium text-slate">{c.label}</span>
            <span className="text-xs text-slate/50">{c.name}</span>
            {isSelected && <Check size={14} className="ml-auto text-royal" />}
          </li>
        );
      })}
    </ul>
  );

  const dropdown = (
    <div className={cn("relative inline-block", className)}>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Display currency: ${selected.name}`}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            openMenu();
          }
        }}
        className="inline-flex items-center gap-2 rounded-full border border-slate/10 bg-sand py-1.5 pl-2 pr-3 text-xs font-medium text-slate transition-colors hover:border-slate/20"
      >
        <CurrencyIcon code={selected.code} />
        {selected.label}
        <ChevronDown
          size={14}
          className={cn("text-slate/50 transition-transform", open && "rotate-180")}
        />
      </button>

      {open && createPortal(menu, document.body)}
    </div>
  );

  if (!sticky) return dropdown;

  return (
    <div className="sticky top-[88px] z-20 border-b border-slate/10 bg-canvas/90 px-4 py-3 sm:px-6">
      {dropdown}
    </div>
  );
}
