import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Trash2, Plus, Package } from "lucide-react"
import type { Order, OrderItem } from "@/features/orders/types"
import { useInventory } from "@/features/inventory/hooks/use-inventory"

interface OrderFormProps {
  onAddOrder: (order: Order) => void
}

export function OrderForm({ onAddOrder }: OrderFormProps) {
  const { inventory, deductQuantities } = useInventory()

  const [formData, setFormData] = useState({
    customerName: "",
    deliveryDate: "",
    deliveryTime: "",
    address: "",
    description: "",
  })

  const [items, setItems] = useState<Omit<OrderItem, "id">[]>([])

  const today = new Date().toLocaleDateString("pt-BR")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const orderItems: OrderItem[] = items.map((item) => {
      const product = inventory.find((inv) => inv.id === item.inventoryItemId)
      return {
        ...item,
        id: crypto.randomUUID(),
        productName: product?.name || "Produto",
      }
    })

    onAddOrder({
      ...formData,
      id: crypto.randomUUID(),
      orderDate: today,
      status: "Pending",
      items: orderItems,
      totalPrice: orderItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      ),
    })

    if (orderItems.length > 0) deductQuantities(orderItems)

    setFormData({
      customerName: "",
      deliveryDate: "",
      deliveryTime: "",
      address: "",
      description: "",
    })

    setItems([])
  }

  const addItem = () =>
    setItems([
      ...items,
      {
        inventoryItemId: "",
        productName: "",
        flavor: "",
        price: 0,
        quantity: 1,
      },
    ])

  const updateItem = (
    index: number,
    field: keyof Omit<OrderItem, "id">,
    value: any
  ) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    setItems(newItems)
  }

  const removeItem = (index: number) =>
    setItems(items.filter((_, i) => i !== index))

  const total = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  )

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="space-y-1">
          <Label className="text-[10px] font-bold uppercase opacity-60">
            Nome do Cliente
          </Label>
          <Input
            value={formData.customerName}
            onChange={(e) =>
              setFormData({ ...formData, customerName: e.target.value })
            }
            required
            className="h-11"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label className="text-[10px] font-bold uppercase opacity-60">
              Data Entrega
            </Label>
            <Input
              type="date"
              value={formData.deliveryDate}
              onChange={(e) =>
                setFormData({ ...formData, deliveryDate: e.target.value })
              }
              required
              className="h-11"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-[10px] font-bold uppercase opacity-60">
              Hora
            </Label>
            <Input
              type="time"
              value={formData.deliveryTime}
              onChange={(e) =>
                setFormData({ ...formData, deliveryTime: e.target.value })
              }
              required
              className="h-11"
            />
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <Label className="text-[10px] font-bold uppercase opacity-60">
          Endereço
        </Label>
        <Input
          value={formData.address}
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
          required
          placeholder="Rua, nº, bairro..."
          className="h-11"
        />
      </div>

      <div className="space-y-4 rounded-sm border border-dashed border-black/10 p-3 dark:border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-primary" />
            <span className="text-xs font-black uppercase">Itens</span>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addItem}
            className="h-8 gap-1 text-[10px] uppercase font-bold rounded-full"
          >
            <Plus className="h-3 w-3" /> Adicionar
          </Button>
        </div>

        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex flex-col gap-3 rounded-md bg-black/5 p-3 dark:bg-white/5"
            >
              {/* Produto */}
              <div className="space-y-1">
                <Label className="text-[9px] uppercase opacity-50">
                  Produto
                </Label>
                <select
                  value={item.inventoryItemId}
                  onChange={(e) =>
                    updateItem(index, "inventoryItemId", e.target.value)
                  }
                  required
                  className="w-full h-10 rounded-md border bg-background px-3 text-sm"
                >
                  <option value="" disabled>
                    Selecione...
                  </option>
                  {inventory.map((inv) => (
                    <option key={inv.id} value={inv.id}>
                      {inv.name} ({inv.quantity} un)
                    </option>
                  ))}
                </select>
              </div>

              {/* Sabor */}
              <div className="space-y-1">
                <Label className="text-[9px] uppercase opacity-50">
                  Sabor
                </Label>
                <Input
                  value={item.flavor}
                  onChange={(e) =>
                    updateItem(index, "flavor", e.target.value)
                  }
                  required
                  className="h-10"
                />
              </div>

              {/* Preço + Quantidade */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-[9px] uppercase opacity-50">
                    Preço
                  </Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={item.price || ""}
                    onChange={(e) =>
                      updateItem(
                        index,
                        "price",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    required
                    className="h-10"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-[9px] uppercase opacity-50">
                    Qtd
                  </Label>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(
                        index,
                        "quantity",
                        parseInt(e.target.value) || 1
                      )
                    }
                    required
                    className="h-10"
                  />
                </div>
              </div>

              {/* Botão */}
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeItem(index)}
                  className="h-9 px-4"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Remover
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-1">
        <Label className="text-[10px] font-bold uppercase opacity-60">
          Observações
        </Label>
        <Textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="min-h-[80px] resize-none rounded-sm"
        />
      </div>

      <Button
        type="submit"
        className="h-14 w-full font-black uppercase tracking-widest"
      >
        Finalizar Pedido {items.length > 0 && `• R$ ${total.toFixed(2)}`}
      </Button>
    </form>
  )
}