/*eslint max-len: ["error", {"ignoreStrings": true}]*/

import Translator from '.';

describe('Translator', () => {
    it('constructs', () => {
        new Translator();
    });

    describe('getLocale', () => {
        it('returns default when unset', () => {
            const translator = new Translator();

            expect(translator.getLocale()).toEqual('default');
        });
    });

    describe('setLocalization', () => {
        it('sets the new localization', () => {
            const translator = new Translator();

            expect(translator.__('test')).toEqual('test');

            translator.mergeLocalization('test locale', {'test': 'localized text'});
            expect(translator.__('test')).toEqual('test');

            translator.setLocale('test locale');
            expect(translator.__('test')).toEqual('localized text');
        });

        it('throws an exception when trying to overwrite the default localization', () => {
            const translator = new Translator();

            expect(translator.__('test')).toEqual('test');

            expect(() => {
                translator.setLocalization('default', {});
            }).toThrow(new TypeError(
                'Cannot overwrite the read-only fallthrough locale, "default"'
            ));
        });
    });

    describe('mergeLocalization', () => {
        it('merges in the locale when none exists', () => {
            const translator = new Translator();

            expect(translator.__('test')).toEqual('test');

            translator.mergeLocalization('test locale', {'test': 'localized text'});
            expect(translator.__('test')).toEqual('test');

            translator.setLocale('test locale');
            expect(translator.__('test')).toEqual('localized text');
        });

        it('throws an exception when trying to overwrite the default localization', () => {
            const translator = new Translator();

            expect(translator.__('test')).toEqual('test');

            expect(() => {
                translator.mergeLocalization('default', {});
            }).toThrow(new TypeError(
                'Cannot merge into the read-only fallthrough locale, "default"'
            ));
        });
    });

    describe('setLocale', () => {
        it('sets the locale when none exists', () => {
            const translator = new Translator();

            expect(translator.__('test')).toEqual('test');

            translator.setLocalization('test locale', {'test': 'localized text'});
            expect(translator.__('test')).toEqual('test');

            translator.setLocale('test locale');
            expect(translator.__('test')).toEqual('localized text');
        });
    });

    describe('__', () => {
        it('passes through the string when no locale', () => {
            const translator = new Translator();

            translator.setLocale('test locale');

            expect(translator.__('test')).toEqual('test');
        });

        it('uses translation when available for locale', () => {
            const translator = new Translator();

            translator.setLocalization('test locale', {
                'test text': 'test localized text'
            });
            translator.setLocale('test locale');

            expect(translator.__('test text')).toEqual('test localized text');
        });

        it("uses passes through when the key isn't found in the locale", () => {
            const translator = new Translator();

            translator.setLocalization('test locale', {
                'test text': 'test localized text'
            });
            translator.setLocale('test locale');

            expect(translator.__('test non-existing text')).toEqual('test non-existing text');
        });
    });

    describe('__p', () => {
        it('passes through the string when no locale', () => {
            const translator = new Translator();

            translator.setLocale('test locale');

            expect(translator.__p('test context', 'test')).toEqual('test');
        });

        it('uses translation when available for locale', () => {
            const translator = new Translator();

            translator.setLocalization('test locale', {
                'test text': {
                    'test context': 'test localized text'
                }
            });
            translator.setLocale('test locale');

            expect(translator.__p('test context', 'test text')).toEqual('test localized text');
        });

        it("uses passes through when the key isn't found in the locale", () => {
            const translator = new Translator();

            translator.setLocalization('test locale', {
                'test text': {
                    'test context': 'test localized text'
                }
            });
            translator.setLocale('test locale');

            expect(translator.__p('test context', 'test non-existing text')).toEqual('test non-existing text');
        });
    });

    describe('__n', () => {
        describe('Singular', () => {
          //add test for testing reversing variable order
            it('passes through the singular string when no locale', () => {
                const translator = new Translator();

                translator.setLocale('test locale');

                expect(translator.__n('one test', '%d tests', 1)).toEqual('one test');
            });

            it('uses translation when available for locale', () => {
                const translator = new Translator();

                translator.setLocalization('test locale', {
                    'one test:%d tests': {
                        '0': 'one localized test'
                    }
                });
                translator.setLocale('test locale');

                expect(translator.__n('one test', '%d tests', 1)).toEqual('one localized test');
            });

            it("uses passes through when the key isn't found in the locale", () => {
                const translator = new Translator();

                translator.setLocalization('test locale', {
                    'one test:%d other tests': {
                        '1': 'one localized test'
                    }
                });
                translator.setLocale('test locale');

                expect(translator.__n('one other test', '%d other tests', 1)).toEqual(
                    'one other test'
                );
            });

            it("uses other when the one key isn't found in the locale", () => {
                const translator = new Translator();

                translator.setLocalization('test locale', {
                    'one test:%d tests': {
                        '0': '%d localized tests'
                    }
                });
                translator.setLocale('test locale');

                expect(translator.__n('one test', '%d tests', 1)).toEqual('1 localized tests');
            });

            it("uses passthrough when the one key isn't found in the locale", () => {
                const translator = new Translator();

                translator.setLocalization('test locale', {
                    'one test:%d tests': {
                    }
                });
                translator.setLocale('test locale');

                expect(translator.__n('one test', '%d tests', 1)).toEqual('one test');
            });
        });

        describe('Plural', () => {
            it('passes through the singular string when no locale', () => {
                const translator = new Translator();

                translator.setLocale('test locale');

                expect(translator.__n('one test', '%d tests', 2)).toEqual('2 tests');
            });

            it('uses translation when available for locale', () => {
                const translator = new Translator();

                translator.setLocalization('test locale', {
                    'one test:%d tests': {
                        '0': 'one localized test',
                        '1': '%d localized test'
                    }
                });
                translator.setLocale('test locale');

                expect(translator.__n('one test', '%d tests', 2)).toEqual('2 localized test');
            });
        });
    });

    describe('__np', () => {
        describe('Singular', () => {
            it('passes through the singular string when no locale', () => {
                const translator = new Translator();

                translator.setLocale('test locale');

                expect(translator.__np('test context', 'one test', '%d tests', 1)).toEqual('one test');
            });

            it('returns the fallback plural when no matching', () => {
                const translator = new Translator();

                translator.setLocale('test locale');

                expect(translator.__np('test context', 'one test', '%d tests', 1)).toEqual('one test');
            });

            it('uses translation when available for locale', () => {
                const translator = new Translator();

                translator.setLocalization('test locale', {
                    'one test:%d tests': {
                        'test context': {
                            '0': 'one localized test'
                        }
                    }
                });
                translator.setLocale('test locale');

                expect(translator.__np('test context', 'one test', '%d tests', 1)).toEqual('one localized test');
            });

            it("uses passes through when the key isn't found in the locale", () => {
                const translator = new Translator();

                translator.setLocalization('test locale', {
                    'one test': {
                        'test context': {
                            '1': 'one localized test'
                        }
                    }
                });
                translator.setLocale('test locale');

                expect(translator.__np('test context', 'one other test', '%d other tests', 1)).toEqual(
                    'one other test'
                );
            });

            it("uses other when the one key isn't found in the locale", () => {
                const translator = new Translator();

                translator.setLocalization('test locale', {
                    'one test:%d tests': {
                        'test context': {
                            '0': '%d localized tests'
                        }
                    }
                });
                translator.setLocale('test locale');

                expect(translator.__np('test context', 'one test', '%d tests', 1)).toEqual('1 localized tests');
            });

            it("uses passthrough when the one key isn't found in the locale", () => {
                const translator = new Translator();

                translator.setLocalization('test locale', {
                    'one test': {
                    }
                });

                expect(translator.__np('test context', 'one test', '%d tests', 1)).toEqual('one test');
            });
        });

        describe('Plural', () => {
            it('passes through the singular string when no locale', () => {
                const translator = new Translator();

                translator.setLocale('test locale');

                expect(translator.__np('test context', 'one test', '%d tests', 2)).toEqual('2 tests');
            });

            it('can reverse interpolation order', () => {
                const translator = new Translator();

                translator.setLocale('test locale');

                expect(translator.__np('test context', '%2$s %1$d test', '%2$s %1$d tests', 2, 'reversed')).toEqual('reversed 2 tests');
            });

            it('returns the fallback plural when no matching', () => {
                const translator = new Translator();

                translator.setLocale('test locale');

                expect(translator.__np('test context', 'one test', '%d tests', 2)).toEqual('2 tests');
            });

            it('uses translation when available for locale', () => {
                const translator = new Translator();

                translator.setLocalization('test locale', {
                    'one test:%d tests': {
                        'test context': {
                            '0': 'one localized test',
                            '1': '%d localized test'
                        }
                    }
                });
                translator.setLocale('test locale');

                expect(translator.__np('test context', 'one test', '%d tests', 2)).toEqual('2 localized test');
            });

            it('uses translation when available for locale and has multiple plural header', () => {
                const translator = new Translator();

              translator.setLocalization('test locale', {
                "": {
                  "Plural-Forms": {
                    "nplurals": 3,
                    "plural": "(n==1 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2)"
                  }
                },
                'one test:%d tests': {
                  'test context': {
                    '0': 'one localized test',
                    '1': '%d localized tests',
                    '2': '%d localized testss'
                  }
                }
              });
              translator.setLocale('test locale');

              expect(translator.__np('test context', 'one test', '%d tests', 2)).toEqual('2 localized tests');
            });

            it('uses translation when available for locale and has singlue plural header', () => {
                const translator = new Translator();

              translator.setLocalization('test locale', {
                "": {
                  "Plural-Forms": {
                    "nplurals": 1,
                    "plural": "0"
                  }
                },
                'one test:%d tests': {
                  'test context': {
                    '0': '%d localized test',
                  }
                }
              });
              translator.setLocale('test locale');

              expect(translator.__np('test context', 'one test', '%d tests', 2)).toEqual('2 localized test');
            });
        });
    });
});
