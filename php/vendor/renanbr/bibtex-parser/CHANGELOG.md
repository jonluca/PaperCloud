## Changes in renanbr/bibtex-parser

### [0.3.0](https://github.com/renanbr/bibtex-parser/releases/tag/0.3.0) - 06/01/2017

#### Fixed

- None.

#### Added

- Ability to process tag value through `Listener::setTagValueProcessor()`.

### [0.2.0](https://github.com/renanbr/bibtex-parser/releases/tag/0.2.0) - 17/12/2016

#### Fixed

- Trailing comma support;
- Allow underscore in tag name.

#### Added

- Original BibTeX entries are sent to the listeners with the status `Parser::ORIGINAL_ENTRY` just after each entry reading is done;
- `Listener::export()` produces entries with an additional key called `_original`, which contains the original BibTex entry;
- Ability to change the tag name case through `Listener::setTagNameCase()`.

### [0.1.0](https://github.com/renanbr/bibtex-parser/releases/tag/0.1.0) - 29/11/2016

- First release.
