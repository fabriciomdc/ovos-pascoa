import { Calendar as CalendarIcon, Plus, X, LogOut } from "lucide-react"
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

import { OrderForm } from "@/components/orders/order-form"
import { ToogleTheme } from "@/components/toogle-theme"
import { useAuth } from "@/contexts/auth-context"
import type { Order } from "@/types/order"

interface HeaderProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  isModalOpen: boolean
  setIsModalOpen: (open: boolean) => void
  onAddOrder: (order: Order) => void
  editingOrder?: Order | null
}

export function Header({
  date,
  setDate,
  isModalOpen,
  setIsModalOpen,
  onAddOrder,
  editingOrder,
}: HeaderProps) {
  const { logout } = useAuth()

  return (
    <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <h1 className="text-2xl font-black tracking-tight text-[#5c4b3b] md:text-3xl dark:text-[#e7c27d]">
        Ovos de Páscoa
      </h1>

      <div className="flex flex-wrap items-center gap-2 md:gap-3">
        <Popover>
          <PopoverTrigger>
            <Button
              variant="outline"
              className="h-10 rounded-md md:rounded-full border-black/10 bg-white/60 px-4 backdrop-blur-md hover:bg-white/80 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
              <span className="text-sm text-[#5c4b3b] dark:text-[#f5e6c8]">
                {date ? format(date, "PPP", { locale: ptBR }) : "Todos"}
              </span>
            </Button>
          </PopoverTrigger>

          <PopoverContent
            className="w-auto rounded-xl md:rounded-[2rem] border-none p-0 shadow-2xl"
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
            className="h-10 w-10 rounded-md md:rounded-full hover:bg-red-500/10"
          >
            <X className="h-4 w-4" />
          </Button>
        )}

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger>
            <Button className="h-10 rounded-md md:rounded-full bg-[#a8dadc] px-5 text-sm font-bold text-[#1d3557] shadow-[0_0_25px_rgba(168,218,220,0.5)] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(168,218,220,0.7)] dark:bg-[#d4af37] dark:text-[#1a120b] dark:shadow-[0_0_25px_rgba(212,175,55,0.4)]">
              <Plus className="mr-2 h-4 w-4" />
              Novo Pedido
            </Button>
          </DialogTrigger>

            <DialogContent className="w-[95%] !max-w-2xl max-h-[90vh] overflow-y-auto rounded-sm border-none bg-[#f5efe6] p-4 md:p-6 shadow-2xl dark:bg-[#251a14]">
            <DialogHeader>
              <DialogTitle className="mb-2 text-xl font-black tracking-widest text-[#5c4b3b] uppercase dark:text-[#e7c27d]">
                {editingOrder ? "Editar Pedido" : "Novo Pedido"}
              </DialogTitle>
            </DialogHeader>

            <OrderForm
              initialData={editingOrder}
              onAddOrder={(order) => {
                onAddOrder(order)
                setIsModalOpen(false)
              }}
            />
          </DialogContent>
        </Dialog>

        <ToogleTheme />
        <Button variant="ghost" size="icon" onClick={logout} className="h-10 w-10 hover:bg-red-500/10 hover:text-red-500" title="Sair">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
