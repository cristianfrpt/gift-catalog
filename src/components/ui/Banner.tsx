import bannerImg from "../../assets/images/banner.jpg"

type BannerProps = {
  address: string
  copiedAddress: boolean
  copyAddress: () => void
}

function Banner({
  address,
  copiedAddress,
  copyAddress,
}: BannerProps) {
  return (
    <section className="w-full min-h-[500px] bg-[#CFDCC8] flex items-center justify-center px-6 py-16 select-none">
      <div className="text-center max-w-2xl">
        <div className="w-72 h-72 mx-auto rounded-full bg-white shadow-lg mb-8 overflow-hidden border-4 border-white">
          {/* Foto */}
          <img
            src={bannerImg}
            alt="Banner"
            draggable={false}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Título */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#3F4A3C] leading-tight px-2 text-center">
          Chá de Casa Nova <br />
          Cami e Gabi
        </h1>

        {/* Mensagem */}
        <p className="mt-5 text-[#3F4A3C] text-lg leading-relaxed">
          Obrigada por fazer parte desse momento especial 💚
        </p>

        {/* Informações do evento */}
        <div className="mt-10 bg-white/60 backdrop-blur-sm rounded-2xl py-3 px-5 shadow-sm space-y-2 text-[#3F4A3C] text-lg">
          <div className="flex items-center justify-center gap-3">
            <span className="shrink-0 mt-[2px]">📍</span>

            <p className="leading-snug text-center sm:text-left break-words">
              {address}
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

                ${
                  copiedAddress
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

          <p>📅 30 de Junho de 2026</p>

          <p>🕖 19h00</p>
        </div>
      </div>
    </section>
  )
}

export default Banner