import { useState } from "react"
import { format } from "date-fns"
import { Header } from "@/components/layout/header"
import { OrderList } from "@/components/orders/order-list"
import { useOrders } from "@/hooks/use-orders"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { InventoryList } from "@/components/inventory/inventory-list"
import { useInventory } from "@/hooks/use-inventory"
import type { Order } from "@/types/order"

export function Home() {
  const { orders, addOrder, updateStatus, deleteOrder, updateOrder } =
    useOrders()
  const { inventory, updateQuantity, setQuantity } = useInventory()
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)

  const handleEdit = (order: Order) => {
    setEditingOrder(order)
    setIsModalOpen(true)
  }

  const handleCloseModal = (open: boolean) => {
    setIsModalOpen(open)
    if (!open) {
      setEditingOrder(null)
    }
  }

  const filteredOrders = date
    ? orders.filter((o) => o.deliveryDate === format(date, "yyyy-MM-dd"))
    : orders

  return (
    <div className="relative mx-auto max-w-[1100px] space-y-6 md:space-y-10">
      <Header
        date={date}
        setDate={setDate}
        isModalOpen={isModalOpen}
        setIsModalOpen={handleCloseModal}
        onAddOrder={editingOrder ? updateOrder : addOrder}
        editingOrder={editingOrder}
      />

      <Tabs defaultValue="pedidos" className="w-full space-y-6">
        <div className="flex justify-center">
          <TabsList className="h-auto bg-white/60 dark:bg-white/5 backdrop-blur-md rounded-sm p-1.5 border border-black/5 dark:border-white/5 shadow-sm">
            <TabsTrigger value="pedidos" className="rounded-sm px-8 py-2.5 text-sm font-bold tracking-wide data-[active]:bg-[#a8dadc] data-[active]:text-[#1d3557] dark:data-[active]:bg-[#d4af37] dark:data-[active]:text-[#1a120b]">
              Pedidos
            </TabsTrigger>
            <TabsTrigger value="estoque" className="rounded-sm px-8 py-2.5 text-sm font-bold tracking-wide data-[active]:bg-[#a8dadc] data-[active]:text-[#1d3557] dark:data-[active]:bg-[#d4af37] dark:data-[active]:text-[#1a120b]">
              Estoque
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="pedidos" className="outline-none">
          <main className="relative overflow-hidden rounded-sm border border-black/5 bg-white/60 p-3 backdrop-blur-xl md:p-6 dark:border-white/5 dark:bg-white/5">
            <div className="pointer-events-none absolute inset-0 opacity-[0.04] dark:opacity-[0.06]" />
            <OrderList
              orders={filteredOrders}
              onUpdateStatus={updateStatus}
              onDelete={deleteOrder}
              onEdit={handleEdit}
            />
          </main>
        </TabsContent>

        <TabsContent value="estoque" className="outline-none">
          <main className="relative overflow-hidden rounded-sm border border-black/5 bg-white/60 p-5 backdrop-blur-xl md:p-8 dark:border-white/5 dark:bg-white/5">
            <div className="pointer-events-none absolute inset-0 opacity-[0.04] dark:opacity-[0.06]" />
            <div className="mb-6 relative z-10">
              <h2 className="text-2xl font-black text-[#5c4b3b] dark:text-[#e7c27d]">Gestão de Estoque</h2>
              <p className="text-sm text-muted-foreground mt-1">Gerencie a quantidade das bases e kits que serão utilizados para montar os pedidos.</p>
            </div>
            <div className="relative z-10">
              <InventoryList
                inventory={inventory}
                onUpdateQuantity={updateQuantity}
                onSetQuantity={setQuantity}
              />
            </div>
          </main>
        </TabsContent>
      </Tabs>
    </div>
  )
}
