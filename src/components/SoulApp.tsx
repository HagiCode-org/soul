import { useEffect, useState } from "react"

import App from "@/App"
import { initializeI18n } from "@/i18n/config"

/**
 * Astro React island that hydrates the existing Soul SPA. i18n bootstrap, previously run from
 * the Vite document entry, now happens here on the client once the island mounts. 51LA is loaded
 * by the shared Hagilight component in the Astro page. The shared Hagilight footer and banner are mounted outside this island
 * in the Astro page.
 */
export default function SoulApp() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    void initializeI18n().then(() => {
      if (cancelled) {
        return
      }
      setReady(true)
    })

    return () => {
      cancelled = true
    }
  }, [])

  if (!ready) {
    return null
  }

  return <App />
}
