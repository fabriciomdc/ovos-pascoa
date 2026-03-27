import {
  collection,
  doc,
  setDoc,
  increment,
  writeBatch,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { InventoryItem } from "@/types/inventory"

export const inventoryService = {
  getCollectionRef: (userId: string) =>
    collection(db, "users", userId, "inventory"),

  getDocRef: (userId: string, itemId: string) =>
    doc(db, "users", userId, "inventory", itemId),

  async updateQuantity(userId: string, itemId: string, item: InventoryItem, delta: number) {
    const itemRef = this.getDocRef(userId, itemId)
    await setDoc(
      itemRef,
      {
        name: item.name,
        category: item.category,
        quantity: increment(delta),
        userId,
      },
      { merge: true }
    )
  },

  async setQuantity(userId: string, itemId: string, item: InventoryItem, value: number) {
    const itemRef = this.getDocRef(userId, itemId)
    await setDoc(
      itemRef,
      {
        name: item.name,
        category: item.category,
        quantity: value,
        userId,
      },
      { merge: true }
    )
  },

  async deductQuantities(
    userId: string,
    itemsToDeduct: { inventoryItemId: string; quantity: number }[],
    currentInventory: InventoryItem[]
  ) {
    const batch = writeBatch(db)

    for (const item of itemsToDeduct) {
      if (!item.inventoryItemId) continue

      const currentItem = currentInventory.find((i) => i.id === item.inventoryItemId)
      if (currentItem) {
        const itemRef = this.getDocRef(userId, item.inventoryItemId)
        const newQty = Math.max(0, currentItem.quantity - item.quantity)
        batch.update(itemRef, { quantity: newQty })
      }
    }

    await batch.commit()
  },
}
