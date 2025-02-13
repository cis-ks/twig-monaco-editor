import {languages, Range} from "monaco-editor";
import CompletionItemKind = languages.CompletionItemKind;
import CompletionItem = languages.CompletionItem;


export interface CompletionOptions {
    [key: string]: CompletionOption
}

export interface ControlCompletionOptions {
    [key: string]: ControlCompletionOption
}

export type CompletionOption = {
    label: string,
    insertText?: string,
    kind?: CompletionItemKind,
    detail?: string,
    hint?: string,
    documentation?: string,
    subOptions?: CompletionOptions|CompletionItem[],
    is_list?: boolean,
    range?: Range
}

export type ControlCompletionOption = {
    label?: string,
    insertText?: string,
    kind?: CompletionItemKind,
    detail?: string,
    hint?: string,
    documentation?: string,
}
