// src/components/admin/Product/SpecificationInput.tsx
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface Specification {
  key: string;
  value: string;
}

interface SpecificationInputProps {
  value: Specification[];
  onChange: (value: Specification[]) => void;
}

export default function SpecificationInput({
  value = [],
  onChange,
}: SpecificationInputProps) {
  const handleAdd = () => {
    onChange([...value, { key: "", value: "" }]);
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleChange = (
    index: number,
    field: "key" | "value",
    fieldValue: string
  ) => {
    const newValue = [...value];
    newValue[index] = { ...newValue[index], [field]: fieldValue };
    onChange(newValue);
  };

  return (
    <div className="space-y-3">
      {value.length === 0 ? (
        <div className="text-sm text-muted-foreground p-4 border border-dashed rounded-lg text-center">
          No specifications added yet
        </div>
      ) : (
        <div className="space-y-2">
          {value.map((spec, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                placeholder="Key (e.g. Material)"
                value={spec.key}
                onChange={(e) => handleChange(index, "key", e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="Value (e.g. Steel)"
                value={spec.value}
                onChange={(e) => handleChange(index, "value", e.target.value)}
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemove(index)}
                className="text-destructive hover:text-destructive shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleAdd}
        className="w-full sm:w-auto"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Specification
      </Button>
    </div>
  );
}