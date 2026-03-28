import { useState, useEffect } from "react"
import type { Order } from "@/types/order"
import { onSnapshot, query, orderBy } from "firebase/firestore"
import { useAuth } from "@/contexts/auth-context"
import { orderService } from "@/services/order-service"
import { inventoryService } from "@/services/inventory-service"

export function useOrders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setOrders([])
      setLoading(false)
      return
    }

    const q = query(
      orderService.getCollectionRef(user.uid),
      orderBy("deliveryDate", "desc")
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedOrders = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as Order[]
        setOrders(fetchedOrders)
        setLoading(false)
      },
      (error) => {
        console.error("Erro ao buscar pedidos:", error)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [user])

  const addOrder = async (order: Order) => {
    if (!user) return
    try {
      await orderService.addOrder(user.uid, order)
    } catch (error) {
      console.error("Erro ao adicionar pedido:", error)
    }
  }

  const deleteOrder = async (id: string) => {
    if (!user) return
    try {
      const orderToDelete = orders.find(o => o.id === id)
      if (orderToDelete && orderToDelete.items) {
        await inventoryService.restoreQuantities(user.uid, orderToDelete.items)
      }
      await orderService.deleteOrder(user.uid, id)
    } catch (error) {
      console.error("Erro ao deletar pedido:", error)
    }
  }

  const updateStatus = async (id: string, status: Order["status"]) => {
    if (!user) return
    try {
      await orderService.updateStatus(user.uid, id, status)
    } catch (error) {
      console.error("Erro ao atualizar status:", error)
    }
  }

  const updateOrder = async (updatedOrder: Order) => {
    if (!user) return
    try {
      await orderService.updateOrder(user.uid, updatedOrder)
    } catch (error) {
      console.error("Erro ao atualizar pedido:", error)
    }
  }

  return { orders, loading, addOrder, deleteOrder, updateStatus, updateOrder }
}
