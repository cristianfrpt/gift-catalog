import Banner from "../ui/Banner"

export default function HeaderSection({
  address,
  copiedAddress,
  copyAddress,
}) {
  return (
    <Banner
      address={address}
      copiedAddress={copiedAddress}
      copyAddress={copyAddress}
    />
  )
}