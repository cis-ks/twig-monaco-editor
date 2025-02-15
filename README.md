## Installation

````shell
npm require @cis-badvilbel/twig-monaco-editor
````

## Features

- Auto-completion of Twig 3.x control structures, filters and functions
- Extension of autocomplete with your own definitions (filters, functions, variables)
- When using nested variables/objects, filters (such as ``last``, ``first`` or ``filter``) are "ignored".

## Usage

### Using just the Twig-Completion-Editor-Class
The following minimal example enables the use of the Monaco editor including auto-completion for the Twig control structures, filters and functions.

```html
<div id="editor"></div>
```

```javascript
import {TwigMonacoEditor} from 'twig-monaco-editor'

document.addEventListener('DOMContentLoaded', () => {
    const editor = new TwigMonacoEditor('editor', {})
})
```

The first option is the ID of the HTML DOM element that is to be replaced by the editor.

The second option are further options that are used to instantiate the editor. [See Monaco Editor documentation](https://microsoft.github.io/monaco-editor/docs.html#interfaces/editor.IStandaloneEditorConstructionOptions.html) for more details.
Only the language is set to ``twig`` and does not need to be stored or is automatically overwritten.

### Using only the Completion-Provider

It is also possible to use only the completion provider, which also enables use in a language other than Twig:

```javascript
import {twigCompletionProvider} from 'twig-monaco-editor'
import * as monaco from 'monaco-editor'

monaco.languages.registerCompletionItemProvider('twig', new twigCompletionProvider(
    customCompletionOptions,
    customFilterOptions,
    customFunctionOptions,
    defaultCompletionKind
))
```

All options are optional.

The following descriptions of the functions also apply when using the provider directly.

### Adding Custom Completion Options

Twig offers the option of defining your own filters or functions. These can be integrated into the Twig Monaco editor alongside your own variables.

The following object structure is used internally for this purpose:

```typescript
type CompletionOption = {
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
```

It follows the structure of the [``CompletionItem`` of the Monaco editor](https://microsoft.github.io/monaco-editor/docs.html#interfaces/languages.CompletionItem.html).

The transfer to the Twig Monaco editor takes place as a CompletionOptions object, which represents a simple assignment of the label to the CompletionOption:

```javascript
{
    label: { ... },
    variable: { ... }
}
```

Internally, the properties are adopted or "calculated" via default values, if not defined.

- Label and insertText are taken from the key if not specified.
- The kind can be specified or the default value is used. The default value can be passed to the constructor as the 6th option, otherwise it is ``languages.CompletionItemKind.Property``.
- Range is filled in automatically when the suggestion list is created and does not need to be entered.
- Detail is ``string`` in case it is not defined
- SubOptions is again an object with the pairing of Key and CompletionOption.

#### Example

The following example is a minimal example of an auto-completion of individual variables or variables/objects with corresponding properties:

```javascript
const completion = {
    device: {
        subOptions: {
            id: {
                detail: 'integer'
            },
            hostname: {},
            ip_address: {},
            interfaces: {
                subOptions: {
                    name: {},
                    access_vlan: {}
                }
            }
        }
    },
    locations: {
        subOptions: {
            name: {},
            address: {},
            contact: {}
        }
    }
}
```

#### Initialization with own completion options

```javascript
const editor = new TwigMonacoEditor(
    'editor',
    {},
    <customCompletion/VariableOptions>,
    <customFilterOptions>,
    <customFunctionOptions>,
    <defaultCompletionKind>
)
```

### Custom functions/filters with snippet/tab support

The definition of your own functions or filters with parameters can also be stored as a code snippet so that tab stops can be set up and used.

All you need to do is define ``insertText`` as follows:

```javascript
{
    functionName: {
        insertText: { value: "functionName(${1}, ${2})${0}"}
    }
}
```

All tab stops are defined consecutively with ``${i}``. ``${0}`` is then the final position after you have finished.

The required ``InsertTextRule`` is automatically set to the correct value ``monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet``.

### Variables in FOR loops and in SET statements

If variables are defined in set statements or for loops, these variables are also added to the list of suggestions. Assignments to nested variables are adopted.

When reassigning variables to nested objects, all filters that do not contain a space are automatically filtered out. For the ``filter`` filter, the complete statement is filtered out and a sub-assignment is possible, e.g:

```
{% for deviceInterfaces in devices|filter((d) => d.name == 'router1').interfaces %}
```

This example only shows the basic mode of operation and ``deviceInterfaces`` refers to the definition in ``devices.subOptions.interfaces`` in its own ``customCompletionOptions`` object.

With For loops, the scope (you are inside the loop) is taken into account.

For set statements, the scope (within a ``{% with %}``) is currently **not** observed.

## Access to editor instance

Access to the editor instance is still possible via the ``editor`` property:

```javascript
const twigEditor = new TwigMonacoEditor('editor', {})

const value = twigEditor.editor.getValue()
twigEditor.editor.setValue('Replacing the content')
```

## Using with Vite: Splitting the JS files

It is recommended not to use the standard build settings for Vite, as this leads to duplications and unnecessarily large index files, which usually slow down the initial loading of the page.

With the following settings, which are only an example and must be adapted to your own project, the index files are kept as small as possible and at the same time duplicated code for the Monaco editor (which is around 3-6MB in size when unpacked) is kept to a minimum.

```javascript
export default defineConfig({
    build: {
        rollupOptions: {
            output: {
                manualChunks(id, meta) {
                    if (id.includes('twig-monaco-editor')) {
                        return 'twig-monaco-editor'
                    } else if (id.includes('monaco-editor')) {
                        return 'monaco-editor'
                    } else {
                        return 'vendor' // Or do what you think fits your code best
                    }
                }
            }
        }
    },
    resolve: {
        dedupe: ['monaco-editor'] // This ensures, that twig-monaco-editor and monaco-editor don't include the same source
    }
})

```

The above example provides the following output variables in a small example:

```
dist/index.html                                 1.49 kB │ gzip:   0.56 kB
dist/assets/codicon-DCmgc-ay.ttf               80.34 kB
dist/assets/index-CRb4mluJ.css                131.64 kB │ gzip:  20.66 kB
dist/assets/monaco-editor-BMrrEDdW.css        133.02 kB │ gzip:  21.10 kB
dist/assets/index-DQXZqKF-.js                   1.99 kB │ gzip:   1.04 kB
dist/assets/twig-monaco-editor-Df71ywh5.js      9.67 kB │ gzip:   2.88 kB
dist/assets/monaco-editor-BITGtLfy.js       3,912.93 kB │ gzip: 993.61 kB
```

With the automatic packaging of Vite, some parts of the Monaco editor are outsourced, but the Monaco editor, together with the Twig Monaco editor, is also packed as a duplicate in index.js:

```
dist/index.html                               1.10 kB │ gzip:     0.50 kB
dist/assets/codicon-DCmgc-ay.ttf             80.34 kB
dist/assets/index-seylN-Z1.css              213.40 kB │ gzip:    34.46 kB
dist/assets/azcli-BaLxmfj-.js                 1.09 kB │ gzip:     0.46 kB
dist/assets/azcli-D1avlpzM.js                 1.09 kB │ gzip:     0.46 kB
...
~ 165 files with about 0.5-8kB
...
dist/assets/jsonMode-DQXoFORo.js             41.78 kB │ gzip:    12.13 kB
dist/assets/jsonMode-DY4fHppG.js             41.78 kB │ gzip:    12.13 kB
dist/assets/index-qhdgBbuR.js             6,686.61 kB │ gzip: 1,719.00 kB
```

This reduces the loading speed, as the browser has to load the main components completely before the page is displayed. The browser can only load the other data, including the Monaco editor, asynchronously by splitting it up.