import {languages, Range} from "monaco-editor";
import {CompletionOption, CompletionOptions, insertTextSnippet} from "./types";
import CompletionItem = languages.CompletionItem;
import CompletionItemKind = languages.CompletionItemKind;
import CompletionItemInsertTextRule = languages.CompletionItemInsertTextRule;

export class completionGenerator {
    constructor(
        protected readonly completionOptions: CompletionOptions,
        protected readonly range: Range,
        protected readonly defaultKind: CompletionItemKind,
        protected readonly defaultDetail: string = 'string'
    ) {
    }

    resolve(): CompletionItem[]
    {
        return this.mapCompletionObjects(this.completionOptions, this.range, this.defaultKind, this.defaultDetail)
    }

    private objectDetail(completionObject: CompletionOption, defaultDetail: string = 'string'): string
    {
        let detail = completionObject.detail ?? defaultDetail;
        if (Object.prototype.hasOwnProperty.call(completionObject, 'hint')) {
            detail += ' (' + completionObject.hint + ')'
        }
        return detail.trimStart()
    }

    private completionObject(
        completionName: string,
        completionObject: CompletionOption,
        range: Range,
        defaultKind: CompletionItemKind|null = null,
        defaultDetail: string = 'string'
    ): CompletionOption {
        return {
            label: completionObject.label ?? completionName,
            insertText: this.retrieveInsertText(completionObject.insertText) ?? completionObject.label ?? completionName,
            kind: completionObject.kind ?? defaultKind ?? languages.CompletionItemKind.Property,
            detail: this.objectDetail(completionObject, defaultDetail),
            documentation: completionObject.documentation ?? '',
            range: range,
            subOptions: Object.prototype.hasOwnProperty.call(completionObject, 'options')
                ? this.mapCompletionObjects(completionObject.subOptions, range, defaultKind, defaultDetail)
                : {},
            insertTextRules: typeof (completionObject.insertText ?? completionName) != 'string'
                ? CompletionItemInsertTextRule.InsertAsSnippet
                : undefined
        }
    }

    private retrieveInsertText(insertText: string|insertTextSnippet): string|undefined
    {
        if (typeof  insertText == "string") {
            return insertText
        } else if (typeof insertText == "object" && Object.prototype.hasOwnProperty.call(insertText, 'value')) {
            return insertText.value
        } else {
            return undefined
        }
    }

    private mapCompletionObjects(
        completionObjects: CompletionOptions|CompletionItem[],
        range: Range,
        defaultKind: CompletionItemKind,
        defaultDetail: string = 'string'
    ): CompletionItem[] {
        const returnList = []

        Object.keys(completionObjects).forEach((name) => {
            returnList.push(this.completionObject(name, completionObjects[name], range, defaultKind, defaultDetail))
        })

        return returnList
    }
}