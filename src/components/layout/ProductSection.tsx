import CategoryFilter from "../ui/CategoryFilter"
import ProductGrid from "../products/ProductGrid"
import type { Product } from "../../types/product"

type ProductSectionProps = {
  title: string
  categories: string[]
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  products: Product[]
  onSelect: (product: Product) => void
}

export default function ProductSection({
  title,
  categories,
  selectedCategory,
  setSelectedCategory,
  products,
  onSelect,
}: ProductSectionProps) {
  return (
    <>
      <h2 className="text-3xl font-semibold text-[#4E5A4A] mb-8">
        {title}
      </h2>

      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <ProductGrid products={products} onSelect={onSelect} />
    </>
  )
}