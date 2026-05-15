import { useEffect, useState } from "react"
import { products } from "./data/products"
import qrCodeImg from "./assets/images/qrcode-ph.jpg"
import bannerImg from "./assets/images/banner.jpg"

function App() {
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [copiedAddress, setCopiedAddress] = useState(false)
  const categories = [
    "Todos",
    ...new Set(products.map((product) => product.category)),
  ]
  const filteredProducts = (
    selectedCategory === "Todos"
      ? products
      : products.filter(
        (product) => product.category === selectedCategory
      )
  ).sort((a, b) => {
    if (a.status === "available" && b.status !== "available") return -1
    if (a.status !== "available" && b.status === "available") return 1
    return a.price - b.price
  })

  const address = "R. Francisco Silveira Dias Filho, 337 - Jardim Itu Planalto"
  const pixCode = "teste"
  const [copied, setCopied] = useState(false)
  
  useEffect(() => {
    setCopied(false)
  }, [selectedProduct])

  function copyPixCode() {
    navigator.clipboard?.writeText(pixCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function copyAddress() {
    navigator.clipboard?.writeText(address)
    setCopiedAddress(true)
    setTimeout(() => setCopiedAddress(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#F7F3EE]">

      {/* Banner */}
      <section className="w-full min-h-[500px] bg-[#CFDCC8] flex items-center justify-center px-6 py-16">

        <div className="text-center max-w-2xl">

          {/* Foto */}
          <div className="w-72 h-72 mx-auto rounded-full bg-white shadow-lg mb-8 overflow-hidden border-4 border-white">
            <img
              src={bannerImg}
              alt="Banner"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Título */}
          <h1 className="text-4xl md:text-5xl font-semibold text-[#3F4A3C]">
            Chá de Casa Nova da Cami
          </h1>

          {/* Mensagem */}
          <p className="mt-5 text-[#3F4A3C] text-lg leading-relaxed">
            Obrigada por fazer parte desse momento especial 💚
          </p>

          {/* Informações do evento */}
          <div className="mt-10 bg-white/60 backdrop-blur-sm rounded-2xl py-3 px-5 shadow-sm space-y-2 text-[#3F4A3C] text-lg">

            <div className="flex items-center justify-center gap-3">
              <p className="leading-relaxed">
                📍 {address}
              </p>

              <button
                onClick={copyAddress}
                className={`
                  w-8 h-8
                  flex items-center justify-center
                  rounded-full
                  shadow-sm
                  transition-all duration-200
                  hover:scale-105

                  ${copiedAddress
                    ? "bg-[#CFDCC8] text-[#3F4A3C]"
                    : "bg-white/80 hover:bg-white text-[#4E5A4A]"
                  }
                `}
              >
                <span className="text-base">
                  {copiedAddress ? "✓" : "📋"}
                </span>
              </button>
            </div>

            <p>
              📅 24 de Junho de 2026
            </p>

            <p>
              🕖 19h00
            </p>

          </div>

        </div>

      </section>

      {/* Conteúdo */}
      <main className="max-w-7xl mx-auto px-6 py-12">

        <h2 className="text-3xl font-semibold text-[#4E5A4A] mb-8">
          Presentes
        </h2>

        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`
                px-5 py-2 rounded-full whitespace-nowrap
                font-medium text-sm
                transition-all duration-200 ease-in-out
                border border-[#5F6B5C]

                ${selectedCategory === category
                  ? "bg-[#5F6B5C] text-white shadow-md scale-105"
                  : "bg-white/80 text-[#5F6B5C] border border-[#D9E0D4]"
                }
              `}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

          {filteredProducts.map((product) => {
            const isUnavailable = product.status !== "available"

            return (
              <div
                key={product.id}
                onClick={() => {
                  if (isUnavailable) return
                  setSelectedProduct(product)
                }}
                className={`
                  bg-white rounded-2xl shadow-sm p-4 transition
                  ${isUnavailable
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:shadow-md cursor-pointer"
                  }
                `}
              >

                <div className="aspect-square w-full bg-[#E8E2DA] rounded-xl mb-4 overflow-hidden">
                  <img
                    src={product.image}
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
                  R$ {product.price.toLocaleString("pt-BR", { minimumFractionDigits: 2, })}
                </p>

              </div>
            )
          })}

        </div>

      </main>

      {/* Modal */}
      {selectedProduct && (

        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4 transition-opacity"
          onClick={() => setSelectedProduct(null)}
        >

          <div
            className="bg-[#F7F3EE] rounded-3xl max-w-sm w-full p-5 relative shadow-xl animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Botão fechar */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 text-[#5F6B5C] text-2xl"
            >
              ×
            </button>

            {/* Imagem */}
            <div className="aspect-square w-full max-w-[220px] mx-auto bg-[#E8E2DA] rounded-2xl mb-5 mt-8 overflow-hidden">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Nome */}
            <h2 className="text-2xl font-semibold text-[#4E5A4A] text-center">
              {selectedProduct.name}
            </h2>

            {/* Preço */}
            <p className="mt-3 text-2xl font-semibold text-[#5F6B5C] text-center">
              R$ {selectedProduct.price.toLocaleString("pt-BR", { minimumFractionDigits: 2, })}
            </p>

            {/* QR Code */}
            <div className="mt-6 flex flex-col items-center">

              <div className="w-48 h-48 bg-white rounded-2xl shadow-sm overflow-hidden p-2">
                <img
                  src={qrCodeImg}
                  alt="QR Code PIX"
                  className="w-full h-full object-contain"
                />
              </div>

              <button
                onClick={copyPixCode}
                className="mt-4 px-4 py-2 bg-[#5F6B5C] text-white rounded-xl text-sm hover:opacity-90 transition"
              >
                {copied ? "Copiado 💚" : "Copiar código PIX"}
              </button>

              <p className="mt-4 text-sm text-[#6B7567] text-center">
                Faça o PIX utilizando o QR Code acima 💚
              </p>

            </div>

          </div>

        </div>
      )}
    </div>
  )
}

export default App