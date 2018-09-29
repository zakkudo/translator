/**
 * @module @zakkudo/translator
*/

import printf from 'printf';

/**
 * @private
 */
function isNumber(text) {
    return text === String(parseInt(text));
}

/**
 * @private
 */
function isContext(object) {
    return Object(object) === object && Object.keys(object).some((k) => {
        return !isNumber(k);
    });
}

/**
 * @private
 */
function isSingular(text) {
    return typeof text === 'string' && text;
}

/**
 * @private
 */
function isPlural(object) {
    return Object.keys(object).length;
}

/**
 * @private
 */
function getTranslation(context, key) {
    const locale = this.getLocale();
    const localizations = this.localizations;
    const localization = localizations[locale] || {};
    const contexts = localization[key] || {};

    return contexts[context];
}

/**
 * @private
 */
function decompressLocalization(localization) {
    return Object.entries(localization).reduce((accumulator, [k, v]) => {
        const context = Object.assign({}, accumulator[k] || {});

        if (isContext(v)) {
            Object.assign(context, v);
        } else if (isSingular(v)) {
            context['default'] = v;
        } else if (isPlural(v)) {
            context['default'] = v;
        }

        return Object.assign({}, accumulator, {[k]: context});
    }, {});
}

/**
 * @private
 */
function mergeLocalization(localization = {}, otherLocalization) {
    return Object.entries(otherLocalization).reduce((accumulator, [key, contexts]) => {
        return Object.assign({}, accumulator, {
            [key]: Object.assign(
                {},
                accumulator[key] || {},
                contexts
            )
        });
    }, localization);
}

class Translator {
    /**
     * Generate an instance of the translator.
    */
    constructor() {
        this.localizations = {};
        this.locale = 'default';

        /** Convenience alias for {@link module:@zakkudo/translator~Translator#gettext}. It's
         * bound to the instance, so it can be set to a variable by doing something like
         * `const {__} = translator;`
         */
        this.__ = this.gettext.bind(this);

        /** Convenience alias for {@link module:@zakkudo/translator~Translator#ngettext}. It's
         * bound to the instance, so it can be set to a variable to doing something like
         * something like `const {__n} = translator;`
         */
        this.__n = this.ngettext.bind(this);

        /** Convenience alias for {@link module:@zakkudo/translator~Translator#pgettext}. It's
         * bound to the instance, so it can be set to a variable to doing something like
         * `const {__p} = translator;`
         */
        this.__p = this.pgettext.bind(this);

        /** Convenience alias for {@link module:@zakkudo/translator~Translator#npgettext}. It's
         * bound to the instance, so it can be set to a variable to doing something like
         * `const {__np} = translator;`
         */
        this.__np = this.npgettext.bind(this);
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

        this.localizations[locale] = decompressLocalization(localization);
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

        this.localizations[locale] = mergeLocalization(
            this.localizations[locale],
            decompressLocalization(localization)
        );
    }

    /**
     * Set the current locale. This will decide which localization is used.
     * @param {String} locale - A locale such as `ja_JP`, `en`, `es` or `default` to just passthrough
     */
    setLocale(locale) {
        this.locale = locale;
    }

    /**
     * @return {String} The currently set locale or 'default' if none is set
     */
    getLocale() {
        return this.locale;
    }

    /**
     * Get the mapping for a specific string using the currently set locale.  If the mapping does
     * not exist, the value is passed through.
     * @param {String} singular - The string to localize
     * @param {Array<String>} leftover - Leftover arguments to use for interpolation where `%d` or `%s` is used
     * @return {String} The localized string if it exists, otherwise the text is passed through as a fallback
     */
    gettext(key, ...leftover) {
        return this.pgettext('default', key, ...leftover);
    }

    /**
     * Translates a plural string.
     * @param {String} singular - The singular version of the string, such as `%s apple`
     * @param {String} plural - The plural version of the string, such as `%s apples`
     * @param {Number} quantity -  Count used to determine which version is used
     * @param {Array<String>} - Other interpolation arguments similar to the singular form of this function
     * @return {String} The localized string if it exists, otherwise the text is passed through as a fallback
     */
    ngettext(singular, plural, quantity, ...leftover) {
        return this.npgettext('default', singular, plural, quantity, ...leftover);
    }

    /**
     * Get the mapping for a specific string using the currently set locale.  If the mapping does
     * not exist, the value is passed through.
     * @param {String} context - The translation context, used for
     * diambiguating usages of a word that would map to different words in
     * another language
     * @param {String} singular - The string to localize
     * @param {Array<String>} leftover - Leftover arguments to use for interpolation where `%d` or `%s` is used
     * @return {String} The localized string if it exists, otherwise the text is passed through as a fallback
    */
    pgettext(context, key, ...leftover) {
        const fallback = key
        const text = getTranslation.call(this, context, key) || fallback;

        return printf(text, ...leftover);
    }

    /**
     * Translates a particular version of a plural string denoted by the context.
     * @param {String} context - The translation context, used for
     * diambiguating usages of a word that would map to different words in
     * another language
     * @param {String} singular - The singular version of the string, such as `%s apple`
     * @param {String} plural - The plural version of the string, such as `%s apples`
     * @param {Number} quantity -  Count used to determine which version is used
     * @param {Array<String>} - Other interpolation arguments similar to the singular form of this function
     * @return {String} The localized string if it exists, otherwise the text is passed through as a fallback
    */
    npgettext(context, singular, plural, quantity, ...leftover) {
        const key = singular;
        const fallback = {'1': singular, '2': plural};
        const variations = getTranslation.call(this, context, key) || fallback;
        const indicies = Object.keys(variations).map((k) => parseInt(k)).sort();
        const last = indicies.slice(-1)[0];
        const text = variations[quantity] || variations[last];

        return printf(text, quantity, ...leftover);
    }
}

export default Translator;
