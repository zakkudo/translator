/**
 * @module @zakkudo/translator
*/

import y18n from 'y18n';

/**
 * Class description
 */
class Translator {
    /**
     * Generate an instance of the translator.
    */
    constructor() {
        const instance = this.instance = y18n({
            updateFiles: false,
            locale: 'default',
            fallbackToLanguage: false,
        });

        instance.cache['default'] = {};
        instance.setLocale('default');
    }
    /**
     * Overwrites a specific localization with a new one.
     * @param {String} locale - The locale to overwrite
     * @param {Object} localization - The new localization mapping
     */
    setLocalization(locale, localization) {
        if (locale === 'default')  {
            throw new TypeError(`Cannot overwrite the read-only fallthrough locale, "${locale}"`)
        }

        this.instance.cache[locale] = Object.assign({}, localization);
    }

    /**
     * Incrementally merges a localization into an existing one.
     * @param {String} locale - The locale to merge into
     * @param {Object} localization - The data to merge with the existing data.
     */
    mergeLocalization(locale, localization) {
        if (locale === 'default')  {
            throw new TypeError(`Cannot merge into the read-only fallthrough locale, "${locale}"`)
        }

        this.instance.cache[locale] = Object.assign({}, this.instance.cache[locale], localization);
    }

    /**
     * Set the current locale. This will decide which localization is used.
     * @param {String} locale - A locale such as `ja_JP`, `en`, `es` or `default` to just passthrough
     */
    setLocale(locale) {
        this.instance.setLocale(locale);
    }

    /**
     * @return {String} The currently set locale or 'default' if none is set
     */
    getLocale() {
        return this.instance.getLocale();
    }

    /**
     * Get the mapping for a specific string using the currently set locale.  If the mapping does
     * not exist, the value is passed through.
     * @param {String} singular - The string to localize
     * @param {Array<String>} leftover - Leftover arguments to use for interpolation where `%d` or `%s` is used
     * @return {String} The localized string if it exists, otherwise the text is passed through as a fallback
     */
    __(singular, ...leftover) {
        const locale = this.getLocale();
        const cache = this.instance.cache;
        const localization = cache[locale] || {};
        const fallback = singular

        localization[singular] = localization[singular] || fallback;

        return this.instance.__(singular, ...leftover);
    }

    /**
     * Translates a plural string.
     * @param {String} singular - The singular version of the string, such as `%s apple`
     * @param {String} plural - The plural version of the string, such as `%s apples`
     * @param {Number} quantity -  Count used to determine which version is used
     * @param {Array<String>} - Other interpolation arguments similar to the singular form of this function
     * @return {String} The localized string if it exists, otherwise the text is passed through as a fallback
     */
    __n(singular, plural, quantity, ...leftover) {
        const locale = this.getLocale();
        const cache = this.instance.cache;
        const localization = cache[locale] || {};
        const key = singular;
        const fallback = {'one': singular, 'other': plural};

        if (localization[key]) {
            if (!localization[key].one) {
                // Allow other languages such as japanese to just use "other" in their localizations
                localization[key].one = localization[key].other || singular;
            }

            if (!localization[key].other) {
                localization[key].other =  plural;
            }
        }

        localization[key] = localization[key] || fallback;

        return this.instance.__n(singular, plural, quantity, ...leftover);
    }
}

export default Translator;
