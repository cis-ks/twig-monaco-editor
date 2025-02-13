import {CancellationToken, editor, languages, Position, Range} from "monaco-editor";
import CompletionItemProvider = languages.CompletionItemProvider;
import {CompletionOptions} from './types'
import CompletionItemKind = languages.CompletionItemKind;
import {controlCompletion, isComparisationCompletion} from "./definitions";
import CompletionItem = languages.CompletionItem;
import {completionGenerator} from "./generator"

export class twigCompletionProvider implements CompletionItemProvider {

    private currentWord: editor.IWordAtPosition
    private previousWord: editor.IWordAtPosition
    private lineContent: string
    private wordRange: Range
    private openTagsList: string[]
    private listStatementsList: string[][]
    private setStatementsList: string[][]

    constructor(
        protected readonly completionOptions: CompletionOptions = {},
        protected readonly customFilterOptions: CompletionOptions = {},
        protected readonly customFunctionOptions: CompletionOptions = {}
    ) {
    }
    provideCompletionItems(
        model: editor.ITextModel,
        position: Position,
        context: languages.CompletionContext,
        token: CancellationToken
    ): languages.ProviderResult<languages.CompletionList> {
        this.currentWord = model.getWordUntilPosition(position)
        this.previousWord = model.getWordUntilPosition(new Position(position.lineNumber, this.currentWord.startColumn - 1))
        this.lineContent = model.getValueInRange(new Range(position.lineNumber, 1, position.lineNumber, this.currentWord.startColumn))
        this.wordRange = new Range(position.lineNumber, this.currentWord.startColumn, position.lineNumber, this.currentWord.endColumn)

        this.openTagsList = this.openTags(model, position.lineNumber)
        this.listStatementsList = this.listStatements(model, position.lineNumber)
        this.setStatementsList = this.setStatements(model, position.lineNumber)

        console.log('currentWord', this.currentWord)
        console.log('previousWord', this.previousWord)
        console.log('lineContent', this.lineContent)
        console.log('openTags', this.openTagsList)
        console.log('listStatements', this.listStatementsList)
        console.log('setStatements', this.setStatementsList)

        let suggestionsOptions = {}

        if (this.lineContent.match(/.*{%[^}]+$/)) {
            suggestionsOptions = this.resolveControl()
        } else if (this.lineContent.match(/.*{{[^}]+$/)) {
            suggestionsOptions = this.resolveOutput()
        } else {
            return {
                suggestions: []
            }
        }

        return {
            suggestions: this.completion(suggestionsOptions)
        }
    }

    protected openTags(model: editor.ITextModel, line: number): string[] {
        const re = /{%[~-]?\s*([^ ]+)/g

        let openTags: string[] = []
        let lastTag: string = ''
        let m: RegExpExecArray | null;

        let content = model.getValueInRange(new Range(1, 1, line, this.currentWord.startColumn))

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

    protected listStatements(model: editor.ITextModel, line: number): string[][]
    {
        const controls = model.getValueInRange(new Range(1, 1, line, this.currentWord.startColumn))
            .matchAll(/{%\s*(for|endfor)(?: ([^ ]+) in ([^ ]+))?/g)
        let listStatements = []

        for (const control of controls) {
            if (control[1] == 'for') {
                listStatements.push(control)
            } else if (control[1] == 'endfor') {
                listStatements.splice(-1)
            }
        }

        return listStatements
    }

    protected setStatements(model: editor.ITextModel, line: number): string[][]
    {
        const controls = model.getValueInRange(new Range(1, 1, line, this.currentWord.startColumn))
            .matchAll(/{%\s*set\s+([^ ]+)\s*=/g)

        return Object.values(controls)
    }

    protected resolveControl(): object {
        let completionObjects = {}

        if (this.lineContent.trim().slice(-2) == '{%') {
            completionObjects = this.controlWords();
        } else if (this.previousWord.word == 'is') {
            completionObjects = isComparisationCompletion;
        } else {
            completionObjects = this.resolveOutput()
        }

        return completionObjects
    }

    private controlWords() {
        return Object.keys(controlCompletion)
            .filter(key => (!key.startsWith('end') && key !== 'elseif')
                || key === ('end' + this.openTagsList.slice(-1))
                || (key === 'elseif' && this.openTagsList.slice(-1)[0] == 'if')
                || (key === 'endif' && this.openTagsList.slice(-1)[0] == 'elseif')
            )
            .reduce((obj, key) => {
                obj[key] = controlCompletion[key];
                return obj;
            }, {})
    }

    protected resolveOutput(): object {
        // throw Error('Method not implemented')
        console.log('----------------------------- output')
        return {}
    }

    completion(
        options: CompletionOptions,
        defaultKind: CompletionItemKind = languages.CompletionItemKind.Property,
        defaultDetail: string = 'string'
    ): CompletionItem[] {
        const generator = new completionGenerator(options, this.wordRange, defaultKind, defaultDetail)
        return generator.resolve()
    }
}