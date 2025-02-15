import {ControlCompletionOptions} from './types'

export const controlCompletion: ControlCompletionOptions = {
    apply: {},
    endapply: {},
    autoescape: {},
    endautoescape: {},
    block: {
        insertText: { value: 'block \'${1}\'${0}' }
    },
    endblock: {},
    cache: {},
    endcache: {},
    do: {},
    embed: {},
    endembed: {},
    extends: {},
    flush: {},
    for: {},
    endfor: {},
    if: {},
    elseif: {},
    endif: {},
    include: {
        insertText: { value: 'include \'${1}\'${0}' }
    },
    macro: {},
    endmacro: {},
    set: {
        insertText: { value: 'set ${1} = ${2}${0}'}
    },
    use: {
        insertText: { value: 'use "${1}" ${0}' }
    },
    verbatim: {},
    with: {},
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

export const filterCompletion: ControlCompletionOptions = {
    abs: {
        detail: 'integer|float',
    },
    batch: {
        detail: 'array',
        insertText: { value: "batch($1, '$2', ${3})${0}" },
    },
    capitalize: {
    },
    column: {
        detail: 'array',
        insertText: { value: "column('${1}')${0}" },
    },
    convert_encoding: {
        insertText: { value: "convert_encoding('$1', '${2}')${0}" },
    },
    country_name: {},
    currency_name: {},
    currency_symbol: {},
    data_uri: {},
    date: {
        insertText: { value: "date('${1}')${0}" },
    },
    date_modify: {
        insertText: { value: "date_modify('${1}')${0}" },
    },
    default: {
        insertText: { value: "default('${1}')${0}" },
    },
    escape: {},
    filter: {
        detail: 'array',
        insertText: { value: "filter(${1})${0}" },
    },
    find: {
        detail: 'array',
        insertText: { value: "find(${1})${0}" },
    },
    first: {
        detail: 'mixed',
    },
    format: {
        insertText: { value: "format(${1})${0}" },
    },
    format_currency: {},
    format_date: {},
    format_datetime: {
        insertText: { value: "format_datetime(${1})${0}" },
    },
    format_number: {},
    format_time: {},
    html_to_markdown: {
        availableWithApply: false,
    },
    inline_css: {
        availableWithApply: false,
    },
    inky_to_html: {
        availableWithApply: false,
    },
    join: {},
    json_encode: {
        insertText: 'json_encode()',
    },
    keys: {
        detail: 'array',
    },
    language_name: {},
    last: {},
    lngth: {
        label: 'length',
        detail: 'integer|float',
    },
    locale_name: {},
    lower: {},
    map: {
        detail: 'array',
        insertText: { value: 'map(${1})${0}' },
    },
    markdown_to_html: {
        availableWithApply: true,
    },
    merge: {
        detail: 'array',
        insertText: { value: 'merge(${1})${0}' },
    },
    nl2br: {
        detail: 'string',
    },
    number_format: {},
    plural: {
        insertText: { value: 'plural(${1})${0}' }
    },
    raw: {},
    reduce: {
        insertText: { value: 'reduce(${1})${0}' }
    },
    replace: {
        insertText: { value: 'replace({\'${1}\': "${2}"})${0}' }
    },
    reverse: {
        detail: 'array'
    },
    round: {
        detail: 'number'
    },
    shuffle: {
        detail: 'array'
    },
    singular: {
        insertText: { value: 'singular(${1})${0}' }
    },
    slice: {
        detail: 'array',
        insertText: { value: 'slice(${1}, ${2})${0}' }
    },
    slug: {},
    sort: {
        detail: 'array'
    },
    split: {
        detail: 'array',
        insertText: { value: 'split(\'${1}\')${0}' }
    },
    striptags: {},
    timezone_name: {},
    title: {},
    trim: {},
    u_wordwrap: {
        label: 'u.wordwrap',
        detail: 'mixed',
        insertText: { value: 'u.wordwrap(${1})${0}' },
    },
    u_truncate: {
        label: 'u.truncate',
        detail: 'mixed',
        insertText: { value: 'u.truncate(${1})${0}' },
    },
    u_snake: {
        label: 'u.snake',
    },
    u_camel: {
        label: 'u.camel.title',
    },
    upper: {},
    url_encode: {},
}

export const functionCompletion = {
    attribute: {
        insertText: { value: 'attribute(${1}, ${2})${0}' }
    },
    constant: {
        insertText: { value: 'constant(\'${1}\')${0}'}
    },
    cycle: {
        insertText: { value: 'cycle(${1}, ${2})${0}'}
    },
    date: {
        insertText: { value: 'date(${1})${0}'}
    },
    dump: {
        insertText: { value: 'dump(${1})${0}'}
    },
    enum: {
        insertText: { value: 'enum(${1})${0}'}
    },
    enumCases: {
        label: 'enum.cases',
        insertText: { value: 'enum(${1}).cases ${0}'}
    },
    enum_cases: {
        insertText: { value: 'enum_cases(\'${1}\')${0}'}
    },
    html_classes: {
        insertText: { value: 'html_classes(${1})${0}'}
    },
    html_cva: {
        insertText: { value: 'html_cva(${1})${0}'}
    },
    include: {
        insertText: { value: 'include(${1})${0}'}
    },
    max: {
        insertText: { value: 'max(${1})${0}'}
    },
    min: {
        insertText: { value: 'min(${1})${0}'}
    },
    parent: {
        insertText: { value: 'parent()${0}'}
    },
    random: {
        insertText: { value: 'random(${1})${0}'}
    },
    range: {
        insertText: { value: 'range(${1}, ${2})${0}'}
    },
    source: {
        insertText: { value: 'source(\'${1}\')${0}'}
    },
    country_timezones: {
        insertText: { value: 'country_timezones(${1})${0}'}
    },
    country_names: {
        insertText: { value: 'country_names(${1})${0}'}
    },
    currency_names: {
        insertText: { value: 'currency_names(${1})${0}'}
    },
    language_names: {
        insertText: { value: 'language_names(${1})${0}'}
    },
    locale_names: {
        insertText: { value: 'locale_names(${1})${0}'}
    },
    script_names: {
        insertText: { value: 'script_names(${1})${0}'}
    },
    timezone_names: {
        insertText: { value: 'timezone_names(${1})${0}'}
    },
    template_from_string: {
        insertText: { value: 'template_from_string(\'${1}\')${0}'}
    },
}