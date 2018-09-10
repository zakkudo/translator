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

