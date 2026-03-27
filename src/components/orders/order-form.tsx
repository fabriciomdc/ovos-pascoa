import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Trash2, Plus, Package } from "lucide-react"
import type { Order, OrderItem } from "@/types/order"
import type { InventoryItem } from "@/types/inventory"
import { useInventory } from "@/hooks/use-inventory"

interface OrderFormProps {
  onAddOrder: (order: Order) => void
  initialData?: Order | null
}

const formatBRL = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function OrderForm({ onAddOrder, initialData }: OrderFormProps) {
  const { inventory, deductQuantities } = useInventory()

  const [formData, setFormData] = useState({
    customerName: "",
    deliveryDate: "",
    deliveryTime: "",
    address: "",
    description: "",
  })

  // Usamos string para o preço e quantidade no estado interno para facilitar a edição (permitir campo vazio)
  const [items, setItems] = useState<{
    inventoryItemId: string;
    productName: string;
    flavor: string;
    price: string;
    quantity: string;
  }[]>([])

  useEffect(() => {
    if (initialData) {
      setFormData({
        customerName: initialData.customerName,
        deliveryDate: initialData.deliveryDate,
        deliveryTime: initialData.deliveryTime,
        address: initialData.address,
        description: initialData.description,
      })
      setItems(
        (initialData.items || []).map((item) => ({
          inventoryItemId: item.inventoryItemId,
          productName: item.productName,
          flavor: item.flavor,
          price: item.price.toString(),
          quantity: item.quantity.toString(),
        }))
      )
    }
  }, [initialData])

  const today = new Date().toLocaleDateString("pt-BR")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const orderItems: OrderItem[] = items.map((item) => {
      const product = inventory.find((inv: InventoryItem) => inv.id === item.inventoryItemId)
      return {
        ...item,
        id: crypto.randomUUID(),
        productName: product?.name || "Produto",
        price: parseFloat(item.price) || 0,
        quantity: parseInt(item.quantity) || 1,
      }
    })

    onAddOrder({
      ...formData,
      id: initialData?.id || crypto.randomUUID(),
      orderDate: initialData?.orderDate || today,
      status: initialData?.status || "Pending",
      items: orderItems,
      totalPrice: orderItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      ),
      userId: initialData?.userId || "", // Será preenchido pelo hook se necessário
    })

    // Só deduz se for um novo pedido para não bagunçar o estoque na edição simples
    // Futuramente poderia ter uma lógica mais complexa de comparação
    if (!initialData && orderItems.length > 0) deductQuantities(orderItems)

    if (!initialData) {
      setFormData({
        customerName: "",
        deliveryDate: "",
        deliveryTime: "",
        address: "",
        description: "",
      })
      setItems([])
    }
  }

  const addItem = () =>
    setItems([
      ...items,
      {
        inventoryItemId: "",
        productName: "",
        flavor: "",
        price: "",
        quantity: "1",
      },
    ])

  const updateItem = (
    index: number,
    field: string,
    value: string
  ) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    setItems(newItems)
  }

  const removeItem = (index: number) =>
    setItems(items.filter((_, i) => i !== index))

  const total = items.reduce(
    (acc, item) => acc + (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0),
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
            className="h-11 border-black/10 dark:border-white/10"
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
              className="h-11 border-black/10 dark:border-white/10"
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
              className="h-11 border-black/10 dark:border-white/10"
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
          className="h-11 border-black/10 dark:border-white/10"
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
            className="h-8 gap-1 text-[10px] uppercase font-bold rounded-full border-black/10 dark:border-white/10"
          >
            <Plus className="h-3 w-3" /> Adicionar
          </Button>
        </div>

        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex flex-col gap-3 rounded-md bg-black/5 p-3 dark:bg-white/5 border border-black/5 dark:border-white/5"
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
                  className="w-full h-10 rounded-md border border-black/10 bg-background px-3 text-sm dark:border-white/10"
                >
                  <option value="" disabled>
                    Selecione...
                  </option>
                  {inventory.map((inv: InventoryItem) => (
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
                  className="h-10 border-black/10 dark:border-white/10"
                />
              </div>

              {/* Preço + Quantidade */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-[9px] uppercase opacity-50">
                    Preço (R$)
                  </Label>
                  <Input
                    type="text"
                    placeholder="R$ 0,00"
                    value={item.price && !isNaN(parseFloat(item.price)) ? formatBRL(parseFloat(item.price)) : ""}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/\D/g, "");
                      if (!rawValue) {
                        updateItem(index, "price", "");
                        return;
                      }
                      const numericValue = (parseInt(rawValue) / 100).toString();
                      updateItem(index, "price", numericValue);
                    }}
                    required
                    className="h-10 border-black/10 dark:border-white/10"
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
                    onFocus={(e) => e.target.select()}
                    onChange={(e) =>
                      updateItem(
                        index,
                        "quantity",
                        e.target.value
                      )
                    }
                    required
                    className="h-10 border-black/10 dark:border-white/10"
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
                  className="h-9 px-4 rounded-full"
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
          className="min-h-[80px] resize-none rounded-sm border-black/10 dark:border-white/10"
        />
      </div>

      <Button
        type="submit"
        className="h-14 w-full font-black uppercase tracking-widest bg-primary text-primary-foreground shadow-lg hover:shadow-primary/20 transition-all"
      >
        {initialData ? "Salvar Alterações" : "Finalizar Pedido"}{" "}
        {total > 0 && `• ${formatBRL(total)}`}
      </Button>
    </form>
  )
}