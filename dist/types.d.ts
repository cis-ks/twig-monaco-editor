import {languages} from "monaco-editor";
import CompletionItemKind = languages.CompletionItemKind;


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
    subOptions?: CompletionOptions,
    is_list?: boolean
}

export type ControlCompletionOption = {
    label?: string,
    insertText?: string,
    kind?: CompletionItemKind,
    detail?: string,
    hint?: string,
    documentation?: string,
}
