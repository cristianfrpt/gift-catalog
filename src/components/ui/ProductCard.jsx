function ProductCard({ product, onSelect }) {
  const isUnavailable = !product.available

  return (
    <div
      onClick={() => {
        if (isUnavailable) return
        onSelect(product)
      }}
      className={`
        bg-white rounded-2xl shadow-sm p-4
        transition-all duration-300 ease-out transform

        ${isUnavailable
          ? "opacity-40 cursor-not-allowed"
          : "hover:shadow-xl hover:-translate-y-1 cursor-pointer"
        }
      `}
    >
      <div className="aspect-square w-full bg-[#E8E2DA] rounded-xl mb-4 overflow-hidden">
        <img
          src={`/images/products/${product.image}`}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      <h3 className="text-xl font-medium text-[#4E5A4A]">
        {product.name}
      </h3>

      {isUnavailable && (
        <p className="text-sm text-red-400 mt-1">
          Indisponível
        </p>
      )}

      <p className="text-[#6B7567] mt-2">
        R$ {product.price.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
        })}
      </p>
    </div>
  )
}

export default ProductCard