import ProductCard from "../ui/ProductCard"
import type { Product } from "../../types/product"

type ProductGridProps = {
  products: Product[]
  onSelect: (product: Product) => void
}

export default function ProductGrid({
  products,
  onSelect,
}: ProductGridProps) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}