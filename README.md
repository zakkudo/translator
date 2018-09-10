# @zakkudo/translator

Helper class to make working with translations enjoyable.

[![Build Status](https://travis-ci.org/zakkudo/translator.svg?branch=master)](https://travis-ci.org/zakkudo/translator)
[![Coverage Status](https://coveralls.io/repos/github/zakkudo/translator/badge.svg?branch=master)](https://coveralls.io/github/zakkudo/translator?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/zakkudo/translator/badge.svg)](https://snyk.io/test/github/zakkudo/translator)
[![Node](https://img.shields.io/node/v/@zakkudo/translator.svg)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Why use this?

- Load arbitrary localizations with little fuss
- Incrementally load localizations for use with dynamic imports
- Keys are the translation strings itself, simplifying fallbacks and coding

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
Class description

**Kind**: Exported class

* [~Translator](#module_@zakkudo/translator..Translator)
    * [new Translator()](#new_module_@zakkudo/translator..Translator_new)
    * [.setLocalization(locale, localization)](#module_@zakkudo/translator..Translator+setLocalization)
    * [.mergeLocalization(locale, localization)](#module_@zakkudo/translator..Translator+mergeLocalization)
    * [.setLocale(locale)](#module_@zakkudo/translator..Translator+setLocale)
    * [.getLocale()](#module_@zakkudo/translator..Translator+getLocale) ⇒ <code>String</code>
    * [.__(singular, ...leftover)](#module_@zakkudo/translator..Translator+__) ⇒ <code>String</code>
    * [.__n(singular, plural, quantity, ...leftover)](#module_@zakkudo/translator..Translator+__n) ⇒ <code>String</code>

<a name="new_module_@zakkudo/translator..Translator_new"></a>

#### new Translator()
Generate an instance of the translator.

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
<a name="module_@zakkudo/translator..Translator+__"></a>

#### translator.__(singular, ...leftover) ⇒ <code>String</code>
Get the mapping for a specific string using the currently set locale.  If the mapping does
not exist, the value is passed through.

**Kind**: instance method of [<code>Translator</code>](#module_@zakkudo/translator..Translator)  
**Returns**: <code>String</code> - The localized string if it exists, otherwise the text is passed through as a fallback  

| Param | Type | Description |
| --- | --- | --- |
| singular | <code>String</code> | The string to localize |
| ...leftover | <code>Array.&lt;String&gt;</code> | Leftover arguments to use for interpolation where `%d` or `%s` is used |

<a name="module_@zakkudo/translator..Translator+__n"></a>

#### translator.__n(singular, plural, quantity, ...leftover) ⇒ <code>String</code>
Translates a plural string.

**Kind**: instance method of [<code>Translator</code>](#module_@zakkudo/translator..Translator)  
**Returns**: <code>String</code> - The localized string if it exists, otherwise the text is passed through as a fallback  

| Param | Type | Description |
| --- | --- | --- |
| singular | <code>String</code> | The singular version of the string, such as `%s apple` |
| plural | <code>String</code> | The plural version of the string, such as `%s apples` |
| quantity | <code>Number</code> | Count used to determine which version is used |
| ...leftover | <code>Array.&lt;String&gt;</code> | Other interpolation arguments similar to the singular form of this function |

