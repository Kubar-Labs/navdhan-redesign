import en from "./messages/en";
import hi from "./messages/hi";
import bn from "./messages/bn";
import te from "./messages/te";
import mr from "./messages/mr";
import ta from "./messages/ta";
import kn from "./messages/kn";
import ml from "./messages/ml";
import { defaultLocale, isValidLocale, type Locale } from "./config";
import type { Messages } from "./messages/en";

const messagesByLocale: Record<Locale, Messages> = {
  en,
  hi,
  bn,
  te,
  mr,
  ta,
  kn,
  ml,
};

export function getMessages(locale: string): Messages {
  if (isValidLocale(locale)) {
    return messagesByLocale[locale];
  }
  return messagesByLocale[defaultLocale];
}

export { type Messages };
