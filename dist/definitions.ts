import {ControlCompletionOptions} from './types'

export const controlCompletion: ControlCompletionOptions = {
    apply: {},
    endapply: {},
    autoescape: {},
    endautoescape: {},
    do: {},
    extends: {},
    for: {},
    endfor: {},
    if: {},
    elseif: {},
    endif: {},
    set: {},
}

export const isComparisationCompletion: ControlCompletionOptions = {
    constant: {},
    defined: {},
    divisible_by: {
        label: 'divisible by',
        insertText: 'divisible by'
    },
    empty: {},
    even: {},
    iterable: {},
    mapping: {},
    not: {},
    null: {},
    odd: {},
    same_as: {
        label: 'same as',
        insertText: 'same as'
    },
    sequence: {},
}