import {languages, editor} from "monaco-editor";
import CompletionItemKind = languages.CompletionItemKind;

import {CompletionOptions} from './types'
import {twigCompletionProvider} from './completion-provider'


export class TwigMonacoEditor {
    editor: editor.IStandaloneCodeEditor
    protected htmlEditorElement: HTMLElement

    constructor(
        protected readonly htmlEditorElementId: string,
        protected editorOptions: editor.IStandaloneEditorConstructionOptions,
        protected completionOptions: CompletionOptions = {},
        protected customFilterOptions: CompletionOptions = {},
        protected customFunctionOptions: CompletionOptions = {},
        protected defaultCompletionKind: CompletionItemKind = languages.CompletionItemKind.Property
    ) {
        languages.registerCompletionItemProvider('twig', new twigCompletionProvider)

        this.htmlEditorElement = document.getElementById(this.htmlEditorElementId)
        this.editor = editor.create(this.htmlEditorElement, {...editorOptions, ...{language: 'twig'}})
    }

    public changeFontSize(fontSize: number) {
        let rawOptions = this.editor.getRawOptions()
        const value = this.editor.getValue()
        this.editor.dispose()
        this.editor = editor.create(this.htmlEditorElement, {...rawOptions, value: value, fontSize: fontSize})
    }
}