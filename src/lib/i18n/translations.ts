import "server-only";
import { notFound } from "next/navigation";
import { defaultLocale, isValidLocale, type Locale } from "@/src/lib/i18n/config";

const messageLoaders: Record<Locale, () => Promise<Record<string, unknown>>> = {
  en: () =>
    import("@/src/lib/i18n/messages/en.json").then((m) => m.default as Record<string, unknown>),
  hi: () =>
    import("@/src/lib/i18n/messages/hi.json").then((m) => m.default as Record<string, unknown>),
  bn: () =>
    import("@/src/lib/i18n/messages/bn.json").then((m) => m.default as Record<string, unknown>),
  te: () =>
    import("@/src/lib/i18n/messages/te.json").then((m) => m.default as Record<string, unknown>),
  mr: () =>
    import("@/src/lib/i18n/messages/mr.json").then((m) => m.default as Record<string, unknown>),
  ta: () =>
    import("@/src/lib/i18n/messages/ta.json").then((m) => m.default as Record<string, unknown>),
  kn: () =>
    import("@/src/lib/i18n/messages/kn.json").then((m) => m.default as Record<string, unknown>),
  ml: () =>
    import("@/src/lib/i18n/messages/ml.json").then((m) => m.default as Record<string, unknown>),
};

export type Messages = Record<string, unknown>;

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function deepMerge(
  target: Record<string, unknown>,
  source: Record<string, unknown>,
): Record<string, unknown> {
  const result: Record<string, unknown> = { ...target };
  for (const key of Object.keys(source)) {
    if (isObject(source[key]) && isObject(result[key])) {
      result[key] = deepMerge(
        result[key] as Record<string, unknown>,
        source[key] as Record<string, unknown>,
      );
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

export async function getMessages(locale: string): Promise<Messages> {
  if (!isValidLocale(locale)) notFound();
  const base = await messageLoaders[defaultLocale]();
  if (locale === defaultLocale) return base;
  const override = await messageLoaders[locale]();
  return deepMerge(base, override);
}

function getByPath(obj: unknown, path: string): unknown {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current === null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

function interpolate(value: string, variables?: Record<string, string | number>): string {
  if (!variables) return value;
  return value.replace(/\{(\w+)\}/g, (_, key) => {
    const replacement = variables[key];
    return replacement === undefined ? `{${key}}` : String(replacement);
  });
}

export type Translator = (key: string, variables?: Record<string, string | number>) => string;

export async function getTranslator(locale: string, namespace?: string): Promise<Translator> {
  const messages = await getMessages(locale);
  const root = namespace ? getByPath(messages, namespace) : messages;

  return (key: string, variables?: Record<string, string | number>) => {
    const fullPath = namespace ? `${namespace}.${key}` : key;
    const raw = getByPath(messages, fullPath);
    if (typeof raw !== "string") {
      if (namespace && root && typeof root === "object") {
        const namespacedRaw = getByPath(root, key);
        if (typeof namespacedRaw === "string") return interpolate(namespacedRaw, variables);
      }
      return key;
    }
    return interpolate(raw, variables);
  };
}
