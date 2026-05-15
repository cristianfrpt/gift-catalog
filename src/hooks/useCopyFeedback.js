import { useState } from "react"

export function useCopyFeedback() {
  const [copied, setCopied] = useState(false)

  function copy(text) {
    navigator.clipboard?.writeText(text)
    setCopied(true)

    setTimeout(() => setCopied(false), 2000)
  }

  return {
    copied,
    copy,
  }
}