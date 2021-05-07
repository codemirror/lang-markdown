## 0.18.2 (2021-05-07)

### Bug fixes

Fix a bug where `insertNewlineContinueMarkup` could duplicate bits of content when in dededented continued list items.

## 0.18.1 (2021-04-01)

### Bug fixes

Add `monospace` style tag to all children of inline code nodes.

## 0.18.0 (2021-03-03)

### Breaking changes

Update dependencies to 0.18.

## 0.17.3 (2021-02-22)

### New features

Include heading depth in style tags.

## 0.17.2 (2021-02-10)

### Bug fixes

Fix a bug where `insertNewlineContinueMarkup` would sometimes duplicate bits of content.

### New features

The package now exports both a `commonmarkLanguage`, with just plain CommonMark, and a `markdownLanguage`, with GFM and some other extensions enabled.

It is now possible to pass lezer-markdown extensions to the `markdown` function to configure the parser.

## 0.17.1 (2021-01-06)

### New features

The package now also exports a CommonJS module.

## 0.17.0 (2020-12-29)

### Breaking changes

First numbered release.

