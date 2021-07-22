import { printf } from "fast-printf";

/**
 * @internal
 */
function escape(text: string): string {
  return text.replace(/\\/g, "\\u{5C}").replace(/:/g, "\\u{3A}");
}

type Plural = string[];
type Singular = string;

interface CompressedContext {
  [key: string]: Singular | Plural;
}

interface CompressedLocalization {
  [key: string]: Singular | Plural | CompressedContext;
}

interface Context {
  [key: string]: Plural;
}

interface Localization {
  plurals: Plurals;
  content: { [key: string]: Context };
}

const FALLBACK_LOCALE = "";
const DEFAULT_CONTEXT = "";
const HEADER_KEY = "";

type Plurals = {
  length?: number;
  countToIndex?: (count: number) => number;
};

type Headers = {
  plurals: Plurals;
};

/**
 * @internal
 */
function parsePluralForms(locale: string, text = ""): Plurals {
  const [nplurals, plural] = `${text};`.split(";").map((p) => p.trim());
  const length = parseInt((nplurals.match(/nplurals=([0-9]+)/) || [])[1]);
  const pluralValue = (plural.match(/plural=([^;]+)/) || [])[1];

  const out: Plurals = {};

  if (!Number.isNaN(length)) {
    out.length = length;
  }

  if (pluralValue) {
    const countToIndexImplementation = new Function(
      "n",
      `return ${pluralValue};`
    );

    const countToIndex = (n: number): number => {
      const value = countToIndexImplementation(n);

      if (typeof value === "boolean") {
        return value ? 1 : 0;
      }

      return value;
    };

    out.countToIndex = countToIndex;
  }

  return out;
}

/**
 * @internal
 */
function verifyLocalization(locale: string, { plurals }: Localization) {
  if (!plurals.length || !plurals.countToIndex) {
    throw new TypeError(
      `${JSON.stringify(
        locale
      )} does not have its headers configured.  Please add PluralForms to allow plural handling.`
    );
  }
}

/**
 * @internal
 */
function parseHeaders(locale: string, text = ""): Headers {
  const lines = text.split("\n").map((l) => l.trim());
  const headers: Record<string, string> = {};

  for (const l of lines) {
    const [key, value] = l.split(":", 2).map((p) => p.trim());

    if (key && value) {
      headers[key] = value;
    }
  }

  const pluralForms = headers["Plural-Forms"];
  const plurals = parsePluralForms(locale, pluralForms);

  return { plurals };
}

/**
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getType(data: any) {
  if (Array.isArray(data)) {
    return "array";
  } else if (Object(data) === data) {
    return "object";
  } else if (typeof data == "string") {
    return "string";
  }

  return "invalid";
}

/**
 * @internal
 */
function decompressLocalization(
  locale: string,
  localization: CompressedLocalization
): Localization {
  const copy = JSON.parse(JSON.stringify(localization));
  const headers = parseHeaders(locale, copy[HEADER_KEY]);
  const keys = Object.keys(copy).filter((k) => k);

  for (const k of keys) {
    switch (getType(copy[k])) {
      case "array":
      case "string":
        copy[k] = { "": copy[k] };
        break;
      case "object":
        break;
      default:
        throw new TypeError("The localization has invalid formatting");
    }

    const contextKeys = Object.keys(copy[k]);
    for (const c of contextKeys) {
      switch (getType(copy[k][c])) {
        case "array":
          break;
        case "string":
          copy[k][c] = [copy[k][c]];
          break;
        default:
          throw new TypeError("The localization has invalid formatting");
      }
    }
  }

  delete copy[""];

  return { ...headers, content: copy } as Localization;
}

/**
 * @internal
 */
