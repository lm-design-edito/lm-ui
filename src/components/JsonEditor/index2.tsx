import { Component } from 'preact'

export type PrimitiveValue = string | number | boolean | null
export type Value = PrimitiveValue | Value[] | { [key: string]: Value }

export type ValidationSuccessResult<T extends any> = { success: true, validated: T }
export type ValidationFailureResult<T extends any> = { success: false, validated: T, reason?: string }
export type ValidationResult<T extends any> = ValidationSuccessResult<T> | ValidationFailureResult<T>

export function makeValidationResult<T extends any> (success: true, validated: T): ValidationSuccessResult<T>
export function makeValidationResult<T extends any> (success: false, validated: T, reason?: string): ValidationFailureResult<T>
export function makeValidationResult<T extends any> (success: boolean, validated: T, reason?: string): ValidationResult<T> {
  return {
    success,
    validated,
    reason
  }
}

export type ValidationOptions<T extends any> = Array<T>
export type ValidationFunction<T extends any> = (input: T) => ValidationResult<T>
export type ValidationRule<T extends any> = ValidationOptions<T> | ValidationFunction<T>

export function validateOne<T> (input: T, rule?: ValidationRule<T>): ValidationResult<T> {
  if (Array.isArray(rule)) {
    const firstRuleElement = rule.at(0)
    if (firstRuleElement === undefined) return makeValidationResult(true, input)
    const isValid = rule.includes(input)
    if (isValid) return makeValidationResult(true, input)
    return makeValidationResult(false, firstRuleElement, `${input} is not in the options list`)
  }
  if (rule === undefined) return makeValidationResult(true, input)
  return rule(input)
}

export function validate<T extends any> (input: T, ...rules: ValidationRule<T>[]): ReturnType<ValidationFunction<T>> {
  if (rules.length === 0) return validateOne(input)
  return rules.reduce((latestValidationResult, rule) => {
    if (!latestValidationResult.success) return latestValidationResult
    return validateOne(latestValidationResult.validated, rule)
  }, validateOne(input))
}

export type Scheme = {
  initValue: Value
  string?: true | { rule?: ValidationRule<string> }
  number?: true | { rule?: ValidationRule<number> }
  boolean?: true | { rule?: ValidationRule<boolean> }
  null?: true
  array?: true | {
    preventPropertyCreation?: boolean
    preventPropertyDeletion?: boolean
    preventPropertiesShift?: boolean
    minLength?: number
    maxLength?: number
    values?: Array<{
      optional?: boolean
      scheme?: Scheme
    }>
    rule?: ValidationFunction<Value[]>
  }
  object?: true | {
    preventPropertyCreation?: boolean
    preventPropertyDeletion?: boolean
    properties?: {
      [key: string]: {
        optional?: boolean
        scheme?: Scheme
      }
    }
    rule?: ValidationFunction<{ [key: string]: Value }>
  }
}

export const isString = (val: unknown): val is string => typeof val === 'string'
export const isNumber = (val: unknown): val is number => typeof val === 'number'
export const isBoolean = (val: unknown): val is boolean => typeof val === 'boolean'
export const isNull = (val: unknown): val is null => val === null
export const isArray = (val: unknown): val is Array<unknown> => Array.isArray(val)
export const isObject = (val: unknown): val is ({ [key: string]: unknown }) => {
  if (typeof val !== 'object') return false
  if (val === null) return false
  if (isArray(val)) return false
  return true
}

export type Path = Array<string | number>
export type SchemeTestResult = { path: Path, result: ValidationResult<Value> }
export type SchemeTestResults = Array<SchemeTestResult>

