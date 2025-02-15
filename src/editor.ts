import {editor, languages} from "monaco-editor";

import {CompletionOptions} from "./types"
import {twigCompletionProvider} from './completion-provider'
import CompletionItemKind = languages.CompletionItemKind;

export enum CompletionOptionType{
    Filter = 1,
    Functions = 2,
    Variables = 3
}

export class TwigMonacoEditor {
    editor: editor.IStandaloneCodeEditor
    protected htmlEditorElement: HTMLElement

    constructor(
        protected readonly htmlEditorElementId: string,
        protected editorOptions: editor.IStandaloneEditorConstructionOptions,
        protected customCompletionOptions: CompletionOptions = {},
        protected customFilterOptions: CompletionOptions = {},
        protected customFunctionOptions: CompletionOptions = {},
        protected defaultCompletionKind: CompletionItemKind = languages.CompletionItemKind.Property,
    ) {
        languages.registerCompletionItemProvider('twig', new twigCompletionProvider(
            this.customCompletionOptions,
            this.customFilterOptions,
            this.customFunctionOptions,
            this.defaultCompletionKind
        ))

        this.htmlEditorElement = document.getElementById(this.htmlEditorElementId)
        this.editor = editor.create(this.htmlEditorElement, {...editorOptions, ...{language: 'twig'}})
    }

    changeFontSize(fontSize: number) {
        const rawOptions = this.editor.getRawOptions()
        const value = this.editor.getValue()
        this.editor.dispose()
        this.editor = editor.create(this.htmlEditorElement, {...rawOptions, value: value, fontSize: fontSize})
    }

    addCompletionOptions(
        options: CompletionOptions,
        optionType: CompletionOptionType,
        defaultKind: CompletionItemKind = languages.CompletionItemKind.Property,
        reinitEditor: boolean = true
    ) {
        switch (optionType) {
            case CompletionOptionType.Filter:
                this.customFilterOptions = options
                break
            case CompletionOptionType.Functions:
                this.customFunctionOptions = options
                break
            case CompletionOptionType.Variables:
                this.customCompletionOptions = options
                this.defaultCompletionKind = defaultKind
                break;
        }

        if (reinitEditor) {
            this.reinitEditor()
        }
    }

    reinitEditor() {
        languages.registerCompletionItemProvider('twig', new twigCompletionProvider(
            this.customCompletionOptions,
            this.customFilterOptions,
            this.customFunctionOptions,
            this.defaultCompletionKind)
        )

        const rawOptions = this.editor.getRawOptions()
        const value = this.editor.getValue()
        try {
            this.editor.dispose()
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_) {
            // @ts-nocheck
        }
        this.editor = editor.create(this.htmlEditorElement, {...rawOptions, value: value})
    }
}
