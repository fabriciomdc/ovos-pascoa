export type OrderStatus = "Pending" | "Ready" | "Delivered"

export interface Order {
  id: string
  customerName: string
  orderDate: string
  deliveryDate: string
  deliveryTime: string
  address: string
  description: string
  status: OrderStatus
}
