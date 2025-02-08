import {CancellationToken, editor, languages, Position, Range} from "monaco-editor";
import CompletionItemProvider = languages.CompletionItemProvider;
import {CompletionOptions} from './types'
import CompletionItemKind = languages.CompletionItemKind;

export class twigCompletionProvider implements CompletionItemProvider {
    constructor(
        protected readonly completionOptions: CompletionOptions = {},
        protected readonly customFilterOptions: CompletionOptions = {},
        protected readonly customFunctionOptions: CompletionOptions = {}
    ) {
    }
    provideCompletionItems(model: editor.ITextModel, position: Position, context: languages.CompletionContext, token: CancellationToken): languages.ProviderResult<languages.CompletionList> {
        const currentWord = model.getWordUntilPosition(position)
        const previousWord = model.getWordUntilPosition(new Position(position.lineNumber, currentWord.startColumn - 1))
        const lineContent = model.getValueInRange(new Range(position.lineNumber, 1, position.lineNumber, currentWord.startColumn))
        const previousChar = lineContent.slice(-1)
        const wordRange = new Range(position.lineNumber, currentWord.startColumn, position.lineNumber, currentWord.endColumn)

        const openTags = this.openTags(model, position.lineNumber, currentWord)
        const listStatements = this.listStatements(model, position.lineNumber, currentWord)


        const currentStatement = lineContent.substring(Math.max(
            lineContent.lastIndexOf(" "),
            lineContent.lastIndexOf("|")
        ) + 1)

        if (lineContent.match(/.*{%[^}]+$/)) {
            this.resolveControl(currentWord, previousWord, lineContent, previousChar, wordRange, openTags, currentStatement)
        } else if (lineContent.match(/.*{{[^}]+$/)) {
            this.resolveOutput(currentWord, previousWord, lineContent, previousChar, wordRange, openTags, currentStatement)
        } else {
            return {
                suggestions: []
            }
        }
    }

    protected openTags(model: editor.ITextModel, line: number, word: editor.IWordAtPosition): string[] {
        const re = /{%[~-]?\s*([^ ]+)/g

        let openTags: string[] = []
        let lastTag: string = ''
        let m: RegExpExecArray | null;

        let content = model.getValueInRange(new Range(1, 1, line, word.startColumn))

        while (m = re.exec(content)) {
            if (m[1] === ('end' + lastTag) && openTags.length) {
                openTags.pop()
                lastTag = openTags.length ? openTags.at(-1) : ''
            } else {
                openTags.push(m[1])
                lastTag = m[1]
            }
        }

        return openTags
    }

    protected listStatements(model: editor.ITextModel, line: number, word: editor.IWordAtPosition): string[]
    {
        throw Error('Method not implemented')
    }

    protected resolveControl(
        currentWord: editor.IWordAtPosition,
        previousWord: editor.IWordAtPosition,
        lineContent: string,
        previousChar: string,
        wordRange: Range,
        openTags: string[],
        currentStatement: string
    ) {
        throw Error('Method not implemented')
    }

    protected resolveOutput(
        currentWord: editor.IWordAtPosition,
        previousWord: editor.IWordAtPosition,
        lineContent: string,
        previousChar: string,
        wordRange: Range,
        openTags: string[],
        currentStatement: string
    ) {
        throw Error('Method not implemented')
    }

    completion(
        options: CompletionOptions,
        range: Range,
        defaultKind: CompletionItemKind = languages.CompletionItemKind.Property,
        defaultDetail: string = 'string'
    ) {
        // pass
    }
}