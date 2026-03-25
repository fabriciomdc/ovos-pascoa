import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Order } from "@/features/orders/types"

interface OrderFormProps {
  onAddOrder: (order: Order) => void
}

export function OrderForm({ onAddOrder }: OrderFormProps) {
  const [formData, setFormData] = useState({
    customerName: "",
    deliveryDate: "",
    deliveryTime: "",
    address: "",
    description: "",
  })

  const today = new Date().toLocaleDateString("pt-BR")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAddOrder({
      ...formData,
      id: crypto.randomUUID(),
      orderDate: today,
      status: "Pending",
    })
    setFormData({
      customerName: "",
      deliveryDate: "",
      deliveryTime: "",
      address: "",
      description: "",
    })
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
        <div className="space-y-1.5">
          <Label className="ml-1 text-[11px] font-black tracking-widest text-[#5c4b3b]/70 uppercase dark:text-[#e7c27d]/70">
            Nome do Cliente
          </Label>
          <Input
            value={formData.customerName}
            onChange={(e) =>
              setFormData({ ...formData, customerName: e.target.value })
            }
            required
            placeholder="Ex: Fabricio"
            className="h-12 rounded-2xl border border-black/5 bg-white/60 px-4 text-sm backdrop-blur-md placeholder:text-muted-foreground/40 focus-visible:ring-2 focus-visible:ring-primary/30 dark:border-white/5 dark:bg-white/5"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="ml-1 text-[11px] font-black tracking-widest text-[#5c4b3b]/70 uppercase dark:text-[#e7c27d]/70">
              Data
            </Label>
            <Input
              type="date"
              value={formData.deliveryDate}
              onChange={(e) =>
                setFormData({ ...formData, deliveryDate: e.target.value })
              }
              required
              className="h-12 rounded-2xl border border-black/5 bg-white/60 px-4 backdrop-blur-md focus-visible:ring-2 focus-visible:ring-primary/30 dark:border-white/5 dark:bg-white/5"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="ml-1 text-[11px] font-black tracking-widest text-[#5c4b3b]/70 uppercase dark:text-[#e7c27d]/70">
              Horário
            </Label>
            <Input
              type="time"
              value={formData.deliveryTime}
              onChange={(e) =>
                setFormData({ ...formData, deliveryTime: e.target.value })
              }
              required
              className="h-12 rounded-2xl border border-black/5 bg-white/60 px-4 backdrop-blur-md focus-visible:ring-2 focus-visible:ring-primary/30 dark:border-white/5 dark:bg-white/5"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="ml-1 text-[11px] font-black tracking-widest text-[#5c4b3b]/70 uppercase dark:text-[#e7c27d]/70">
            Endereço
          </Label>
          <Input
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            required
            placeholder="Rua, número e bairro"
            className="h-12 rounded-2xl border border-black/5 bg-white/60 px-4 text-sm backdrop-blur-md placeholder:text-muted-foreground/40 focus-visible:ring-2 focus-visible:ring-primary/30 dark:border-white/5 dark:bg-white/5"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="ml-1 text-[11px] font-black tracking-widest text-[#5c4b3b]/70 uppercase dark:text-[#e7c27d]/70">
            Pedido
          </Label>
          <Textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
            placeholder="Ex: 2 ovos de colher, 1 trufado..."
            className="min-h-[100px] resize-none rounded-sm border border-black/5 bg-white/60 p-4 text-sm backdrop-blur-md placeholder:text-muted-foreground/40 focus-visible:ring-2 focus-visible:ring-primary/30 dark:border-white/5 dark:bg-white/5"
          />
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            className="h-14 w-full rounded-full bg-[#a8dadc] text-sm font-black tracking-widest text-[#1d3557] uppercase shadow-[0_0_25px_rgba(168,218,220,0.5)] transition-all hover:scale-[1.02] hover:shadow-[0_0_35px_rgba(168,218,220,0.7)] active:scale-[0.98] dark:bg-[#d4af37] dark:text-[#1a120b] dark:shadow-[0_0_25px_rgba(212,175,55,0.4)]"
          >
            Confirmar Pedido
          </Button>
        </div>
      </form>
    </div>
  )
}
