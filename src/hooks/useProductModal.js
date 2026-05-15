import { useEffect, useState } from "react"

export function useProductModal() {
  const [selectedProduct, setSelectedProduct] = useState(null)

  useEffect(() => {
    function handleEsc(e) {
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