import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search, Package, Clock, CheckCheck } from "lucide-react"
import { OrderCard } from "./order-card"
import type { Order } from "@/features/orders/types"
import OvoPng from "@/assets/ovo.png"

interface OrderListProps {
  orders: Order[]
  onUpdateStatus: (id: string, status: Order["status"]) => void
  onDelete: (id: string) => void
}

export function OrderList({
  orders,
  onUpdateStatus,
  onDelete,
}: OrderListProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredOrders = orders.filter((order) =>
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const pending = filteredOrders.filter((o) => o.status === "Pending")
  const delivered = filteredOrders.filter((o) => o.status === "Delivered")

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="group relative">
        <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground/50 transition-all group-focus-within:text-primary" />
        <Input
          placeholder="Buscar cliente..."
          className="h-11 rounded-sm border border-black/5 bg-white/60 pl-10 text-sm backdrop-blur-md transition-all focus-visible:ring-2 focus-visible:ring-primary/30 dark:border-white/5 dark:bg-white/5"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-2 border border-black/5 bg-[#efe7dc] backdrop-blur-md dark:border-white/5 dark:bg-white/5">
          <TabsTrigger
            value="pending"
            className="flex items-center justify-center data-[state=active]:bg-[#a8dadc]/40 data-[state=active]:text-[#1d3557] data-[state=active]:shadow-[0_0_15px_rgba(168,218,220,0.4)] dark:data-[state=active]:bg-[#d4af37]/20 dark:data-[state=active]:text-[#e7c27d] dark:data-[state=active]:shadow-[0_0_20px_rgba(212,175,55,0.3)]"
          >
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">
              Pendentes ({pending.length})
            </span>
            <span className="sm:hidden">{pending.length}</span>
          </TabsTrigger>

          <TabsTrigger
            value="delivered"
            className="flex items-center justify-center data-[state=active]:bg-[#a8dadc]/40 data-[state=active]:text-[#1d3557] data-[state=active]:shadow-[0_0_15px_rgba(168,218,220,0.4)] dark:data-[state=active]:bg-[#d4af37]/20 dark:data-[state=active]:text-[#e7c27d] dark:data-[state=active]:shadow-[0_0_20px_rgba(212,175,55,0.3)]"
          >
            <CheckCheck className="h-4 w-4" />
            <span className="hidden sm:inline">
              Entregues ({delivered.length})
            </span>
            <span className="sm:hidden">{delivered.length}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6 space-y-3 md:space-y-4">
          {pending.length > 0 ? (
            pending.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onUpdateStatus={onUpdateStatus}
                onDelete={onDelete}
              />
            ))
          ) : (
            <EmptyState message="Nenhum pedido pendente" type="pending" />
          )}
        </TabsContent>

        <TabsContent value="delivered" className="mt-6 space-y-3 md:space-y-4">
          {delivered.length > 0 ? (
            delivered.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onUpdateStatus={onUpdateStatus}
                onDelete={onDelete}
              />
            ))
          ) : (
            <EmptyState message="Histórico vazio" type="delivered" />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function EmptyState({
  message,
  type,
}: {
  message: string
  type: "pending" | "delivered"
}) {
  return (
    <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-sm border border-black/5 bg-white/40 px-6 py-12 text-center backdrop-blur-xl dark:border-white/5 dark:bg-white/5">
      <div className="pointer-events-none absolute inset-0 opacity-[0.05]" />

      <div className="relative mb-6">
        <div className="absolute inset-0 rounded-sm bg-primary/20 blur-2xl" />

        {type === "pending" ? (
          <img
            src={OvoPng}
            alt="Ovo"
            className="relative h-40 w-40 object-contain opacity-90 md:h-56 md:w-56"
          />
        ) : (
          <Package className="relative h-40 w-40 object-contain opacity-90 md:h-56 md:w-56" />
        )}
      </div>

      <h3 className="text-lg font-bold text-foreground/80 md:text-xl">
        Comece adicionando pedidos
      </h3>

      <p className="mt-1 text-sm text-muted-foreground">{message}</p>
    </div>
  )
}
