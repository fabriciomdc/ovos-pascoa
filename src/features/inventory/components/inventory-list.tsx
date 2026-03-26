import { Button } from "@/components/ui/button";
import type { InventoryItem } from "../types";

interface InventoryListProps {
  inventory: InventoryItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
}

export function InventoryList({ inventory, onUpdateQuantity }: InventoryListProps) {
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
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-md md:rounded-full"
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      disabled={item.quantity <= 0}
                    >
                      -
                    </Button>
                    <span className="w-6 text-center font-bold text-[#5c4b3b] dark:text-[#e7c27d]">
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-md md:rounded-full"
                      onClick={() => onUpdateQuantity(item.id, 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
