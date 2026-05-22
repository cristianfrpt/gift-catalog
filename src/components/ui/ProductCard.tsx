import type { Product } from "../../types/product"

type ProductCardProps = {
  product: Product
  onSelect: (product: Product) => void
}

export default function ProductCard({
  product,
  onSelect,
}: ProductCardProps) {
  const isUnavailable = !product.available

  return (
    <div
      onClick={() => {
        if (isUnavailable) return
        onSelect(product)
      }}
      tabIndex={-1}
      className={`
        bg-white rounded-2xl shadow-sm p-2 sm:p-4
        transition-all duration-300 ease-out transform
        flex flex-col h-full
        select-none caret-transparent

        ${
          isUnavailable
            ? "opacity-40 cursor-not-allowed"
            : "hover:shadow-xl hover:-translate-y-1 cursor-pointer"
        }
      `}
    >
      <div className="aspect-square w-full bg-[#E8E2DA] rounded-xl mb-2 sm:mb-4 overflow-hidden">
        <img
          src={`/images/products/${product.image}`}
          alt={product.name}
          className="w-full h-full object-cover"
          draggable={false}
        />
      </div>

      <div className="flex flex-col flex-1">
        <h3 className="text-xs sm:text-base font-medium text-[#4E5A4A] leading-tight">
          {product.name}
        </h3>

        {isUnavailable && (
          <p className="text-[10px] sm:text-sm text-red-400 mt-1">
            Indisponível
          </p>
        )}

        <div className="mt-auto pt-2">
          {product.price != null && product.price > 0 ? (
            <p className="text-xs sm:text-sm text-[#6B7567]">
              R${" "}
              {product.price.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </p>
          ) : (
            <p className="text-xs sm:text-sm text-[#6B7567]">
              Valor livre 💚
            </p>
          )}
        </div>
      </div>
    </div>
  )
}