export function schemeTest (
  input: Value,
  scheme: Scheme,
  path: Path = [],
  testInitValue: boolean = true
): SchemeTestResults {

  if (testInitValue) {
    const initValueTest = schemeTest(scheme.initValue, scheme, path, false)
    const someResultsAreBad = initValueTest.some(result => result.result.success === false)
    if (someResultsAreBad) return [{ path, result: makeValidationResult(false, null, 'provided initValue in scheme doesn\'t comply to scheme') }]
  }

  if (isString(input)) {
    if (scheme.string === undefined) return [{ path, result: makeValidationResult(false, scheme.initValue, 'string type is not allowed') }]
    if (scheme.string === true) return [{ path, result: makeValidationResult(true, input) }]
    if (scheme.string.rule === undefined) return [{ path, result: makeValidationResult(true, input) }]
    const validationResult = validate(input, scheme.string.rule)
    return [{ path, result: validationResult }]
  }

  if (isNumber(input)) {
    if (scheme.number === undefined) return [{ path, result: makeValidationResult(false, scheme.initValue, 'number type is not allowed') }]
    if (scheme.number === true) return [{ path, result: makeValidationResult(true, input) }]
    if (scheme.number.rule === undefined) return [{ path, result: makeValidationResult(true, input) }]
    const validationResult = validate(input, scheme.number.rule)
    return [{ path, result: validationResult }]
  }

  if (isBoolean(input)) {
    if (scheme.boolean === undefined) return [{ path, result: makeValidationResult(false, scheme.initValue, 'boolean type is not allowed') }]
    if (scheme.boolean === true) return [{ path, result: makeValidationResult(true, input) }]
    if (scheme.boolean.rule === undefined) return [{ path, result: makeValidationResult(true, input) }]
    const validationResult = validate(input, scheme.boolean.rule)
    return [{ path, result: validationResult }]
  }

  if (isNull(input)) {
    if (scheme.null === undefined) return [{ path, result: makeValidationResult(false, scheme.initValue, 'null type is not allowed') }]
    return [{ path, result: makeValidationResult(true, input) }]
  }

  if (isArray(input)) {
    if (scheme.array === undefined) return [{ path, result: makeValidationResult(false, scheme.initValue, 'array type is not allowed') }]
    if (scheme.array === true) return [{ path, result: makeValidationResult(true, input) }]
    const {
      minLength = 0,
      maxLength = Infinity,
      values: subSchemes = [],
      rule = (input: Value[]) => makeValidationResult(true, input)
    } = scheme.array
    if (input.length < minLength) return [{ path, result: makeValidationResult(false, scheme.initValue, 'array length should be at least of ${minLength}') }]
    if (input.length > maxLength) return [{ path, result: makeValidationResult(false, scheme.initValue, 'array length should be at most of ${maxLength}') }]
    const validationResult = validate(input, rule)
    if (!validationResult.success) return [{ path, result: validationResult }]
    const subResults = subSchemes.map(({ optional = false, scheme: subScheme }, pos) => {
      const subPath = [...path, pos]
      const subInput = input[pos]
      if (subInput === undefined) {
        if (optional !== false) return []
        return [{ path: subPath, result: makeValidationResult(false, subScheme?.initValue ?? null, 'value expected') }]
      }
      if (subScheme === undefined) return [{ path: subPath, result: makeValidationResult(true, subInput) }]
      return schemeTest(subInput, subScheme, subPath)
    })
    return subResults.flat()
  }
  
  if (isObject(input)) {
    if (scheme.object === undefined) return [{ path, result: makeValidationResult(false, scheme.initValue, 'object type is not allowed') }]
    if (scheme.object === true) return [{ path, result: makeValidationResult(true, input) }]
    const {
      properties: subSchemes = {},
      rule = (input: { [key: string]: Value }) => makeValidationResult(true, input)
    } = scheme.object
    const validationResult = validate(input, rule)
    if (!validationResult.success) return [{ path, result: validationResult }]
    const subResults = Object.entries(subSchemes).map(([key, { optional = false, scheme: subScheme }]) => {
      const subPath = [...path, key]
      const subInput = input[key]
      if (subInput === undefined) {
        if (optional !== false) return []
        return [{ path: subPath, result: makeValidationResult(false, subScheme?.initValue ?? null, 'value expected') }]
      }
      if (subScheme === undefined) return [{ path: subPath, result: makeValidationResult(true, subInput) }]
      return schemeTest(subInput, subScheme, subPath)
    })
    return subResults.flat()
  }
  
  return [{ path, result: makeValidationResult(false, scheme.initValue, 'input is not a valid JSON type') }]
}

function cloneValue (input: Value, deep: boolean = false): Value {
  if (isArray(input)) return [...input].map(subInput => deep
    ? cloneValue(subInput, deep)
    : subInput)
  if (isObject(input)) return Object
    .entries(input)
    .reduce((reduced, [key, subInput]) => ({
      ...reduced,
      [key]: deep ? cloneValue(subInput, deep) : subInput
    }), {} as { [key: string]: Value })
  return input
}

function setValueAtPath (input: Value, value: Value, path: Path) {
  let returned = cloneValue(input, true)
  let parentValue: Value[] | { [key: string]: Value } | undefined = undefined
  let currentValue: Value | undefined = returned
  let currentValuePathFromParent: Path[number] | undefined = undefined
  
  path.forEach((chunk, chunkPos) => {
    const isLastChunk = chunkPos === path.length - 1

    if (isString(chunk)) {
      if (isObject(currentValue)) {
        parentValue = currentValue
        currentValue = currentValue[chunk]
        currentValuePathFromParent = chunk
        if (isLastChunk) parentValue[chunk] = value
      } else {
        
      }
    }
    else {
      if (isArray(currentValue)) {
        parentValue = currentValue
        currentValue = currentValue[chunk]
        currentValuePathFromParent = chunk
        if (isLastChunk) parentValue[chunk] = value
      } else {
        parentValue[chunk] = []
      }
    }
  })
}

function applySchemeTestResults (input: Value, results: SchemeTestResults) {

}

/* * * * * * * * * * * * * * * * * * * * *
 *
 * COMPONENTS
 * 
 * * * * * * * * * * * * * * * * * * * * */

export type ValueEditorProps = {
  initValue: Value
  scheme: Scheme
  onChange?: (value: Value) => void
}
export type ValueEditorState = {}
export class ValueEditor extends Component<ValueEditorProps, ValueEditorState> {
  constructor (props: ValueEditorProps) {
    super(props)
    const initValueTest = schemeTest(props.initValue, props.scheme)
  }

  render () {
    return <></>
  }
}
