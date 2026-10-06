"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type SliderProps = {
  value?: number[];
  defaultValue?: number[];
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  onValueChange?: (value: number[]) => void;
  "aria-label"?: string;
};

export function Slider({
  value,
  defaultValue = [0],
  min = 0,
  max = 100,
  step = 1,
  className,
  onValueChange,
  "aria-label": ariaLabel,
}: SliderProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = value ?? internalValue;
  const isRange = currentValue.length > 1;
  const values = useMemo(() => [...currentValue].sort((a, b) => a - b), [currentValue]);

  const updateValue = (index: number, next: number) => {
    const nextValues = [...values];
    if (isRange) {
      nextValues[index] = next;
      if (index === 0) nextValues[0] = Math.min(next, nextValues[1]);
      if (index === 1) nextValues[1] = Math.max(next, nextValues[0]);
    } else {
      nextValues[0] = next;
    }
    setInternalValue(nextValues);
    onValueChange?.(nextValues);
  };

  const start = ((values[0] - min) / (max - min)) * 100;
  const end = ((values[values.length - 1] - min) / (max - min)) * 100;

  return (
    <div className={cn("relative flex h-10 w-full items-center rounded-full border border-white/80 bg-white/50 px-3.5 shadow-[inset_0_1px_2px_rgba(255,255,255,.85),0_5px_18px_rgba(58,45,40,.06)] backdrop-blur-md", className)}>
      <div className="pointer-events-none absolute inset-x-4 h-2 rounded-full bg-slate/10" />
      <div className="pointer-events-none absolute inset-y-0 left-4 right-4 flex items-center">
        <div className="h-2 rounded-full bg-gradient-to-r from-royal to-sovereign" style={{ marginLeft: `${start}%`, width: `${Math.max(0, end - start)}%` }} />
      </div>
      {values.map((current, index) => (
        <input
          key={index}
          type="range"
          min={min}
          max={max}
          step={step}
          value={current}
          onChange={(event) => updateValue(index, Number(event.target.value))}
          aria-label={ariaLabel ? `${ariaLabel} ${index === 0 && isRange ? "minimum" : index === 1 ? "maximum" : "value"}` : undefined}
          className={cn("range-slider-thumb absolute inset-x-4 h-2 w-[calc(100%-2rem)] appearance-none bg-transparent", index === 0 ? "z-20" : "z-10")}
        />
      ))}
    </div>
  );
}
