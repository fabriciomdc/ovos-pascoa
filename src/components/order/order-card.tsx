import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Trash2,
  CheckCircle2,
  MapPin,
  Clock,
  ImageIcon,
  Download,
} from "lucide-react"
import { useRef, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import type { Order, OrderStatus } from "@/types/order"
import { TicketCard } from "./ticket-card"
import { generateTicketImage } from "@/function/generate-ticket"

interface OrderCardProps {
  order: Order
  onUpdateStatus: (id: string, status: OrderStatus) => void
  onDelete: (id: string) => void
}

export function OrderCard({ order, onUpdateStatus, onDelete }: OrderCardProps) {
  const isDelivered = order.status === "Delivered"

  const ticketRef = useRef<HTMLDivElement>(null)

  const [preview, setPreview] = useState<string | null>(null)
  const [openPreview, setOpenPreview] = useState(false)

  const handleGenerate = async () => {
    if (!ticketRef.current) return

    const img = await generateTicketImage(ticketRef.current)

    setPreview(img)
    setOpenPreview(true)
  }

  const handleDownload = () => {
    if (!preview) return

    const safeName = order.customerName.replace(/\s+/g, "-").toLowerCase()

    const link = document.createElement("a")
    link.download = `pedido-${safeName}.png`
    link.href = preview
    link.click()
  }

  return (
    <>
      <Card
        className={`group relative overflow-hidden rounded-[1.8rem] border border-black/5 bg-white/60 backdrop-blur-xl transition-all duration-300 dark:border-white/5 dark:bg-white/5 ${
          isDelivered
            ? "opacity-60"
            : "hover:scale-[1.01] hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_10px_30px_rgba(0,0,0,0.4)]"
        }`}
      >
        <div className="pointer-events-none absolute -z-10 opacity-0">
          <TicketCard ref={ticketRef} order={order} />
        </div>

        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent" />
        </div>

        <CardContent className="relative p-4 md:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 flex-col gap-2">
              <div className="flex items-center gap-2 md:gap-3">
                <h3 className="text-sm font-black tracking-tight text-[#5c4b3b] uppercase md:text-base dark:text-[#f5e6c8]">
                  {order.customerName}
                </h3>

                <Button
                  size="icon"
                  variant="ghost"
                  className="h-9 w-9 rounded-full transition-all hover:scale-110 hover:bg-blue-500/10"
                  onClick={handleGenerate}
                >
                  <ImageIcon className="h-4 w-4" />
                </Button>

                <Badge
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                    isDelivered
                      ? "bg-green-500/10 text-green-600 dark:text-green-400"
                      : "bg-[#a8dadc]/30 text-[#1d3557] dark:bg-[#d4af37]/20 dark:text-[#e7c27d]"
                  }`}
                >
                  {isDelivered ? "Entregue" : "Pendente"}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground md:text-xs">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>
                    {order.deliveryDate} às {order.deliveryTime}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span className="max-w-[180px] truncate md:max-w-[240px]">
                    {order.address}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-black/5 pt-3 sm:border-none sm:pt-0 dark:border-white/5">
              <div className="line-clamp-1 flex-1 text-[11px] text-muted-foreground italic sm:hidden">
                {order.description}
              </div>

              <div className="flex items-center gap-1.5">
                {!isDelivered && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-9 w-9 rounded-full text-green-600 transition-all hover:scale-110 hover:bg-green-500/10 dark:text-green-400"
                    onClick={() => onUpdateStatus(order.id, "Delivered")}
                  >
                    <CheckCircle2 className="h-5 w-5" />
                  </Button>
                )}

                <Button
                  size="icon"
                  variant="ghost"
                  className="h-9 w-9 rounded-full text-muted-foreground transition-all hover:scale-110 hover:bg-red-500/10 hover:text-red-500"
                  onClick={() => onDelete(order.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-3 hidden rounded-xl bg-black/5 p-2 text-xs text-foreground/70 sm:block dark:bg-white/5">
            <span className="mr-2 text-[10px] font-bold uppercase opacity-50">
              Pedido:
            </span>
            {order.description}
          </div>
        </CardContent>
      </Card>

      <Dialog open={openPreview} onOpenChange={setOpenPreview}>
        <DialogContent className="max-w-[420px] rounded-[2rem] border-none bg-[#f9f6f0] p-4 dark:bg-[#1a120b]">
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-black tracking-wider text-[#5c4b3b] uppercase dark:text-[#e7c27d]">
              Preview do Ticket
            </DialogTitle>
          </DialogHeader>

          {preview && (
            <div className="space-y-4">
              <img
                src={preview}
                alt="preview"
                className="w-full rounded-xl shadow-md"
              />

              <Button
                onClick={handleDownload}
                className="w-full rounded-full bg-[#a8dadc] font-bold text-[#1d3557] hover:bg-[#a8dadc]/90 dark:bg-[#d4af37] dark:text-[#1a120b]"
              >
                <Download className="mr-2 h-4 w-4" />
                Baixar Imagem
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
