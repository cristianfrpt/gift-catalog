import Banner from "../ui/Banner"

type HeaderSectionProps = {
  address: string
  copiedAddress: boolean
  copyAddress: () => void
}

export default function HeaderSection({
  address,
  copiedAddress,
  copyAddress,
}: HeaderSectionProps) {
  return (
    <Banner
      address={address}
      copiedAddress={copiedAddress}
      copyAddress={copyAddress}
    />
  )
}