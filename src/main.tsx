import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import App from "./App"
import "./index.css"
import { initializeI18n } from "./i18n/config"
import { bootstrapAnalytics } from "./lib/analytics/bootstrap"

async function bootstrapApplication() {
  await initializeI18n()

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
}

void bootstrapApplication().catch((error) => {
  console.error("[i18n] Bootstrap failed", error)
})

void bootstrapAnalytics().catch((error) => {
  console.warn("[51LA Analytics] Bootstrap failed", error)
})
