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
    itemsToDeduct: { inventoryItemId: string; quantity: number }[]
  ) {
    const batch = writeBatch(db)

    for (const item of itemsToDeduct) {
      if (!item.inventoryItemId) continue

      const itemRef = this.getDocRef(userId, item.inventoryItemId)
      batch.update(itemRef, { quantity: increment(-item.quantity) })
    }

    await batch.commit()
  },

  async restoreQuantities(
    userId: string,
    itemsToRestore: { inventoryItemId: string; quantity: number }[]
  ) {
    const batch = writeBatch(db)

    for (const item of itemsToRestore) {
      if (!item.inventoryItemId) continue

      const itemRef = this.getDocRef(userId, item.inventoryItemId)
      batch.update(itemRef, { quantity: increment(item.quantity) })
    }

    await batch.commit()
  },

  async adjustQuantities(
    userId: string,
    toRestore: { inventoryItemId: string; quantity: number }[],
    toDeduct: { inventoryItemId: string; quantity: number }[]
  ) {
    const batch = writeBatch(db)

    for (const item of toRestore) {
      if (!item.inventoryItemId) continue
      const itemRef = this.getDocRef(userId, item.inventoryItemId)
      batch.update(itemRef, { quantity: increment(item.quantity) })
    }

    for (const item of toDeduct) {
      if (!item.inventoryItemId) continue
      const itemRef = this.getDocRef(userId, item.inventoryItemId)
      batch.update(itemRef, { quantity: increment(-item.quantity) })
    }

    await batch.commit()
  },
}
