import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check } from "lucide-react";
import type { InventoryItem } from "@/types/inventory";

interface InventoryListProps {
  inventory: InventoryItem[];
  onSetQuantity: (id: string, value: number) => void;
}

function StockControl({ 
  value, 
  onSave 
}: { 
  value: number; 
  onSave: (val: number) => void 
}) {
  const [localValue, setLocalValue] = useState(value.toString());
  const isDirty = localValue !== value.toString() && localValue.trim() !== "" && !isNaN(parseInt(localValue));

  useEffect(() => {
    setLocalValue(value.toString());
  }, [value]);

  const handleConfirm = () => {
    const numeric = parseInt(localValue);
    if (!isNaN(numeric) && numeric !== value) {
      onSave(numeric);
    }
  };

  const handleAdjust = (delta: number) => {
    const current = parseInt(localValue) || 0;
    const next = Math.max(0, current + delta);
    setLocalValue(next.toString());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && isDirty) {
      handleConfirm();
    } else if (e.key === "Escape") {
      setLocalValue(value.toString());
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-md md:rounded-full border-black/10 dark:border-white/10"
          onClick={() => handleAdjust(-1)}
          disabled={parseInt(localValue) <= 0}
        >
          -
        </Button>
        <Input
          type="number"
          className="h-8 w-16 text-center font-bold text-[#5c4b3b] dark:text-[#e7c27d] border-black/10 dark:border-white/10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus-visible:ring-primary/20"
          value={localValue}
          onFocus={(e) => e.target.select()}
          onChange={(e) => setLocalValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-md md:rounded-full border-black/10 dark:border-white/10"
          onClick={() => handleAdjust(1)}
        >
          +
        </Button>
      </div>
      <Button
        size="icon"
        variant="outline"
        onClick={handleConfirm}
        disabled={!isDirty}
        className={`h-8 w-8 rounded-md md:rounded-full transition-all border-black/10 dark:border-white/10 ${
          isDirty 
            ? "text-green-600 bg-green-50/50 dark:bg-green-900/10 opacity-100 scale-105 border-green-200 dark:border-green-800" 
            : "text-muted-foreground/30 opacity-40 scale-100 grayscale cursor-not-allowed"
        }`}
      >
        <Check className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function InventoryList({ inventory, onSetQuantity }: InventoryListProps) {
  // agrupar por categoria
  const groupedInventory = inventory.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, InventoryItem[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedInventory).map(([category, items]) => (
        <div key={category} className="space-y-3">
          <h3 className="text-sm font-black tracking-widest text-[#5c4b3b] uppercase dark:text-[#e7c27d]">
            {category}
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col justify-between rounded-sm border border-black/5 bg-white/60 p-4 backdrop-blur-md transition-all hover:bg-white/80 dark:border-white/5 dark:bg-white/5 dark:hover:bg-white/10"
              >
                <div className="font-semibold text-[#1a120b] dark:text-[#f5efe6]">
                  {item.name}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">
                    Em Estoque:
                  </span>
                  <StockControl 
                    value={item.quantity} 
                    onSave={(val) => onSetQuantity(item.id, val)} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
