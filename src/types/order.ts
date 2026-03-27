export type OrderStatus = "Pending" | "Ready" | "Delivered"

export interface OrderItem {
  id: string
  inventoryItemId: string
  productName: string
  flavor: string
  price: number
  quantity: number
}

export interface Order {
  id: string
  customerName: string
  deliveryDate: string
  deliveryTime: string
  address: string
  description: string
  orderDate: string
  status: OrderStatus
  items: OrderItem[]
  totalPrice: number
  userId: string
}
