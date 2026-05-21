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
  }, [products, selectedCategory])

    const giftProducts = useMemo(
      () => products.filter(p => p.type === "gift"),
      [products]
    )

    const fixedProducts = useMemo(
      () => products.filter(p => p.type !== "gift"),
      [products]
    )

    const filteredProducts = useMemo(() => {
      const base =
        selectedCategory === "Todos"
          ? fixedProducts
          : fixedProducts.filter(p => p.category === selectedCategory)

      const sorted = base
        .map(p => ({
          ...p,
          weight: p.price * 0.1 + Math.random() * 250,
        }))
        .sort((a, b) => a.weight - b.weight)

      return giftProducts.length > 0 ? [...giftProducts, ...sorted] : sorted
    }, [fixedProducts, giftProducts, selectedCategory])

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