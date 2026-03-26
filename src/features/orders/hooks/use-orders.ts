import type { Order } from "@/features/orders/types"
import { useState, useEffect } from "react"
import { collection, onSnapshot, doc, setDoc, updateDoc, deleteDoc, query } from "firebase/firestore"
import { db } from "@/lib/firebase"

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, "orders"))
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedOrders = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as Order[]
      
      fetchedOrders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
      
      setOrders(fetchedOrders)
      setLoading(false)
    }, (error) => {
      console.error("Erro ao buscar pedidos:", error)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const addOrder = async (newOrder: Order) => {
    try {
      await setDoc(doc(db, "orders", newOrder.id), newOrder)
    } catch (error) {
      console.error("Erro ao adicionar pedido:", error)
      alert("Erro ao adicionar pedido no banco.")
    }
  }

  const deleteOrder = async (id: string) => {
    try {
      await deleteDoc(doc(db, "orders", id))
    } catch (error) {
      console.error("Erro ao deletar pedido:", error)
    }
  }

  const updateStatus = async (id: string, status: Order["status"]) => {
    try {
      await updateDoc(doc(db, "orders", id), { status })
    } catch (error) {
      console.error("Erro ao atualizar status:", error)
    }
  }

  return { orders, loading, addOrder, deleteOrder, updateStatus }
}
