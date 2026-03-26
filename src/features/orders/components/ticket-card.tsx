import { forwardRef } from "react"
import type { Order } from "@/features/orders/types"

export const TicketCard = forwardRef<HTMLDivElement, { order: Order }>(
  ({ order }, ref) => {
    return (
      <div
        ref={ref}
        className="w-[420px] rounded-2xl md:rounded-[2.5rem] bg-[#fff8e7] p-6 font-sans shadow-xl"
      >
        <div className="flex flex-col items-center text-center">
          <div className="mb-2 text-2xl">🐰</div>

          <h1 className="text-lg font-black tracking-wide text-[#d4a017]">
            FELIZ PÁSCOA
          </h1>
        </div>

        <div className="mt-4 rounded-xl md:rounded-[2rem] bg-white p-6 shadow-inner">
          <h2 className="text-center text-xl font-black text-[#5c4b3b]">
            Obrigado pelo seu pedido!
          </h2>

          <p className="mt-1 text-center text-sm text-[#8b7b6a]">
            Que sua Páscoa seja doce e alegre 💛
          </p>

          <div className="mt-5 space-y-2 text-sm">
            <div className="flex justify-between rounded-md bg-[#fff3cd] px-3 py-2">
              <span className="font-semibold text-[#5c4b3b]">Cliente</span>
              <span className="font-bold text-[#3a2e22]">
                {order.customerName}
              </span>
            </div>

            <div className="flex justify-between rounded-md bg-[#e0f7fa] px-3 py-2">
              <span className="font-semibold text-[#5c4b3b]">Entrega</span>
              <span className="font-bold text-[#3a2e22]">
                {order.deliveryDate}
              </span>
            </div>

            <div className="flex justify-between rounded-md bg-[#fde2e4] px-3 py-2">
              <span className="font-semibold text-[#5c4b3b]">Horário</span>
              <span className="font-bold text-[#3a2e22]">
                {order.deliveryTime}
              </span>
            </div>
          </div>

          <div className="mt-5 rounded-md bg-[#f9f6f0] p-4 text-sm text-[#4a3f35]">
            <span className="block text-xs font-bold uppercase opacity-60">
              Pedido
            </span>
            {order.items && order.items.length > 0 && (
              <div className="mb-3 mt-2 space-y-1 border-b border-[#4a3f35]/10 pb-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between font-medium">
                    <span>{item.quantity}x {item.productName} - {item.flavor}</span>
                    <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
            {order.description && (
              <p className="mt-1 font-medium leading-relaxed">
                {order.description}
              </p>
            )}
            {order.totalPrice !== undefined && order.totalPrice > 0 && (
              <div className="mt-3 flex justify-between text-base font-black text-[#5c4b3b]">
                <span>Total:</span>
                <span>R$ {order.totalPrice.toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 text-center text-xs text-[#a08f7c]">
          Feito com carinho 💝
        </div>
      </div>
    )
  }
)
