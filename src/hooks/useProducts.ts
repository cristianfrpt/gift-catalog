import { useEffect, useMemo, useState } from "react"
import { supabase } from "../lib/supabase"
import type { Product } from "../types/product"

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedCategory, setSelectedCategory] = useState("Todos")

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from("products")
        .select("*")

      if (error) {
        console.error(error)
        setError(error.message)
        setProducts([])
      } else {
        setProducts((data as Product[]) || [])
      }

      setLoading(false)
    }

    fetchProducts()
  }, [])

  const categories = useMemo(() => {
    return ["Todos", ...new Set(products.map(p => p.category))]
  }, [products])

   const filteredProducts = useMemo(() => {
    const base =
      selectedCategory === "Todos"
        ? products
        : products.filter(p => p.category === selectedCategory)

    const featured = base.find(p => p.id === 55)
    const rest = base.filter(p => p.id !== 55)

    const sorted = rest
      .map(p => ({
        ...p,
        weight: p.price * 0.1 + Math.random() * 250,
      }))
      .sort((a, b) => a.weight - b.weight)

    return featured ? [featured, ...sorted] : sorted
  }, [products, selectedCategory])

  return {
    products,
    filteredProducts,
    categories,
    selectedCategory,
    setSelectedCategory,
    loading,
    error,
  }
}