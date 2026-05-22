import { useEffect, useMemo, useState } from "react"
import { createClient } from '@supabase/supabase-js'
import type { Product } from "../types/product"

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

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
        setError(error.message)
        setProducts([])
      } else {
        setProducts((data ?? []) as Product[])
      }

      setLoading(false)
    }

    fetchProducts()
  }, [])

  const { giftProducts, fixedProducts } = useMemo(() => {
    return {
      giftProducts: products.filter(
        (p): p is Extract<Product, { type: "gift" }> => p.type === "gift"
      ),
      fixedProducts: products.filter(
        (p): p is Extract<Product, { type: "fixed" }> => p.type === "fixed"
      ),
    }
  }, [products])

  const categories = useMemo(() => {
    const cats = fixedProducts.map(p => p.category)
    return ["Todos", ...Array.from(new Set(cats))]
  }, [fixedProducts])

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

    return [...giftProducts, ...sorted]
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