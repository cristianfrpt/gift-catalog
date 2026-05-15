import ProductModal from "./ProductModal"

export default function ProductModalContainer({
  selectedProduct,
  setSelectedProduct,
  copyPix,
  copied,
  pixCode,
}) {
  if (!selectedProduct) return null

  return (
    <ProductModal
      product={selectedProduct}
      onClose={() => setSelectedProduct(null)}
      onCopyPix={() => copyPix(pixCode)}
      copied={copied}
    />
  )
}