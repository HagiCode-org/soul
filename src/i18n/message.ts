import type { TFunction } from "i18next"

import { ALL_CATEGORY_ID, CATEGORY_TRANSLATION_KEYS } from "@/i18n/locales"
import type { MessageDescriptor } from "@/lib/builder/types"

export function translateMessage(t: TFunction, message: MessageDescriptor | null | undefined) {
  if (!message) {
    return null
  }

  return t(message.key, message.values)
}

export function translateCategory(t: TFunction, category: string) {
  if (category === ALL_CATEGORY_ID) {
    return t("builder.categories.all")
  }

  const translationKey = CATEGORY_TRANSLATION_KEYS[category]
  if (!translationKey) {
    return category
  }

  return t(translationKey)
}
