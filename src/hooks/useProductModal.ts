import { useEffect, useState } from "react"

export type Product = {
  id: string | number
  name: string
  price: number
  image: string
  type?: string
}

export function useProductModal() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setSelectedProduct(null)
      }
    }

    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [])

  useEffect(() => {
    document.body.style.overflow = selectedProduct ? "hidden" : "auto"

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [selectedProduct])

  return {
    selectedProduct,
    setSelectedProduct,
  }
}