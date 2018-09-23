# @zakkudo/translator

Helper class to make working with translations enjoyable.

[![Build Status](https://travis-ci.org/zakkudo/translator.svg?branch=master)](https://travis-ci.org/zakkudo/translator)
[![Coverage Status](https://coveralls.io/repos/github/zakkudo/translator/badge.svg?branch=master)](https://coveralls.io/github/zakkudo/translator?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/zakkudo/translator/badge.svg)](https://snyk.io/test/github/zakkudo/translator)
[![Node](https://img.shields.io/node/v/@zakkudo/translator.svg)](https://nodejs.org/)
[![License](https://img.shields.io/npm/l/@zakkudo/translator.svg)](https://opensource.org/licenses/BSD-3-Clause)

## Why use this?

- Load arbitrary localizations with little fuss
- Incrementally load localizations for use with dynamic imports
- Keys are the translation strings itself, simplifying fallbacks and coding
- Works similarly to the venerable [gettext](https://en.wikipedia.org/wiki/Gettext).  Any translation strategies that work for that library work for this library.
  translatable making usage extremely easy for developers

## Install

```console
# Install using npm
npm install @zakkudo/translator
```

``` console
# Install using yarn
yarn add @zakkudo/translator
```

## Examples

### Basic example
``` javascript
import Translator from '@zakkudo/translator';
import fr from 'src/.locales/fr.json';
const translator = new Translator();
const {__, __n} = translator;
const language = navigator.language.split('-')[0];

translator.setLocalization('fr', fr);
translator.setLocale(language);

document.title = __('About');
document.body.innerHTML = __n('There is one user', 'There are %d users', 2);
```

## Also see

- `@zakkudo/translate-webpack-plugin` or
`@zakkudo/translation-static-analyzer` for generating translation
templates that this library reads instead of writing them manually.
See the
- [Polymer 3 Starter Project](https://github.com/zakkudo/polymer-3-starter-project)
for an example of using this library.

## API

<a name="module_@zakkudo/translator"></a>

<a name="module_@zakkudo/translator..Translator"></a>

### @zakkudo/translator~Translator ⏏

**Kind**: Exported class

* [~Translator](#module_@zakkudo/translator..Translator)
    * [new Translator()](#new_module_@zakkudo/translator..Translator_new)
    * [.__](#module_@zakkudo/translator..Translator+__)
    * [.__n](#module_@zakkudo/translator..Translator+__n)
    * [.__p](#module_@zakkudo/translator..Translator+__p)
    * [.__np](#module_@zakkudo/translator..Translator+__np)
    * [.setLocalization(locale, localization)](#module_@zakkudo/translator..Translator+setLocalization)
    * [.mergeLocalization(locale, localization)](#module_@zakkudo/translator..Translator+mergeLocalization)
    * [.setLocale(locale)](#module_@zakkudo/translator..Translator+setLocale)
    * [.getLocale()](#module_@zakkudo/translator..Translator+getLocale) ⇒ <code>String</code>
    * [.gettext(singular, ...leftover)](#module_@zakkudo/translator..Translator+gettext) ⇒ <code>String</code>
    * [.ngettext(singular, plural, quantity, ...leftover)](#module_@zakkudo/translator..Translator+ngettext) ⇒ <code>String</code>
    * [.pgettext(context, singular, ...leftover)](#module_@zakkudo/translator..Translator+pgettext) ⇒ <code>String</code>
    * [.npgettext(context, singular, plural, quantity, ...leftover)](#module_@zakkudo/translator..Translator+npgettext) ⇒ <code>String</code>

<a name="new_module_@zakkudo/translator..Translator_new"></a>

#### new Translator()
Generate an instance of the translator.

<a name="module_@zakkudo/translator..Translator+__"></a>

#### translator.__
Convenience alias for [gettext](#module_@zakkudo/translator..Translator+gettext). It's
bound to the instance, so can set it to a variable to doing
something like `const {__} = translator;`

**Kind**: instance property of [<code>Translator</code>](#module_@zakkudo/translator..Translator)  
<a name="module_@zakkudo/translator..Translator+__n"></a>

#### translator.__n
Convenience alias for [ngettext](#module_@zakkudo/translator..Translator+ngettext). It's
bound to the instance, so can set it to a variable to doing
something like `const {__n} = translator;`

**Kind**: instance property of [<code>Translator</code>](#module_@zakkudo/translator..Translator)  
<a name="module_@zakkudo/translator..Translator+__p"></a>

#### translator.__p
Convenience alias for [pgettext](#module_@zakkudo/translator..Translator+pgettext). It's
bound to the instance, so can set it to a variable to doing
something like `const {__p} = translator;`

**Kind**: instance property of [<code>Translator</code>](#module_@zakkudo/translator..Translator)  
<a name="module_@zakkudo/translator..Translator+__np"></a>

#### translator.__np
Convenience alias for [npgettext](#module_@zakkudo/translator..Translator+npgettext). It's
bound to the instance, so can set it to a variable to doing
something like `const {__np} = translator;`

**Kind**: instance property of [<code>Translator</code>](#module_@zakkudo/translator..Translator)  
<a name="module_@zakkudo/translator..Translator+setLocalization"></a>

#### translator.setLocalization(locale, localization)
Overwrites a specific localization with a new one.

**Kind**: instance method of [<code>Translator</code>](#module_@zakkudo/translator..Translator)  

| Param | Type | Description |
| --- | --- | --- |
| locale | <code>String</code> | The locale to overwrite |
| localization | <code>Object</code> | The new localization mapping |

<a name="module_@zakkudo/translator..Translator+mergeLocalization"></a>

#### translator.mergeLocalization(locale, localization)
Incrementally merges a localization into an existing one.

**Kind**: instance method of [<code>Translator</code>](#module_@zakkudo/translator..Translator)  

| Param | Type | Description |
| --- | --- | --- |
| locale | <code>String</code> | The locale to merge into |
| localization | <code>Object</code> | The data to merge with the existing data. |

<a name="module_@zakkudo/translator..Translator+setLocale"></a>

#### translator.setLocale(locale)
Set the current locale. This will decide which localization is used.

**Kind**: instance method of [<code>Translator</code>](#module_@zakkudo/translator..Translator)  

| Param | Type | Description |
| --- | --- | --- |
| locale | <code>String</code> | A locale such as `ja_JP`, `en`, `es` or `default` to just passthrough |

<a name="module_@zakkudo/translator..Translator+getLocale"></a>

#### translator.getLocale() ⇒ <code>String</code>
**Kind**: instance method of [<code>Translator</code>](#module_@zakkudo/translator..Translator)  
**Returns**: <code>String</code> - The currently set locale or 'default' if none is set  
<a name="module_@zakkudo/translator..Translator+gettext"></a>

#### translator.gettext(singular, ...leftover) ⇒ <code>String</code>
Get the mapping for a specific string using the currently set locale.  If the mapping does
not exist, the value is passed through.

**Kind**: instance method of [<code>Translator</code>](#module_@zakkudo/translator..Translator)  
**Returns**: <code>String</code> - The localized string if it exists, otherwise the text is passed through as a fallback  

| Param | Type | Description |
| --- | --- | --- |
| singular | <code>String</code> | The string to localize |
| ...leftover | <code>Array.&lt;String&gt;</code> | Leftover arguments to use for interpolation where `%d` or `%s` is used |

<a name="module_@zakkudo/translator..Translator+ngettext"></a>

#### translator.ngettext(singular, plural, quantity, ...leftover) ⇒ <code>String</code>
Translates a plural string.

**Kind**: instance method of [<code>Translator</code>](#module_@zakkudo/translator..Translator)  
**Returns**: <code>String</code> - The localized string if it exists, otherwise the text is passed through as a fallback  

| Param | Type | Description |
| --- | --- | --- |
| singular | <code>String</code> | The singular version of the string, such as `%s apple` |
| plural | <code>String</code> | The plural version of the string, such as `%s apples` |
| quantity | <code>Number</code> | Count used to determine which version is used |
| ...leftover | <code>Array.&lt;String&gt;</code> | Other interpolation arguments similar to the singular form of this function |

<a name="module_@zakkudo/translator..Translator+pgettext"></a>

#### translator.pgettext(context, singular, ...leftover) ⇒ <code>String</code>
Get the mapping for a specific string using the currently set locale.  If the mapping does
not exist, the value is passed through.

**Kind**: instance method of [<code>Translator</code>](#module_@zakkudo/translator..Translator)  
**Returns**: <code>String</code> - The localized string if it exists, otherwise the text is passed through as a fallback  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>String</code> | The translation context, used for diambiguating usages of a word that would map to different words in another language |
| singular | <code>String</code> | The string to localize |
| ...leftover | <code>Array.&lt;String&gt;</code> | Leftover arguments to use for interpolation where `%d` or `%s` is used |

<a name="module_@zakkudo/translator..Translator+npgettext"></a>

#### translator.npgettext(context, singular, plural, quantity, ...leftover) ⇒ <code>String</code>
Translates a particular version of a plural string denoted by the context.

**Kind**: instance method of [<code>Translator</code>](#module_@zakkudo/translator..Translator)  
**Returns**: <code>String</code> - The localized string if it exists, otherwise the text is passed through as a fallback  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>String</code> | The translation context, used for diambiguating usages of a word that would map to different words in another language |
| singular | <code>String</code> | The singular version of the string, such as `%s apple` |
| plural | <code>String</code> | The plural version of the string, such as `%s apples` |
| quantity | <code>Number</code> | Count used to determine which version is used |
| ...leftover | <code>Array.&lt;String&gt;</code> | Other interpolation arguments similar to the singular form of this function |

