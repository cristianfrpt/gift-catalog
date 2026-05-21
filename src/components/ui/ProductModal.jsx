import { useState } from "react"

export default function ProductModal({
  product,
  onClose,
  onCopyPix,
  copied,
}) {
  if (!product) return null
  const [pixData, setPixData] = useState(null)
  const [loadingPix, setLoadingPix] = useState(false)
  const [copiedPix, setCopiedPix] = useState(false)

  const generatePix = async () => {
    try {
      setLoadingPix(true)

      const response = await fetch("/api/pix", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          amount: product.price,
          description: product.name,
        }),
      })

      const data = await response.json()

      setPixData(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoadingPix(false)
    }
  }

  const handleCopyPix = async () => {
    if (!pixData?.qr_code) return

    await navigator.clipboard.writeText(
      pixData.qr_code
    )

    setCopiedPix(true)

    setTimeout(() => {
      setCopiedPix(false)
    }, 2000)
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4"
      onClick={onClose}
    >
      <div
        className="bg-[#F7F3EE] rounded-3xl max-w-sm w-full p-5 relative shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#5F6B5C] text-2xl"
        >
          ×
        </button>

        <div className="aspect-square w-full max-w-[220px] mx-auto bg-[#E8E2DA] rounded-2xl mb-5 mt-8 overflow-hidden">
          <img
            src={`/images/products/${product.image}`}
            alt={product.name}
            className="w-full h-full object-cover"
            draggable={false}
          />
        </div>

        <h2 className="text-2xl font-semibold text-[#4E5A4A] text-center">
          {product.name}
        </h2>

        <p className="mt-3 text-2xl font-semibold text-[#5F6B5C] text-center">
          R$ {product.price.toFixed(2)}
        </p>

        <div className="mt-6 flex flex-col items-center">

          {!pixData ? (
            <button
              onClick={generatePix}
              disabled={loadingPix}
              className="px-5 py-3 bg-[#5F6B5C] text-white rounded-xl text-sm hover:opacity-90 transition mb-6"
            >
              {loadingPix
                ? "Gerando PIX..."
                : "Presentear 💚"}
            </button>
          ) : (
            <>
              <div className="w-48 h-48 bg-white rounded-2xl shadow-sm overflow-hidden p-2">
                <img
                  src={`data:image/png;base64,${pixData.qr_code_base64}`}
                  alt="QR Code PIX"
                  className="w-full h-full object-contain"
                  draggable={false}
                />
              </div>

              <button
                onClick={handleCopyPix}
                className="mt-4 px-4 py-2 bg-[#5F6B5C] text-white rounded-xl text-sm hover:opacity-90 transition"
              >
                {copiedPix
                  ? "Copiado 💚"
                  : "Copiar código PIX"}
              </button>

              <p className="mt-4 text-sm text-[#6B7567] text-center">
                Faça o PIX utilizando o QR Code acima 💚
              </p>
            </>
          )}
        </div>

      </div>
    </div>
  )
}