import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Order } from "@/types/order"

export const orderService = {
  getCollectionRef: (userId: string) =>
    collection(db, "users", userId, "orders"),

  getDocRef: (userId: string, orderId: string) =>
    doc(db, "users", userId, "orders", orderId),

  async addOrder(userId: string, order: Order) {
    const docRef = doc(this.getCollectionRef(userId), order.id)
    await setDoc(docRef, { ...order, userId })
  },

  async updateOrder(userId: string, order: Order) {
    const docRef = this.getDocRef(userId, order.id)
    await setDoc(docRef, order)
  },

  async deleteOrder(userId: string, orderId: string) {
    const docRef = this.getDocRef(userId, orderId)
    await deleteDoc(docRef)
  },

  async updateStatus(userId: string, orderId: string, status: Order["status"]) {
    const docRef = this.getDocRef(userId, orderId)
    await updateDoc(docRef, { status })
  },
}
