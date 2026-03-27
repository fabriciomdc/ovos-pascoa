import { useState, useEffect } from "react"
import type { InventoryItem } from "@/types/inventory"
import { onSnapshot, query } from "firebase/firestore"
import { useAuth } from "@/contexts/auth-context"
import { inventoryService } from "@/services/inventory-service"

const INITIAL_INVENTORY: InventoryItem[] = [
  { id: "casca-150g", name: "Ovo de Colher 150g", category: "Ovos de Colher", quantity: 0 },
  { id: "casca-250g", name: "Ovo de Colher 250g", category: "Ovos de Colher", quantity: 0 },
  { id: "trufado-150g", name: "Ovo Trufado 150g", category: "Ovos Trufados", quantity: 0 },
  { id: "trufado-250g", name: "Ovo Trufado 250g", category: "Ovos Trufados", quantity: 0 },
  { id: "trio-ovinhos", name: "Trio de ovinhos", category: "Kits", quantity: 0 },
  { id: "kit-confeiteiro-masc", name: "Kit Confeiteiro Masculino", category: "Kits", quantity: 0 },
  { id: "kit-confeiteiro-fem", name: "Kit Confeiteiro Feminino", category: "Kits", quantity: 0 },
  { id: "mini-ovos-50g", name: "Mini ovos 50g", category: "Outros", quantity: 0 },
]

export function useInventory() {
  const { user } = useAuth()
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setInventory(INITIAL_INVENTORY)
      setLoading(false)
      return
    }

    const q = query(inventoryService.getCollectionRef(user.uid))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setLoading(false)
      const fetched = snapshot.docs.map(d => ({ ...d.data(), id: d.id }) as InventoryItem)
      
      const merged = INITIAL_INVENTORY.map(initItem => {
        const dbItem = fetched.find(f => f.id === initItem.id)
        return dbItem ? { ...initItem, ...dbItem } : initItem
      })

      const extraItems = fetched.filter(f => !INITIAL_INVENTORY.some(i => i.id === f.id))
      
      setInventory([...merged, ...extraItems])
    }, (error) => {
      console.error("Erro no onSnapshot do estoque:", error)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [user])

  const updateQuantity = async (id: string, delta: number) => {
    if (!user) return
    const localItem = inventory.find(i => i.id === id)
    if (localItem) {
      try {
        await inventoryService.updateQuantity(user.uid, id, localItem, delta)
      } catch (error) {
        console.error("Erro ao atualizar quantidade:", error)
      }
    }
  }

  const setQuantity = async (id: string, value: number) => {
    if (!user) return
    const localItem = inventory.find(i => i.id === id)
    if (localItem) {
      try {
        await inventoryService.setQuantity(user.uid, id, localItem, value)
      } catch (error) {
        console.error("Erro ao definir quantidade:", error)
      }
    }
  }

  const deductQuantities = async (itemsToDeduct: { inventoryItemId: string; quantity: number }[]) => {
    if (!user) return
    try {
      await inventoryService.deductQuantities(user.uid, itemsToDeduct, inventory)
    } catch (error) {
      console.error("Erro ao deduzir quantidades:", error)
    }
  }

  return { inventory, loading, updateQuantity, setQuantity, deductQuantities }
}
