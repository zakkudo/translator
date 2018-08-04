import y18n from 'y18n';

export default class Translator {
    constructor() {
        super();

        const instance = this.instance = y18n({
            updateFiles: false,
            locale: 'default',
        });

        instance.cache['default'] = {};
    }
    /**
     * Overwrites a specific localization
     * @param {String} locale - The locale to overwrite
     * @param {Object} localization - An object where the key is the raw string
     */
    setLocalization(locale, localization) {
        if (locale === 'default')  {
            throw new Error('Cannot overwrite the fallthrough locale.')
        }

        this.instance.cache[locale] = Object.assign({}, localization);
    }

    /**
     * Incrementally merges a localization
     * @param {String} locale - The locale to merge into
     * @param {Object} localization - An object where the key is the raw string
     */
    mergeLocalization(locale, localization) {
        if (locale === 'default')  {
            throw new Error('Cannot merge into the fallthrough locale.')
        }

        this.instance.cache[locale] = Object.assign({}, this.instance.cache[locale], localization);
    }

    /**
     * Set the current localization, deciding which localization map to use
     * @param {String} locale - A locale such as ja_JP, en, es or default to just passthrough
     */
    setLocale(locale) {
        this.instance.setLocale(locale);
    }

    /**
     * Get's the currently set localization
     */
    getLocale() {
        return this.instance.getLocale();
    }

    /**
     * Translators a string
     * @param {String} singular - The string to localize
     * @leftover {Array<String>} leftover - Array arguments to interpolate %s and %d arguments
     * @return {String} The localized string
     */
    __(singular, ...leftover) {
        return this.instance.__(singular, ...leftover);
    }

    /**
     * Translators a plural string
     */
    __n(singular, plural, quantity, ..leftover) {
        return this.instance.__n(singular, plural, quantity, ...leftover);
    }
}
