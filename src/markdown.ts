import {Language, defineLanguageFacet, languageDataProp, foldNodeProp, indentNodeProp,
        LanguageDescription, EditorParseContext} from "@codemirror/language"
import {styleTags, tags as t} from "@codemirror/highlight"
import {parser as baseParser, MarkdownParser, MarkdownExtension, GFM, Subscript, Superscript, Emoji} from "lezer-markdown"
import {htmlLanguage} from "@codemirror/lang-html"

const data = defineLanguageFacet({block: {open: "<!--", close: "-->"}})

const commonmark = baseParser.configure({
  props: [
    styleTags({
      "Blockquote/...": t.quote,
      HorizontalRule: t.contentSeparator,
      "ATXHeading1/... SetextHeading1/...": t.heading1,
      "ATXHeading2/... SetextHeading2/...": t.heading2,
      "ATXHeading3/...": t.heading3,
      "ATXHeading4/...": t.heading4,
      "ATXHeading5/...": t.heading5,
      "ATXHeading6/...": t.heading6,
      "Comment CommentBlock": t.comment,
      Escape: t.escape,
      Entity: t.character,
      "Emphasis/...": t.emphasis,
      "StrongEmphasis/...": t.strong,
      "Link/... Image/...": t.link,
      "OrderedList/... BulletList/...": t.list,
      "BlockQuote/...": t.quote,
      InlineCode: t.monospace,
      URL: t.url,
      "HeaderMark HardBreak QuoteMark ListMark LinkMark EmphasisMark CodeMark": t.processingInstruction,
      "CodeInfo LinkLabel": t.labelName,
      LinkTitle: t.string
    }),
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
  ],
  htmlParser: htmlLanguage.parser.configure({dialect: "noMatch"}),
})

/// Language support for strict CommonMark.
export const commonmarkLanguage = mkLang(commonmark)

const extended = commonmark.configure([GFM, Subscript, Superscript, Emoji, {
  props: [
    styleTags({
      "TableDelimiter SubscriptMark SuperscriptMark StrikethroughMark": t.processingInstruction,
      "TableHeader/...": t.heading,
      "Strikethrough/...": t.deleted,
      "TaskMarker": t.atom,
      "Emoji": t.character,
      "Subscript Superscript": t.special(t.content)
    })
  ]
}])

/// Language support for [GFM](https://github.github.com/gfm/) plus
/// subscript, superscript, and emoji syntax.
export const markdownLanguage = mkLang(extended)

export function mkLang(parser: MarkdownParser) { return new Language(data, parser) }

// Create an instance of the Markdown language that will, for code
// blocks, try to find a language that matches the block's info
// string in `languages` or, if none if found, use `defaultLanguage`
// to parse the block.
export function addCodeLanguages(
  languages: readonly LanguageDescription[],
  defaultLanguage?: Language,
): MarkdownExtension {
  return {
    codeParser(info: string) {
      let found = info && LanguageDescription.matchLanguageName(languages, info, true)
      if (!found) return defaultLanguage ? defaultLanguage.parser : null
      if (found.support) return found.support.language.parser
      found.load()
      return EditorParseContext.skippingParser
    }
  }
}
