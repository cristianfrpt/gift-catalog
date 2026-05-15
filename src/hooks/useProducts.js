import { useMemo, useState } from "react"
import { products } from "../data/products"

export function useProducts() {
  const [selectedCategory, setSelectedCategory] = useState("Todos")

  const categories = useMemo(() => {
    return ["Todos", ...new Set(products.map(p => p.category))]
  }, [])

  const filteredProducts = useMemo(() => {
    return (selectedCategory === "Todos"
      ? products
      : products.filter(p => p.category === selectedCategory)
    ).sort((a, b) => {
      if (a.status === "available" && b.status !== "available") return -1
      if (a.status !== "available" && b.status === "available") return 1
      return a.price - b.price
    })
  }, [selectedCategory])

  return {
    selectedCategory,
    setSelectedCategory,
    categories,
    filteredProducts,
  }
}