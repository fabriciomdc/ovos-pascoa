import { useState } from "react"
import { Plus, Calendar as CalendarIcon, X } from "lucide-react"
import { OrderForm } from "./components/order/order-form"
import { OrderList } from "./components/order/order-list"
import { ToogleTheme } from "./components/toogle-theme"
import { useOrders } from "./hooks/user-orders"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function App() {
  const { orders, addOrder, updateStatus, deleteOrder, seedOrders } =
    useOrders()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredOrders = date
    ? orders.filter((o) => o.deliveryDate === format(date, "yyyy-MM-dd"))
    : orders

  return (
    <div className="min-h-screen bg-[#f5efe6] px-3 py-4 transition-all duration-500 md:px-6 md:py-8 dark:bg-[#1a120b]">
      <div className="relative mx-auto max-w-[1100px] space-y-6 md:space-y-10">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-black tracking-tight text-[#5c4b3b] md:text-3xl dark:text-[#e7c27d]">
            Ovos de Páscoa
          </h1>

          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <Popover>
              <PopoverTrigger>
                <Button
                  variant="outline"
                  className="h-10 rounded-full border-black/10 bg-white/60 px-4 backdrop-blur-md hover:bg-white/80 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                  <span className="text-sm text-[#5c4b3b] dark:text-[#f5e6c8]">
                    {date ? format(date, "PPP", { locale: ptBR }) : "Todos"}
                  </span>
                </Button>
              </PopoverTrigger>

              <PopoverContent
                className="w-auto rounded-[2rem] border-none p-0 shadow-2xl"
                align="end"
              >
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>

            {date && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDate(undefined)}
                className="h-10 w-10 rounded-full hover:bg-red-500/10"
              >
                <X className="h-4 w-4" />
              </Button>
            )}

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger>
                <Button className="h-10 rounded-full bg-[#a8dadc] px-5 text-sm font-bold text-[#1d3557] shadow-[0_0_25px_rgba(168,218,220,0.5)] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(168,218,220,0.7)] dark:bg-[#d4af37] dark:text-[#1a120b] dark:shadow-[0_0_25px_rgba(212,175,55,0.4)]">
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Pedido
                </Button>
              </DialogTrigger>

              <DialogContent className="rounded-sm border-none bg-[#f5efe6] p-6 shadow-2xl md:p-8 dark:bg-[#251a14]">
                <DialogHeader>
                  <DialogTitle className="mb-2 text-xl font-black tracking-widest text-[#5c4b3b] uppercase dark:text-[#e7c27d]">
                    Novo Pedido
                  </DialogTitle>
                </DialogHeader>

                <OrderForm
                  onAddOrder={(order) => {
                    addOrder(order)
                    setIsModalOpen(false)
                  }}
                />
              </DialogContent>
            </Dialog>

            <Button
              variant="ghost"
              onClick={seedOrders}
              className="rounded-full px-3 text-sm text-[#a8dadc] hover:bg-[#a8dadc]/10 dark:text-green-400"
            >
              Girar
            </Button>

            <ToogleTheme />
          </div>
        </header>

        <main className="relative overflow-hidden rounded-[2.5rem] border border-black/5 bg-white/60 p-3 backdrop-blur-xl md:p-6 dark:border-white/5 dark:bg-white/5">
          <div className="pointer-events-none absolute inset-0 opacity-[0.04] dark:opacity-[0.06]" />

          <OrderList
            orders={filteredOrders}
            onUpdateStatus={updateStatus}
            onDelete={deleteOrder}
          />
        </main>
      </div>
    </div>
  )
}
