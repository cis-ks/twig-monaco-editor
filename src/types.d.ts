import {languages, Range} from "monaco-editor";
import CompletionItemKind = languages.CompletionItemKind;
import CompletionItem = languages.CompletionItem;
import CompletionItemInsertTextRule = languages.CompletionItemInsertTextRule;


export interface CompletionOptions {
    [key: string]: CompletionOption
}

export interface ControlCompletionOptions {
    [key: string]: ControlCompletionOption
}

export type insertTextSnippet = {
    value: string
}

export type CompletionOption = {
    label?: string,
    insertText?: string|insertTextSnippet,
    insertTextRules?: CompletionItemInsertTextRule
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
    insertText?: string|insertTextSnippet,
    insertTextRules?: CompletionItemInsertTextRule
    kind?: CompletionItemKind,
    detail?: string,
    hint?: string,
    documentation?: string,
    availableWithApply?: boolean,
}