import {Prec} from "@codemirror/state"
import {KeyBinding, keymap} from "@codemirror/view"
import {Language, LanguageSupport, LanguageDescription} from "@codemirror/language"
import {commonmarkLanguage, markdownLanguage, mkLang, getCodeParser, htmlNoMatch} from "./markdown"
import {MarkdownExtension, MarkdownParser, parseCode} from "@lezer/markdown"
import {insertNewlineContinueMarkup, deleteMarkupBackward} from "./commands"
export {commonmarkLanguage, markdownLanguage, insertNewlineContinueMarkup, deleteMarkupBackward}

/// A small keymap with Markdown-specific bindings. Binds Enter to
/// [`insertNewlineContinueMarkup`](#lang-markdown.insertNewlineContinueMarkup)
/// and Backspace to
/// [`deleteMarkupBackward`](#lang-markdown.deleteMarkupBackward).
export const markdownKeymap: readonly KeyBinding[] = [
  {key: "Enter", run: insertNewlineContinueMarkup},
  {key: "Backspace", run: deleteMarkupBackward}
]

/// Markdown language support.
export function markdown(config: {
  /// When given, this language will be used by default to parse code
  /// blocks.
  defaultCodeLanguage?: Language,
  /// A collection of language descriptions to search through for a
  /// matching language (with
  /// [`LanguageDescription.matchLanguageName`](#language.LanguageDescription^matchLanguageName))
  /// when a fenced code block has an info string.
  codeLanguages?: readonly LanguageDescription[],
  /// Set this to false to disable installation of the Markdown
  /// [keymap](#lang-markdown.markdownKeymap).
  addKeymap?: boolean,
  /// Markdown parser
  /// [extensions](https://github.com/lezer-parser/markdown#user-content-markdownextension)
  /// to add to the parser.
  extensions?: MarkdownExtension,
  /// The base language to use. Defaults to
  /// [`commonmarkLanguage`](#lang-markdown.commonmarkLanguage).
  base?: Language
} = {}) {
  let {codeLanguages, defaultCodeLanguage, addKeymap = true, base: {parser} = commonmarkLanguage} = config
  let extensions = config.extensions ? [config.extensions] : []
  if (!(parser instanceof MarkdownParser)) throw new RangeError("Base parser provided to `markdown` should be a Markdown parser")
  let codeParser = codeLanguages || defaultCodeLanguage ? getCodeParser(codeLanguages || [], defaultCodeLanguage) : undefined
  extensions.push(parseCode({codeParser, htmlParser: htmlNoMatch}))
  return new LanguageSupport(mkLang(parser.configure(extensions)),
                             addKeymap ? Prec.extend(keymap.of(markdownKeymap)) : [])
}
