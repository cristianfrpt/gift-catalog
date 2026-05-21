function ProductCard({ product, onSelect }) {
  const isUnavailable = !product.available

  return (
    <div
      onClick={() => {
        if (isUnavailable) return
        onSelect(product)
      }}
      className={`
        bg-white rounded-2xl shadow-sm p-2 sm:p-4
        transition-all duration-300 ease-out transform
        flex flex-col h-full

        ${isUnavailable
          ? "opacity-40 cursor-not-allowed"
          : "hover:shadow-xl hover:-translate-y-1 cursor-pointer"
        }
      `}
    >
      {/* IMAGEM */}
      <div className="aspect-square w-full bg-[#E8E2DA] rounded-xl mb-2 sm:mb-4 overflow-hidden">
        <img
          src={`/images/products/${product.image}`}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* CONTEÚDO */}
      <div className="flex flex-col flex-1">
        <h3 className="text-xs sm:text-base font-medium text-[#4E5A4A] leading-tight">
          {product.name}
        </h3>

        {isUnavailable && (
          <p className="text-[10px] sm:text-sm text-red-400 mt-1">
            Indisponível
          </p>
        )}

        {/* EMPURRA O PREÇO PRA BAIXO */}
        <div className="mt-auto pt-2">
          <p className="text-xs sm:text-sm text-[#6B7567]">
            R$ {product.price.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}
          </p>
        </div>
      </div>
    </div>
  )
}

export default ProductCard