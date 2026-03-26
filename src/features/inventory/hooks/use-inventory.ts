import { useState, useEffect } from "react"
import type { InventoryItem } from "../types"
import { collection, onSnapshot, doc, setDoc, increment, writeBatch } from "firebase/firestore"
import { db } from "@/lib/firebase"

const INITIAL_INVENTORY: InventoryItem[] = [
  { id: "casca-150g", name: "Casca 150g", category: "Cascas", quantity: 0 },
  { id: "casca-250g", name: "Casca 250g", category: "Cascas", quantity: 0 },
  { id: "trufado-150g", name: "Ovo Trufado 150g", category: "Ovos Trufados", quantity: 0 },
  { id: "trufado-250g", name: "Ovo Trufado 250g", category: "Ovos Trufados", quantity: 0 },
  { id: "trio-ovinhos", name: "Trio de ovinhos", category: "Kits", quantity: 0 },
  { id: "kit-confeiteiro", name: "Kit Confeiteiro", category: "Kits", quantity: 0 },
  { id: "mini-ovos-50g", name: "Mini ovos 50g", category: "Outros", quantity: 0 },
]

export function useInventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "inventory"), (snapshot) => {
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
  }, [])

  const updateQuantity = async (id: string, delta: number) => {
    try {
      const itemRef = doc(db, "inventory", id)
      const localItem = inventory.find(i => i.id === id)
      
      if (localItem) {
        await setDoc(itemRef, { 
          id: localItem.id,
          name: localItem.name,
          category: localItem.category,
          quantity: increment(delta) 
        }, { merge: true })
      }
    } catch (error) {
      console.error("Erro ao atualizar quantidade do estoque:", error)
    }
  }

  const deductQuantities = async (itemsToDeduct: { inventoryItemId: string; quantity: number }[]) => {
    try {
      const batch = writeBatch(db)
      
      for (const item of itemsToDeduct) {
        if (!item.inventoryItemId) continue
        
        const currentItem = inventory.find(i => i.id === item.inventoryItemId)
        if (currentItem) {
          const newQty = Math.max(0, currentItem.quantity - item.quantity)
          batch.update(doc(db, "inventory", item.inventoryItemId), { quantity: newQty })
        }
      }
      
      await batch.commit()
    } catch (error) {
      console.error("Erro ao deduzir quantidades do estoque em lote:", error)
    }
  }

  return { inventory, loading, updateQuantity, deductQuantities }
}
