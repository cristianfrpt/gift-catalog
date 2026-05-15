import CategoryFilter from "../ui/CategoryFilter"
import ProductGrid from "../products/ProductGrid"

export default function ProductSection({
  title,
  categories,
  selectedCategory,
  setSelectedCategory,
  products,
  onSelect,
}) {
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

      <ProductGrid
        products={products}
        onSelect={onSelect}
      />
    </>
  )
}