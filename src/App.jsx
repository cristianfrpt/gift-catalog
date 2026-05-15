import { useProducts } from "./hooks/useProducts"
import { useProductModal } from "./hooks/useProductModal"
import { useCopyFeedback } from "./hooks/useCopyFeedback"

import HeaderSection from "./components/layout/HeaderSection"
import ProductSection from "./components/layout/ProductSection"
import ProductModalContainer from "./components/ui/ProductModalContainer"
import Footer from "./components/ui/Footer"

function App() {
  const {
    selectedCategory,
    setSelectedCategory,
    categories,
    filteredProducts,
  } = useProducts()

  const { selectedProduct, setSelectedProduct } = useProductModal()

  const { copied: copiedPix, copy: copyPix } = useCopyFeedback()
  const { copied: copiedAddress, copy: copyAddress } = useCopyFeedback()

  const address = "R. Francisco Silveira Dias Filho, 337 - Jardim Itu Planalto"
  const pixCode = "teste"

  return (
     <div className="min-h-screen bg-[#F7F3EE]">

      <HeaderSection
        address={address}
        copiedAddress={copiedAddress}
        copyAddress={() => copyAddress(address)}
      />

      <main className="max-w-7xl mx-auto px-6 py-12">

        <ProductSection
          title="Presentes"
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          products={filteredProducts}
          onSelect={setSelectedProduct}
        />

      </main>

      <ProductModalContainer
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
        copyPix={copyPix}
        copied={copiedPix}
        pixCode={pixCode}
      />

      <Footer />

    </div>
  )
}

export default App