function mergeLocalizations(a: Localization, b: Localization): Localization {
  const copy = {
    plurals: { ...a.plurals, ...b.plurals },
    content: { ...a.content },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
  const keys = Object.keys(b.content);

  for (const k of keys) {
    if (copy.content[k]) {
      copy.content[k] = { ...copy.content[k], ...b.content[k] };
    } else {
      copy.content[k] = b.content[k];
    }
  }

  return copy;
}

function interpolate(
  text: string,
  ...leftover: Array<unknown>
): string | Array<unknown> {
  let increment = 0;
  let argIndex = 0;
  const mapping: Array<[string, unknown]> = [];

  function createKey() {
    const key = `{__replacement-reference-${increment}__}`;
    increment += 1;
    return key;
  }

  const newText = text.replace(/%[^a-z]*[a-z]/g, (match) => {
    if (match.endsWith("r")) {
      const indexMatch = match.match(/%([0-9]+)\$/);
      const key = createKey();

      if (indexMatch) {
        const index = parseInt(indexMatch[1]) - 1;
        const arg = leftover[index];
        mapping.push([key, arg]);
      } else {
        const index = argIndex;
        const arg = leftover[index];
        mapping.push([key, arg]);
        argIndex += 1;
      }

      return key;
    }

    return match;
  });

  const result = printf(newText, ...leftover);

  if (mapping.length) {
    let leftoverText = result;
    const out = [];
    mapping.forEach(([key, value]) => {
      const [before, after] = leftoverText.split(key);
      out.push(before);
      out.push(value);
      leftoverText = after;
    });
    out.push(leftoverText);

    return out;
  }

  return result;
}

const fallbackCountToIndex = (n: number) => (n != 1 ? 1 : 0);

class Translator {
  /** The localization store. */
  public localizations: { [key: string]: Localization } = {};

  /** The currently set locale. Defaults to a blank string which represents the fallback locale. */
  public locale: string;

  constructor(locale = FALLBACK_LOCALE) {
    this.locale = locale;
  }

  /**
   * @internal
   */
  private getTranslation(context: string, key: string): string {
    const { localizations, locale } = this;
    const localization = localizations?.[locale];
    const translation = localization?.content?.[escape(key)]?.[context]?.[0];

    return translation ?? key;
  }

  /**
   * @internal
   */
  private getPluralTranslation(
    context: string,
    singular: string,
    plural: string,
    count: number
  ): string {
    const { localizations } = this;
    const localization = localizations?.[this.locale];

    if (
      localization &&
      localization.plurals &&
      localization.plurals.countToIndex
    ) {
      const { content, plurals } = localization;
      const index = plurals.countToIndex(count);
      const key = `${escape(singular)}:${escape(plural)}`;
      const translation = content?.[key]?.[context]?.[index];

      return translation ?? [singular, plural][fallbackCountToIndex(count)];
    }

    return [singular, plural][fallbackCountToIndex(count)];
  }

  /**
   * Overwrites a specific localization with a new one.
   * @param locale - The locale to overwrite
   * @param localization - The new localization mapping
   */
  setLocalization(locale: string, localization: CompressedLocalization): void {
    const newLocalization = decompressLocalization(locale, localization);
    verifyLocalization(locale, newLocalization);
    this.localizations[locale] = newLocalization;
  }

  /**
   * Incrementally merges a localization into an existing one.
   * @param locale - The locale to merge into
   * @param localization - The data to merge with the existing data.
   */
  mergeLocalization(
    locale: string,
    localization: CompressedLocalization
  ): void {
    if (this.localizations[locale]) {
      const newLocalization = mergeLocalizations(
        this.localizations[locale],
        decompressLocalization(locale, localization)
      );

      verifyLocalization(locale, newLocalization);

      this.localizations[locale] = newLocalization;
    } else {
      this.setLocalization(locale, localization);
    }
  }

  /**
   * Get the mapping for a specific string using the currently set locale.  If the mapping does
   * not exist, the value is passed through.
   * @param singular - The string to localize
   * @param leftover - Leftover arguments to use for interpolation where `%d` or `%s` is used
   * @return The localized string if it exists, otherwise the text is passed through as a fallback
   */
  gettext = (
    key: string,
    ...leftover: Array<unknown>
  ): string | Array<unknown> => {
    return this.pgettext(DEFAULT_CONTEXT, key, ...leftover);
  };

  /**
   * Translates a plural string.
   * @param singular - The singular version of the string, such as `%s apple`
   * @param plural - The plural version of the string, such as `%s apples`
   * @param count -  Count used to determine which version is used
   * @param - Other interpolation arguments similar to the singular form of this function
   * @return The localized string if it exists, otherwise the text is passed through as a fallback
   */
  ngettext = (
    singular: string,
    plural: string,
    count: number,
    ...leftover: Array<unknown>
  ): string | Array<unknown> => {
    return this.npgettext(
      DEFAULT_CONTEXT,
      singular,
      plural,
      count,
      ...leftover
    );
  };

  /**
   * Get the mapping for a specific string using the currently set locale.  If the mapping does
   * not exist, the value is passed through.
   * @param context - The translation context, used for
   * diambiguating usages of a word that would map to different words in
   * another language
   * @param singular - The string to localize
   * @param leftover - Leftover arguments to use for interpolation where `%d` or `%s` is used
   * @return The localized string if it exists, otherwise the text is passed through as a fallback
   */
  pgettext = (
    context: string,
    key: string,
    ...leftover: Array<unknown>
  ): string | Array<unknown> => {
    const text = this.getTranslation(context, key);

    return interpolate(text, ...leftover);
  };

  /**
   * Translates a particular version of a plural string denoted by the context.
   * @param context - The translation context, used for
   * diambiguating usages of a word that would map to different words in
   * another language
   * @param singular - The singular version of the string, such as `%s apple`
   * @param plural - The plural version of the string, such as `%s apples`
   * @param count -  Count used to determine which version is used
   * @param - Other interpolation arguments similar to the singular form of this function
   * @return The localized string if it exists, otherwise the text is passed through as a fallback
   */
  npgettext = (
    context: string,
    singular: string,
    plural: string,
    count: number,
    ...leftover: Array<unknown>
  ): string | Array<unknown> => {
    const translation = this.getPluralTranslation(
      context,
      singular,
      plural,
      count
    );

    return interpolate(translation, count, ...leftover);
  };
}

export default Translator;
