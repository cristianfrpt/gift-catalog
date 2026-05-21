import ProductModal from "./ProductModal"
import type { Product } from "../../types/product"

type ProductModalContainerProps = {
  selectedProduct: Product | null
  setSelectedProduct: (product: Product | null) => void
}

export default function ProductModalContainer({
  selectedProduct,
  setSelectedProduct,
}: ProductModalContainerProps) {
  if (!selectedProduct) return null

  return (
    <ProductModal
      product={selectedProduct}
      onClose={() => setSelectedProduct(null)}
    />
  )
}