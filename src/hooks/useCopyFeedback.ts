import { useState } from "react"

export function useCopyFeedback() {
  const [copied, setCopied] = useState<boolean>(false)

  function copy(text: string) {
    if (!text) return

    navigator.clipboard?.writeText(text)
    setCopied(true)

    setTimeout(() => setCopied(false), 2000)
  }

  return {
    copied,
    copy,
  }
}