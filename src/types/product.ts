export type FixedProduct = {
  id: number
  name: string
  category: string
  price: number
  image: string
  available: boolean
  type: "fixed"
}

export type GiftProduct = {
  id: number
  name: string
  image: string
  available: boolean
  type: "gift"
  price?: never
  category?: never
}

export type Product = FixedProduct | GiftProduct