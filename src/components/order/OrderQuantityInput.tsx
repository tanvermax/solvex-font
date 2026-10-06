// src/components/order/OrderQuantityInput.tsx
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  value: number;
  onChange: (value: number) => void;
  min?: number;         // MOQ
  step?: number;        // usually 1
  max?: number;         // stock
  disabled?: boolean;
}

export default function OrderQuantityInput({
  value,
  onChange,
  min = 1,
  step = 1,
  max,
  disabled,
}: Props) {
  const handleDecrease = () => {
    const next = value - step;
    if (next >= min) onChange(next);
  };

  const handleIncrease = () => {
    const next = value + step;
    if (!max || next <= max) onChange(next);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseInt(e.target.value, 10);
    if (isNaN(num)) return onChange(min);
    if (num < min) return onChange(min);
    if (max && num > max) return onChange(max);
    onChange(num);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-9 w-9 rounded-lg shrink-0"
        onClick={handleDecrease}
        disabled={disabled || value <= min}
      >
        <Minus className="h-3.5 w-3.5" />
      </Button>

      <Input
        type="number"
        value={value}
        onChange={handleChange}
        min={min}
        max={max}
        disabled={disabled}
        className="h-9 text-center font-semibold"
      />

      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-9 w-9 rounded-lg shrink-0"
        onClick={handleIncrease}
        disabled={disabled || (max !== undefined && value >= max)}
      >
        <Plus className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}