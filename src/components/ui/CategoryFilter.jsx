export default function CategoryFilter({
  categories,
  selectedCategory,
  setSelectedCategory,
}) {
  return (
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

            ${
              selectedCategory === category
                ? "bg-[#5F6B5C] text-white shadow-md scale-105"
                : "bg-white/80 text-[#5F6B5C] border border-[#D9E0D4]"
            }
          `}
        >
          {category}
        </button>
      ))}
    </div>
  )
}