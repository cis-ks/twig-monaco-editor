import {languages, Range} from "monaco-editor";
import {CompletionOption, CompletionOptions } from "./types";
import CompletionItem = languages.CompletionItem;
import CompletionItemKind = languages.CompletionItemKind;

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
        return Object.values(
            this.mapCompletionObjects(this.completionOptions, this.range, this.defaultKind, this.defaultDetail)
        )
    }

    private objectDetail(completionObject: CompletionOption, defaultDetail: string = 'string'): string
    {
        let detail = completionObject.detail ?? defaultDetail;
        if (completionObject.hasOwnProperty('hint')) {
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
            label: completionName,
            insertText: completionObject.insertText ?? completionName,
            kind: completionObject.kind ?? defaultKind ?? languages.CompletionItemKind.Property,
            detail: this.objectDetail(completionObject, defaultDetail),
            documentation: completionObject.documentation ?? '',
            range: range,
            subOptions: completionObject.hasOwnProperty('options')
                ? this.mapCompletionObjects(completionObject.subOptions, range, defaultKind, defaultDetail)
                : {}
        }
    }

    private mapCompletionObjects(
        completionObjects: CompletionOptions|CompletionItem[],
        range: Range,
        defaultKind: CompletionItemKind,
        defaultDetail: string = 'string'
    ): CompletionItem[] {
        let returnList = []

        Object.keys(completionObjects).forEach((name) => {
            returnList[name] = this.completionObject(name, completionObjects[name], range, defaultKind, defaultDetail)
        })

        return returnList
    }
}