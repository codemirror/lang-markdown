import {Language, defineLanguageFacet, languageDataProp, foldNodeProp, indentNodeProp,
        LanguageDescription, ParseContext} from "@codemirror/language"
import {parser as baseParser, MarkdownParser, GFM, Subscript, Superscript, Emoji} from "@lezer/markdown"

const data = defineLanguageFacet({block: {open: "<!--", close: "-->"}})

const commonmark = baseParser.configure({
  props: [
    foldNodeProp.add(type => {
      if (!type.is("Block") || type.is("Document")) return undefined
      return (tree, state) => ({from: state.doc.lineAt(tree.from).to, to: tree.to})
    }),
    indentNodeProp.add({
      Document: () => null
    }),
    languageDataProp.add({
      Document: data
    })
  ]
})

export function mkLang(parser: MarkdownParser) {
  return new Language(data, parser)
}

/// Language support for strict CommonMark.
export const commonmarkLanguage = mkLang(commonmark)

const extended = commonmark.configure([GFM, Subscript, Superscript, Emoji])

/// Language support for [GFM](https://github.github.com/gfm/) plus
/// subscript, superscript, and emoji syntax.
export const markdownLanguage = mkLang(extended)

export function getCodeParser(languages: readonly LanguageDescription[],
                              defaultLanguage?: Language) {
  return (info: string) => {
    let found = info && LanguageDescription.matchLanguageName(languages, info, true)
    if (!found) return defaultLanguage ? defaultLanguage.parser : null
    if (found.support) return found.support.language.parser
    return ParseContext.getSkippingParser(found.load())
  }
}
