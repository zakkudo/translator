import { describe, it, expect } from "@jest/globals";
import Translator from ".";

const ENGLISH_HEADER = `Plural-Forms: nplurals=2; plural=n != 1`;
const JAPANESE_HEADER = `Plural-Forms: nplurals=1; plural=0`;
const FRENCH_HEADER = `Plural-Forms: nplurals=2; plural=n>1`;

describe("Translator", () => {
  it("constructs", () => {
    new Translator();
  });

  describe("locale", () => {
    it("returns default when unset", () => {
      const translator = new Translator();

      expect(translator.locale).toEqual("");
    });
  });

  it("can destructure localization methods", () => {
    const translator = new Translator();
    const {
      gettext: __,
      ngettext: __n,
      npgettext: __np,
      pgettext: __p,
    } = translator;

    expect(__("test string")).toEqual("test string");
    expect(__n("test singular", "test plural", 2)).toEqual("test plural");
    expect(__np("test context", "test singular", "test plural", 2)).toEqual(
      "test plural"
    );
    expect(__p("test context", "test string")).toEqual("test string");
  });

  describe("setLocalization", () => {
    it("sets the new localization", () => {
      const translator = new Translator();

      expect(translator.gettext("test")).toEqual("test");

      translator.setLocalization("test-locale", {
        "": ENGLISH_HEADER,
        test: "localized text",
      });
      expect(translator.gettext("test")).toEqual("test");

      translator.locale = "test-locale";
      expect(translator.gettext("test")).toEqual("localized text");
    });

    it("throws an exception when the localization has no headers", () => {
      const translator = new Translator();

      expect(() => translator.setLocalization("test-locale", {})).toThrow();
    });

    it("throws an exception when value is null", () => {
      const translator = new Translator();

      expect(() =>
        translator.setLocalization("test-locale", {
          "": ENGLISH_HEADER,
          "test-key": null,
        })
      ).toThrow(TypeError);
    });

    it("throws an exception when value is null 2", () => {
      const translator = new Translator();

      expect(() =>
        translator.setLocalization("test-locale", {
          "": ENGLISH_HEADER,
          "test-key": null,
        })
      ).toThrow(TypeError);
    });

    it("throws an exception when value is null 2", () => {
      const translator = new Translator();

      expect(() =>
        translator.setLocalization("test-locale", {
          "": ENGLISH_HEADER,
          "test-key": { "test context": null },
        })
      ).toThrow(TypeError);
    });
  });

  describe("mergeLocalization", () => {
    it("merges in the locale when none exists", () => {
      const translator = new Translator();

      expect(translator.gettext("test")).toEqual("test");

      translator.mergeLocalization("test-locale", {
        "": ENGLISH_HEADER,
        test: "localized text",
      });
      expect(translator.gettext("test")).toEqual("test");

      translator.locale = "test-locale";
      expect(translator.gettext("test")).toEqual("localized text");
    });

    it("merges together two localizations", () => {
      const translator = new Translator("test-locale");

      translator.setLocalization("test-locale", {
        "": ENGLISH_HEADER,
        "test-key": "localized text",
        "test-singular-key-that-will-be-replaced": "original localized text",
        "test-plural-key-that-will-be-replaced": [
          "%d original localized text",
          "%d original localized texts",
        ],
      });

      expect(
        translator.gettext("test-singular-key-that-will-be-replaced")
      ).toEqual("original localized text");

      translator.mergeLocalization("test-locale", {
        "test-singular-key-that-will-be-replaced": "replaced localized text",
        "test-plural-key-that-will-be-replaced:plural": [
          "%d replaced localized text",
          "%d replaced localized texts",
        ],
      });

      expect(
        translator.gettext("test-singular-key-that-will-be-replaced")
      ).toEqual("replaced localized text");
      expect(
        translator.ngettext(
          "test-plural-key-that-will-be-replaced",
          "plural",
          1
        )
      ).toEqual("1 replaced localized text");
      expect(
        translator.ngettext(
          "test-plural-key-that-will-be-replaced",
          "plural",
          2
        )
      ).toEqual("2 replaced localized texts");
      expect(translator.gettext("test-key")).toEqual("localized text");
    });

    it("throws an error when merging with no header and no header preexists", () => {
      const translator = new Translator("test-locale");

      expect(() => translator.mergeLocalization("test-locale", {})).toThrow();
    });
  });

  describe("locale", () => {
    it("sets the locale when none exists", () => {
      const translator = new Translator();

      expect(translator.gettext("test")).toEqual("test");

      translator.setLocalization("test-locale", {
        "": ENGLISH_HEADER,
        test: "localized text",
      });
      expect(translator.gettext("test")).toEqual("test");

      translator.locale = "test-locale";
      expect(translator.gettext("test")).toEqual("localized text");
    });
  });

  describe("gettext", () => {
    it("passes through the string when no locale", () => {
      const translator = new Translator();

      translator.locale = "test-locale";

      expect(translator.gettext("test")).toEqual("test");
    });

    it("uses translation when available for locale", () => {
      const translator = new Translator();

      translator.setLocalization("test-locale", {
        "": ENGLISH_HEADER,
        "test text": "test localized text",
      });
      translator.locale = "test-locale";

      expect(translator.gettext("test text")).toEqual("test localized text");
    });

    it("uses passes through when the key isn't found in the locale", () => {
      const translator = new Translator("test-locale");

      translator.setLocalization("test-locale", {
        "": ENGLISH_HEADER,
        "test text": "test localized text",
      });

      expect(translator.gettext("test non-existing text")).toEqual(
        "test non-existing text"
      );
    });
  });

  describe("pgettext", () => {
    it("passes through the string when no locale", () => {
      const translator = new Translator();

      translator.locale = "test-locale";

      expect(translator.pgettext("test context", "test")).toEqual("test");
    });

    it("uses translation when available for locale", () => {
      const translator = new Translator();

      translator.setLocalization("test-locale", {
        "": ENGLISH_HEADER,
        "test text": {
          "test context": "test localized text",
        },
      });
      translator.locale = "test-locale";

      expect(translator.pgettext("test context", "test text")).toEqual(
        "test localized text"
      );
    });

    it("uses passes through when the key isn't found in the locale", () => {
      const translator = new Translator();

      translator.setLocalization("test-locale", {
        "": ENGLISH_HEADER,
        "test text": {
          "test context": "test localized text",
        },
      });
      translator.locale = "test-locale";

      expect(
        translator.pgettext("test context", "test non-existing text")
      ).toEqual("test non-existing text");
    });
  });

  describe("ngettext", () => {
    it("internal data needs the colon to be escaped for keys", () => {
      const translator = new Translator("test-locale");
      translator.setLocalization("test-locale", {
        "": ENGLISH_HEADER,
        "real\\u{3A}tex\\u{5C}t": "localized text",
        "real\\u{3A}singular:real\\u{3A}plural": [
          "localized singular",
          "localized plural",
        ],
      });

      translator.locale = "test-locale";

      expect(translator.gettext("real:tex\\t")).toEqual("localized text");

      expect(translator.ngettext("real:singular", "real:plural", 1)).toEqual(
        "localized singular"
      );

      expect(translator.ngettext("real:singular", "real:plural", 2)).toEqual(
        "localized plural"
      );
    });

    describe("Singular", () => {
      it("passes through the singular string when no locale", () => {
        const translator = new Translator();

        translator.locale = "test-locale";

        expect(translator.ngettext("one test", "%d tests", 1)).toEqual(
          "one test"
        );
      });

      it("uses translation when available for locale, even when others are missing", () => {
        const translator = new Translator("test-locale");

        translator.setLocalization("test-locale", {
          "": ENGLISH_HEADER,
          "one test:%d tests": ["one localized test"],
        });

        expect(translator.ngettext("one test", "%d tests", 1)).toEqual(
          "one localized test"
        );
      });

      it("uses passes through when the key isn't found in the locale", () => {
        const translator = new Translator();

        translator.setLocalization("test-locale", {
          "": ENGLISH_HEADER,
          "one test": ["one localized test"],
        });
        translator.locale = "test-locale";

        expect(
          translator.ngettext("one other test", "%d other tests", 1)
        ).toEqual("one other test");
      });

      it("uses other when the one key isn't found in the locale", () => {
        const translator = new Translator("test-locale");

        translator.setLocalization("test-locale", {
          "": ENGLISH_HEADER,
          "one test:%d tests": [undefined, "%d localized tests"],
        });
        translator.locale = "test-locale";

        expect(translator.ngettext("one test", "%d tests", 2)).toEqual(
          "2 localized tests"
        );
      });

      it("uses passthrough when the one key isn't found in the locale", () => {
        const translator = new Translator();

        translator.setLocalization("test-locale", {
          "": ENGLISH_HEADER,
          "one test": {},
        });
        translator.locale = "test-locale";

        expect(translator.ngettext("one test", "%d tests", 1)).toEqual(
          "one test"
        );
      });
    });

    describe("Plural", () => {
      it("passes through the singular string when no locale", () => {
        const translator = new Translator();

        translator.locale = "test-locale";

        expect(translator.ngettext("one test", "%d tests", 2)).toEqual(
          "2 tests"
        );
      });

      it("uses translation when available for locale", () => {
        const translator = new Translator();

        translator.setLocalization("test-locale", {
          "": ENGLISH_HEADER,
          "one test:%d tests": ["one localized test", "%d localized tests"],
        });
        translator.locale = "test-locale";

        expect(translator.ngettext("one test", "%d tests", 2)).toEqual(
          "2 localized tests"
        );
      });
    });
  });

  describe("npgettext", () => {
    describe("Singular", () => {
      it("passes through the singular string when no locale", () => {
        const translator = new Translator();

        translator.locale = "test-locale";

        expect(
          translator.npgettext("test context", "one test", "%d tests", 1)
        ).toEqual("one test");
      });

      it("returns the fallback plural when no matching", () => {
        const translator = new Translator();

        translator.locale = "test-locale";

        expect(
          translator.npgettext("test context", "one test", "%d tests", 2)
        ).toEqual("2 tests");
      });

      it("uses translation when available for locale", () => {
        const translator = new Translator();

        translator.setLocalization("test-locale", {
          "": ENGLISH_HEADER,
          "one test:%d tests": {
            "test context": ["one localized test"],
          },
        });
        translator.locale = "test-locale";

        expect(
          translator.npgettext("test context", "one test", "%d tests", 1)
        ).toEqual("one localized test");
      });

      it("uses passes through when the key isn't found in the locale", () => {
        const translator = new Translator();

        translator.setLocalization("test-locale", {
          "": ENGLISH_HEADER,
          "one test": {
            "test context": ["one localized test"],
          },
        });
        translator.locale = "test-locale";

        expect(
          translator.npgettext(
            "test context",
            "one other test",
            "%d other tests",
            1
          )
        ).toEqual("one other test");
      });

      it("uses fallback if single plural is missing", () => {
        const translator = new Translator();

        translator.setLocalization("test-locale", {
          "": ENGLISH_HEADER,
          "one test:%d tests": {
            "test context": [undefined, "%d localized tests"],
          },
        });
        translator.locale = "test-locale";

        expect(
          translator.npgettext("test context", "one test", "%d tests", 1)
        ).toEqual("one test");
      });

      it("uses passthrough when the one key isn't found in the locale", () => {
        const translator = new Translator();

        translator.setLocalization("test-locale", {
          "": ENGLISH_HEADER,
          "one test": {},
        });

        expect(
          translator.npgettext("test context", "one test", "%d tests", 1)
        ).toEqual("one test");
      });
    });

    describe("Plural", () => {
      it("passes through the singular string when no locale", () => {
        const translator = new Translator();

        translator.locale = "test-locale";

        expect(
          translator.npgettext("test context", "one test", "%d tests", 2)
        ).toEqual("2 tests");
      });

      it("uses translation when available for locale", () => {
        const translator = new Translator();

        translator.setLocalization("test-locale", {
          "": ENGLISH_HEADER,
          "one test:%d tests": {
            "test context": ["one localized test", "%d localized test"],
          },
        });
        translator.locale = "test-locale";

        expect(
          translator.npgettext("test context", "one test", "%d tests", 2)
        ).toEqual("2 localized test");
      });
    });
  });

  it("pluralizes english headers correctly", () => {
    const translator = new Translator("en-US");

    translator.setLocalization("en-US", {
      "": ENGLISH_HEADER,
      "one test:%d tests": ["%d localized test", "%d localized tests"],
    });

    expect(translator.ngettext("one test", "%d tests", 0)).toEqual(
      "0 localized tests"
    );
    expect(translator.ngettext("one test", "%d tests", 1)).toEqual(
      "1 localized test"
    );
    expect(translator.ngettext("one test", "%d tests", 2)).toEqual(
      "2 localized tests"
    );
  });

  it("pluralizes french headers correctly", () => {
    const translator = new Translator("fr-FR");

    translator.setLocalization("fr-FR", {
      "": FRENCH_HEADER,
      "one test:%d tests": ["%d localized test", "%d localized tests"],
    });

    expect(translator.ngettext("one test", "%d tests", 0)).toEqual(
      "0 localized test"
    );
    expect(translator.ngettext("one test", "%d tests", 1)).toEqual(
      "1 localized test"
    );
    expect(translator.ngettext("one test", "%d tests", 2)).toEqual(
      "2 localized tests"
    );
  });

  it("pluralizes french headers correctly", () => {
    const translator = new Translator("ja-JP");

    translator.setLocalization("ja-JP", {
      "": JAPANESE_HEADER,
      "one test:%d tests": ["%d localized test"],
    });

    expect(translator.ngettext("one test", "%d tests", 0)).toEqual(
      "0 localized test"
    );
    expect(translator.ngettext("one test", "%d tests", 1)).toEqual(
      "1 localized test"
    );
    expect(translator.ngettext("one test", "%d tests", 2)).toEqual(
      "2 localized test"
    );
  });

  it("pluralizes the fallback the same as English", () => {
    const translator = new Translator("non-existing-language");

    expect(translator.ngettext("%d test", "%d tests", 0)).toEqual("0 tests");
    expect(translator.ngettext("%d test", "%d tests", 1)).toEqual("1 test");
    expect(translator.ngettext("%d test", "%d tests", 2)).toEqual("2 tests");
  });

  describe("interpolation", () => {
    it("returns a an array when object not serializable", () => {
      const translator = new Translator("non-existing-language");
      const instance = {};

      expect(translator.gettext("%s test", instance)).toEqual(
        "[object Object] test"
      );
    });

    it("returns a string when object is serializable", () => {
      const translator = new Translator("non-existing-language");
      const instance = { toString: () => "test-serialization" };

      expect(translator.gettext("%s test", instance)).toEqual(
        "test-serialization test"
      );
    });

    it("can use positional arguments", () => {
      const translator = new Translator("non-existing-language");

      expect(translator.gettext("%2$s %1$s test", "one", "two")).toEqual(
        "two one test"
      );
    });

    describe("reference", () => {
      it("can do basic interpolation", () => {
        const translator = new Translator("non-existing-language");

        expect(
          translator.gettext("%r test", { "test key": "test-value" })
        ).toEqual(["", { "test key": "test-value" }, " test"]);
      });

      it("can do placement interpolation", () => {
        const translator = new Translator("non-existing-language");

        expect(
          translator.gettext("%2$r test", 3, { "test key": "test-value" })
        ).toEqual(["", { "test key": "test-value" }, " test"]);
      });

      it("can use positional arguments", () => {
        const translator = new Translator("non-existing-language");

        expect(translator.gettext("%2$r %r test", "one", "two")).toEqual([
          "",
          "two",
          " ",
          "one",
          " test",
        ]);
      });
    });
  });
});
