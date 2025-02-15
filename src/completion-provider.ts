import {editor, languages, Position, Range} from "monaco-editor";
import {CompletionOption, CompletionOptions} from './types'
import {controlCompletion, filterCompletion, functionCompletion, isComparisationCompletion} from "./definitions";
import {completionGenerator} from "./generator"
import CompletionItemProvider = languages.CompletionItemProvider;
import CompletionItemKind = languages.CompletionItemKind;
import CompletionItem = languages.CompletionItem;

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
        protected readonly customFunctionOptions: CompletionOptions = {},
        protected defaultCompletionKind: CompletionItemKind = languages.CompletionItemKind.Property
    ) {
    }

    provideCompletionItems(
        model: editor.ITextModel,
        position: Position,
    ): languages.ProviderResult<languages.CompletionList> {
        this.currentWord = model.getWordUntilPosition(position)
        this.previousWord = model.getWordUntilPosition(new Position(position.lineNumber, this.currentWord.startColumn - 1))
        this.lineContent = model.getValueInRange(new Range(position.lineNumber, 1, position.lineNumber, this.currentWord.startColumn))
        this.wordRange = new Range(position.lineNumber, this.currentWord.startColumn, position.lineNumber, this.currentWord.endColumn)

        this.openTagsList = this.openTags(model, position.lineNumber)
        this.listStatementsList = this.listStatements(model, position.lineNumber)
        this.setStatementsList = this.setStatements(model, position.lineNumber)

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
            suggestions: this.completion(suggestionsOptions, this.defaultCompletionKind)
        }
    }

    protected openTags(model: editor.ITextModel, line: number): string[] {
        const re = /{%[~-]?\s*([^ ]+)/g

        const openTags: string[] = []
        let lastTag: string = ''
        let m: RegExpExecArray | null;

        const content = model.getValueInRange(new Range(1, 1, line, this.currentWord.startColumn))

        while ((m = re.exec(content)) !== null) {
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

    protected listStatements(model: editor.ITextModel, line: number): string[][] {
        const controls = model.getValueInRange(new Range(1, 1, line, this.currentWord.startColumn))
            .matchAll(/{%\s*(for|endfor)(?: ((?:(?!\s+in).)+)\s+in (.+)\s%})?/g)
        const listStatements = []

        for (const control of controls) {
            if (control[1] == 'for') {
                listStatements.push(control)
            } else if (control[1] == 'endfor') {
                listStatements.splice(-1)
            }
        }

        return listStatements
    }

    protected setStatements(model: editor.ITextModel, line: number): string[][] {
        const controls = model.getValueInRange(new Range(1, 1, line, this.currentWord.startColumn))
            .matchAll(/{%\s*(set)\s(\S+)\s=\s([^%]+)%}/g)

        return [...controls]
    }

    protected resolveControl(): object {
        // eslint-disable-next-line @typescript-eslint/no-empty-object-type
        let completionObjects: {}

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

    private getStatementSubject(): string {
        const liSpace = this.lineContent.lastIndexOf(' ');
        const liFilter = this.lineContent.lastIndexOf('filter(');

        let statementsSubject = this.lineContent.substring(liSpace)

        if (liFilter > -1) {
            const filterStatement = this.lineContent.substring(liFilter, liSpace);
            const openerLength = [...filterStatement.matchAll(/\(/g)].length
            const closerLength = [...filterStatement.matchAll(/\)/g)].length

            if (openerLength > closerLength) {
                statementsSubject = this.lineContent.substring(
                    this.lineContent.lastIndexOf(' ', this.lineContent.lastIndexOf('filter('))
                )
            }
        }

        return statementsSubject.trimStart()
    }

    private resolveOutput(): object {
        const completionOptions: CompletionOptions = this.enrichCompletionOptions()

        const objects = {}
        let mapObjects = {}
        let mergeObjects = {}

        if (this.lineContent.slice(-1) == '|') {
            mapObjects = {...filterCompletion, ...this.customFilterOptions}
        } else if ([' ', '{'].includes(this.lineContent.slice(-1))) {
            mapObjects = {...functionCompletion, ...this.customFunctionOptions}
            mergeObjects = completionOptions
        } else {
            return this.resolveVariableStatement(completionOptions);
        }

        for (const [key, value] of Object.entries(mapObjects)) {
            if (!Object.prototype.hasOwnProperty.call(value, 'kind')) {
                value["kind"] = CompletionItemKind.Function
            }
            objects[key] = value
        }

        return {...objects, ...mergeObjects}
    }

    private resolveVariableStatement(completionOptions: CompletionOptions) {
        return this.resolveCompletionOption(this.getStatementSubject(), completionOptions)
    }

    private enrichCompletionOptions(): CompletionOptions {
        const completionOptions = this.completionOptions;
        [this.listStatementsList, this.setStatementsList].forEach((liste: string[][]) => {
            for (const opt of liste) {
                const resolvedOption = this.resolveCompletionOption(opt[3].trimEnd(), completionOptions, true)

                if (resolvedOption != undefined && opt[2].includes(',')) {
                    const vals = opt[2].split(',', 2)
                    completionOptions[vals[0].trim()] = {
                        detail: 'integer|string',
                        kind: CompletionItemKind.Keyword
                    }
                    completionOptions[vals[1].trim()] = resolvedOption
                } else if (resolvedOption != undefined) {
                    completionOptions[opt[2]] = resolvedOption
                } else if (opt[1] == 'set') {
                    completionOptions[opt[2]] = {
                        kind: CompletionItemKind.Property
                    }
                }
            }
        })

        return completionOptions
    }

    private resolveCompletionOption(
        statementSubject: string,
        completion: CompletionOptions,
        returnOption: boolean = false
    ): CompletionOption {
        const statements = this.resolveStatement(statementSubject)
        let option: CompletionOption = undefined

        let filterOpen = 0
        for (const statement of statements) {
            if (filterOpen > 0) {
                filterOpen = filterOpen + [...statement[1].matchAll(/\(/g)].length - [...statement[1].matchAll(/\)/g)].length
            } else if (statement[1] in completion) {
                option = completion[statement[1]]
                completion = (completion[statement[1]].subOptions ?? []) as CompletionOptions
            } else if (typeof statement[2] != "undefined" && statement[2] in completion) {
                option = completion[statement[2]]
                completion = (completion[statement[2]].subOptions ?? []) as CompletionOptions

                if (typeof statement[3] !== 'number' && statement[3] in completion) {
                    option = completion[statement[3]]
                    completion = completion[statement[3]].subOptions as CompletionOptions ?? {}
                }
            } else if (statement[0].startsWith('|filter')) {
                filterOpen = [...statement[1].matchAll(/\(/g)].length - [...statement[1].matchAll(/\)/g)].length
            } else if (!statement[0].startsWith('|')) {
                break
            }
        }
        return returnOption ? option : completion;
    }

    private resolveStatement(statement: string | undefined): RegExpStringIterator<RegExpExecArray> | [] {
        // return statement.matchAll(/(([^.]+)\[["']*([^\]'"]+)["']*]|[^.]+)/g)
        return statement == undefined
            ? []
            : statement.matchAll(/(([^.|]+)\[["']*([^\]'"]+)["']*]|[^.|]+|\|[^.]+)/g)
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