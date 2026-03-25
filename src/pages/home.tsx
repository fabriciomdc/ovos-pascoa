import { useState } from "react"
import { format } from "date-fns"
import { Header } from "@/components/layout/header"
import { OrderList } from "@/features/orders/components/order-list"
import { useOrders } from "@/features/orders/hooks/use-orders"

export function Home() {
  const { orders, addOrder, updateStatus, deleteOrder, seedOrders } =
    useOrders()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredOrders = date
    ? orders.filter((o) => o.deliveryDate === format(date, "yyyy-MM-dd"))
    : orders

  return (
    <div className="relative mx-auto max-w-[1100px] space-y-6 md:space-y-10">
      <Header
        date={date}
        setDate={setDate}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        onAddOrder={addOrder}
        onSeedOrders={seedOrders}
      />

      <main className="relative overflow-hidden rounded-[2.5rem] border border-black/5 bg-white/60 p-3 backdrop-blur-xl md:p-6 dark:border-white/5 dark:bg-white/5">
        <div className="pointer-events-none absolute inset-0 opacity-[0.04] dark:opacity-[0.06]" />

        <OrderList
          orders={filteredOrders}
          onUpdateStatus={updateStatus}
          onDelete={deleteOrder}
        />
      </main>
    </div>
  )
}
