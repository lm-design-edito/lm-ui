import { Component } from 'preact'

/* * * * * * * * * * * * * * * * * * * * * * *
 *
 * JSON Types & Utilities
 *
 * * * * * * * * * * * * * * * * * * * * * * */

export type PrimitiveValue = string | number | boolean | null
export type ObjectValue = { [key: string]: Value }
export type ArrayValue = Value[]
export type Value = PrimitiveValue | ArrayValue | ObjectValue
export type Path = Array<string | number>

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

export function getValueType (val: any) {
  if (isString(val)) return 'string'
  if (isNumber(val)) return 'number'
  if (isBoolean(val)) return 'boolean'
  if (isNull(val)) return 'null'
  if (isArray(val)) return 'array'
  return 'object'
}

export function cloneValue (input: Value, deep: boolean = false): Value {
  if (isArray(input)) return [...input].map(subInput => deep
    ? cloneValue(subInput, deep)
    : subInput)
  if (isObject(input)) return Object
    .entries(input)
    .reduce((reduced, [key, subInput]) => ({
      ...reduced,
      [key]: deep ? cloneValue(subInput, deep) : subInput
    }), {} as ObjectValue)
  return input
}

export class Json {
  private _value: PrimitiveValue | { [key: string]: Json } | Json[]
  
  constructor (jsonValue: Value) {
    if (isObject(jsonValue)) {
      this._value = Object
        .entries(jsonValue)
        .reduce((reduced, [key, val]) => ({
          ...reduced,
          [key]: new Json(val)
        }), {})
    } else if (isArray(jsonValue)) {
      this._value = jsonValue.map(val => new Json(val))
    } else {
      this._value = cloneValue(jsonValue, true) as PrimitiveValue
    }
  }

  get json (): Value {
    const { _value } = this
    if (isObject(_value)) return Object
      .entries(_value)
      .reduce((reduced, [key, val]) => ({
        ...reduced,
        [key]: val.json
      }), {})
    if (isArray(_value)) return _value.map(val => val.json)
    return _value
  }

  getProperty (prop: Path[number]): Json | undefined {
    if (isObject(this._value) && typeof prop === 'string') return this._value[prop]
    if (isArray(this._value) && typeof prop === 'number') return this._value[prop]
    return undefined
  }

  setProperty (prop: Path[number], value: Value, fillValue?: Value): this {
    if (typeof prop === 'number') {
      if (!isArray(this._value)) { this._value = [] }
      const { _value } = this
      new Array(prop + 1).fill(null).forEach((_, pos) => {
        if (pos === prop) { _value[pos] = new Json(value) }
        else if (_value[pos] === undefined) { _value[pos] = new Json(cloneValue(fillValue ?? null, true)) }
      })
    } else {
      if (!isObject(this._value)) { this._value = {} }
      this._value[prop] = new Json(value)
    }
    return this
  }

  setValueAtPath (path: Path, value: Value, fillValue?: Value): this {
    let currentJsonObj: Json = this
    path.forEach((prop, posInPath) => {
      if (posInPath === path.length - 1) currentJsonObj.setProperty(prop, value, fillValue)
      else {
        const currentProperty = currentJsonObj.getProperty(prop)
        if (currentProperty === undefined) currentJsonObj.setProperty(prop, {})
        currentJsonObj = currentJsonObj.getProperty(prop) as Json
      }
    })
    return this
  }

  sortProperties (deep?: boolean): this {
    const { _value } = this
    if (isArray(_value)) {
      if (!deep) return this
      this._value = _value.map(val => val.sortProperties(deep))
      return this
    }
    if (!isObject(_value)) return this
    const newVal = Object
      .entries(_value)
      .sort(([aKey], [bKey]) => aKey.localeCompare(bKey))
      .reduce((reduced, [key, val]) => ({ ...reduced, [key]: val }), {} as typeof _value)
    this._value = newVal
    return this
  }
}

/* * * * * * * * * * * * * * * * * * * * * * *
 *
 * Single rule validation
 *
 * * * * * * * * * * * * * * * * * * * * * * */

export type ValidationSuccessResult<T extends Value> = { success: true, validated: T, input: T | undefined, }
export type ValidationFailureResult<T extends Value> = { success: false, validated: T, input: T | undefined, reason: string }
export type ValidationResult<T extends Value> = ValidationSuccessResult<T> | ValidationFailureResult<T>

export function makeValidationResult<T extends Value> (success: true, validated: T, input: T | undefined): ValidationSuccessResult<T>
export function makeValidationResult<T extends Value> (success: false, validated: T, input: T | undefined, reason: string): ValidationFailureResult<T>
export function makeValidationResult<T extends Value> (success: boolean, validated: T, input: T | undefined, reason?: string): ValidationResult<T> {
  if (success) return {
    success,
    validated,
    input
  }
  return {
    success,
    validated,
    input,
    reason: reason ?? ''
  }
}

export type ValidationOptions<T extends Value> = Array<T>
export type ValidationFunction<T extends Value> = (input: T) => ValidationResult<T>
export type ValidationRule<T extends Value> = ValidationOptions<T> | ValidationFunction<T>

export function validateOne<T extends Value> (input: T, rule?: ValidationRule<T>, fallback?: T): ValidationResult<T> {
  if (Array.isArray(rule)) {
    const firstRuleElement = rule.at(0)
    if (firstRuleElement === undefined) return makeValidationResult(true, input, input)
    const isValid = rule.includes(input)
    if (isValid) return makeValidationResult(true, input, input)
    return makeValidationResult(false, fallback ?? firstRuleElement, input, `${input} is not in the options list`)
  }
  if (rule === undefined) return makeValidationResult(true, input, input)
  return rule(input)
}

export function validate<T extends Value> (
  input: T,
  ...rulesWithFallback: Array<{
    rule: ValidationRule<T>,
    fallback?: T
  }>): ReturnType<ValidationFunction<T>> {
  if (rulesWithFallback.length === 0) return validateOne(input)
  return rulesWithFallback.reduce((latestValidationResult, { rule, fallback }) => {
    if (!latestValidationResult.success) return latestValidationResult
    return validateOne(latestValidationResult.validated, rule, fallback)
  }, validateOne(input))
}

/* * * * * * * * * * * * * * * * * * * * * * *
 *
 * Scheme
 *
 * * * * * * * * * * * * * * * * * * * * * * */

export namespace Scheme {
  export type Scheme = {
    fallback: Value
    string?: true | { rule?: ValidationRule<string>, fallback?: string }
    number?: true | { rule?: ValidationRule<number>, fallback?: number }
    boolean?: true | { rule?: ValidationRule<boolean>, fallback?: boolean }
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
      rule?: ValidationFunction<ArrayValue>
      fallback?: ArrayValue
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
      rule?: ValidationFunction<ObjectValue>
      fallback?: ObjectValue
    }
  }
  
  export type SchemeTestResult = { path: Path, result: ValidationResult<Value> }
  export type SchemeTestResults = Array<SchemeTestResult>
  
  export function test (
    input: Value,
    scheme: Scheme,
    path: Path = [],
    testFallback: boolean = true
  ): SchemeTestResults {
  
    if (testFallback) {
      const fallbackTest = test(scheme.fallback, scheme, path, false)
      const someResultsAreBad = fallbackTest.some(result => result.result.success === false)
      if (someResultsAreBad) throw new Error(`provided fallback (${scheme.fallback}) in scheme doesn\'t comply to scheme at path /${path.join('/')}`)
    }
  
    if (isString(input)) {
      if (scheme.string === undefined) return [{ path, result: makeValidationResult(false, scheme.fallback, input, 'string type is not allowed') }]
      if (scheme.string === true) return [{ path, result: makeValidationResult(true, input, input) }]
      if (scheme.string.rule === undefined) return [{ path, result: makeValidationResult(true, input, input) }]
      if (testFallback && scheme.string.fallback !== undefined) {
        const fallbackTest = test(scheme.string.fallback, scheme, path, false)
        const someResultsAreBad = fallbackTest.some(result => result.result.success === false)
        if (someResultsAreBad) throw new Error(`provided string fallback (${scheme.string.fallback}) in scheme doesn\'t comply to scheme at path /${path.join('/')}`)
      }
      const ruleWithFallback = scheme.string.rule !== undefined
        ? {
          rule: scheme.string.rule as ValidationRule<Value>,
          fallback: (scheme.string.fallback ?? scheme.fallback) as Value
        }
        : undefined
      const validationResult = ruleWithFallback !== undefined ? validate(input as Value, ruleWithFallback) : validate(input)
      return [{ path, result: validationResult }]
    }
  
    if (isNumber(input)) {
      if (scheme.number === undefined) return [{ path, result: makeValidationResult(false, scheme.fallback, input, 'number type is not allowed') }]
      if (scheme.number === true) return [{ path, result: makeValidationResult(true, input, input) }]
      if (scheme.number.rule === undefined) return [{ path, result: makeValidationResult(true, input, input) }]
      if (testFallback && scheme.number.fallback !== undefined) {
        const fallbackTest = test(scheme.number.fallback, scheme, path, false)
        const someResultsAreBad = fallbackTest.some(result => result.result.success === false)
        if (someResultsAreBad) throw new Error(`provided number fallback (${scheme.number.fallback}) in scheme doesn\'t comply to scheme at path /${path.join('/')}`)
      }
      const ruleWithFallback = scheme.number.rule !== undefined
        ? {
          rule: scheme.number.rule as ValidationRule<Value>,
          fallback: scheme.number.fallback ?? scheme.fallback as Value
        }
        : undefined
      const validationResult = ruleWithFallback !== undefined ? validate(input as Value, ruleWithFallback) : validate(input)
      return [{ path, result: validationResult }]
    }
  
    if (isBoolean(input)) {
      if (scheme.boolean === undefined) return [{ path, result: makeValidationResult(false, scheme.fallback, input, 'boolean type is not allowed') }]
      if (scheme.boolean === true) return [{ path, result: makeValidationResult(true, input, input) }]
      if (scheme.boolean.rule === undefined) return [{ path, result: makeValidationResult(true, input, input) }]
      if (testFallback && scheme.boolean.fallback !== undefined) {
        const fallbackTest = test(scheme.boolean.fallback, scheme, path, false)
        const someResultsAreBad = fallbackTest.some(result => result.result.success === false)
        if (someResultsAreBad) throw new Error(`provided boolean fallback (${scheme.boolean.fallback}) in scheme doesn\'t comply to scheme at path /${path.join('/')}`)
      }
      const ruleWithFallback = scheme.boolean.rule !== undefined
        ? {
          rule: scheme.boolean.rule as ValidationRule<Value>,
          fallback: scheme.boolean.fallback ?? scheme.fallback as Value
        }
        : undefined
      const validationResult = ruleWithFallback !== undefined ? validate(input as Value, ruleWithFallback) : validate(input)
      return [{ path, result: validationResult }]
    }
  
    if (isNull(input)) {
      if (scheme.null === undefined) return [{ path, result: makeValidationResult(false, scheme.fallback, input, 'null type is not allowed') }]
      return [{ path, result: makeValidationResult(true, input, input) }]
    }
  
    if (isArray(input)) {
      if (scheme.array === undefined) return [{ path, result: makeValidationResult(false, scheme.fallback, input, 'array type is not allowed') }]
      if (scheme.array === true) return [{ path, result: makeValidationResult(true, input, input) }]
      const {
        minLength = 0,
        maxLength = Infinity,
        values: subSchemes = [],
        rule = (input: ArrayValue) => makeValidationResult(true, input, input),
        fallback
      } = scheme.array
      if (testFallback && scheme.array.fallback !== undefined) {
        const fallbackTest = test(scheme.array.fallback, scheme, path, false)
        const someResultsAreBad = fallbackTest.some(result => result.result.success === false)
        if (someResultsAreBad) throw new Error(`provided array fallback in scheme doesn\'t comply to scheme at path /${path.join('/')}`)
      }
      if (input.length < minLength) return [{ path, result: makeValidationResult(false, fallback ?? scheme.fallback, input, 'array length should be at least of ${minLength}') }]
      if (input.length > maxLength) return [{ path, result: makeValidationResult(false, fallback ?? scheme.fallback, input, 'array length should be at most of ${maxLength}') }]
      const ruleWithFallback = scheme.array.rule !== undefined
        ? {
          rule: scheme.array.rule as ValidationRule<Value>,
          fallback: fallback ?? scheme.fallback as Value
        }
        : undefined
      const validationResult = ruleWithFallback !== undefined ? validate(input as Value, ruleWithFallback) : validate(input)
      if (!validationResult.success) return [{ path, result: validationResult }]
      const subResults = subSchemes.map(({ optional = false, scheme: subScheme }, pos) => {
        const subPath = [...path, pos]
        const subInput = input[pos]
        if (subInput === undefined) {
          if (optional !== false) return []
          return [{ path: subPath, result: makeValidationResult(false, subScheme?.fallback ?? null, input, 'value expected') }]
        }
        if (subScheme === undefined) return [{ path: subPath, result: makeValidationResult(true, subInput, subInput) }]
        return test(subInput, subScheme, subPath)
      })
      return subResults.flat()
    }
    
    if (isObject(input)) {
      if (scheme.object === undefined) return [{ path, result: makeValidationResult(false, scheme.fallback, input, 'object type is not allowed') }]
      if (scheme.object === true) return [{ path, result: makeValidationResult(true, input, input) }]
      const {
        properties: subSchemes = {},
        rule = (input: ObjectValue) => makeValidationResult(true, input, input),
        fallback
      } = scheme.object
      if (testFallback && scheme.object.fallback !== undefined) {
        const fallbackTest = test(scheme.object.fallback, scheme, path, false)
        const someResultsAreBad = fallbackTest.some(result => result.result.success === false)
        if (someResultsAreBad) throw new Error(`provided object fallback in scheme doesn\'t comply to scheme at path /${path.join('/')}`)
      }
      const ruleWithFallback = scheme.object.rule !== undefined
        ? {
          rule: scheme.object.rule as ValidationRule<Value>,
          fallback: fallback ?? scheme.fallback as Value
        }
        : undefined
      const validationResult = ruleWithFallback !== undefined ? validate(input as Value, ruleWithFallback) : validate(input)
      if (!validationResult.success) return [{ path, result: validationResult }]
      const subResults = Object.entries(subSchemes).map(([key, { optional = false, scheme: subScheme }]) => {
        const subPath = [...path, key]
        const subInput = input[key]
        if (subInput === undefined) {
          if (optional !== false) return []
          return [{ path: subPath, result: makeValidationResult(false, subScheme?.fallback ?? null, undefined, 'value expected') }]
        }
        if (subScheme === undefined) return [{ path: subPath, result: makeValidationResult(true, subInput, subInput) }]
        return test(subInput, subScheme, subPath)
      })
      return subResults.flat()
    }
    
    return [{ path, result: makeValidationResult(false, scheme.fallback, input, 'input is not a valid JSON type') }]
  }

  export function applyTestResults (input: Value, results: SchemeTestResults) {
    const sortedFailedResults = results
      .filter(result => result.result.success === false)
      .map(({ path, result }) => ({ path, strPath: path.join('/'), result }))
      .sort((a, b) => a.strPath.localeCompare(b.strPath) )
      .map(({ path, result }) => ({ path, result }))
      .sort((a, b) => (b.path.length - a.path.length))
    const inputAsJsonObjInstance = new Json(input)
    sortedFailedResults.forEach(({ path, result }) => {
      inputAsJsonObjInstance.setValueAtPath(path, result.validated)
    })
    return inputAsJsonObjInstance.json
  }

  export function apply (input: Value, scheme?: Scheme): Value {
    if (scheme === undefined) return input
    const results = test(input, scheme)
    const fixed = applyTestResults(input, results)
    return fixed
  }

  export function getAllowedTypes (scheme?: Scheme): ReturnType<typeof getValueType>[] {
    if (scheme === undefined) return ['string', 'number', 'boolean', 'null', 'array', 'object']
    const returned: ReturnType<typeof getValueType>[] = []
    if (scheme.string !== undefined) returned.push('string')
    if (scheme.number !== undefined) returned.push('number')
    if (scheme.boolean !== undefined) returned.push('boolean')
    if (scheme.null !== undefined) returned.push('null')
    if (scheme.array !== undefined) returned.push('array')
    if (scheme.object !== undefined) returned.push('object')
    return returned
  }
}

/* * * * * * * * * * * * * * * * * * * * *
 *
 * COMPONENTS
 * 
 * * * * * * * * * * * * * * * * * * * * */

// Value Editor

export type ValueEditorProps = {
  value: Value
  scheme?: Scheme.Scheme
  onChange?: (value: Value) => void
}

export type ValueEditorState = {
  value: Value
  forcedRendersCount: number
}

export class ValueEditor extends Component<ValueEditorProps, ValueEditorState> {
  constructor (props: ValueEditorProps) {
    super(props)
    this.state = {
      value: Scheme.apply(props.value, props.scheme),
      forcedRendersCount: 0
    }
  }

  static getDerivedStateFromProps(
    newProps: ValueEditorProps,
    currState: ValueEditorState
  ): Partial<ValueEditorState> | null {
    const newPropsValueAsJsonObjInstance = new Json(newProps.value)
    const currStateValueAsJsonObjInstance = new Json(currState.value)
    const newValStr = JSON.stringify(newPropsValueAsJsonObjInstance.sortProperties().json)
    const currValStr = JSON.stringify(currStateValueAsJsonObjInstance.sortProperties().json)
    if (newValStr === currValStr) return null
    return {
      ...currState,
      value: Scheme.apply(newProps.value, newProps.scheme),
      forcedRendersCount: currState.forcedRendersCount + 1
    }
  }

  render () {
    const { props, state } = this
    const type = getValueType(state.value)
    const allowedTypes = Scheme.getAllowedTypes(props.scheme)
    const schemeStringField = props.scheme?.string
    const stringRule = isObject(schemeStringField) ? schemeStringField.rule : undefined
    const stringFallback = isObject(schemeStringField) ? schemeStringField.fallback : undefined
    return <>
      <TypeEditor
        type={type}
        allowedTypes={allowedTypes}
        onChange={(val: Value) => { console.log('val has changed!', val) }} />
      {type === 'string' && <StringValueEditor
        value={state.value as string}
        rule={stringRule}
        fallback={stringFallback} />}
    </>
  }
}

// Type Editor

export type TypeEditorProps = {
  type: ReturnType<typeof getValueType>
  allowedTypes: ReturnType<typeof getValueType>[]
  onChange?: (type: ReturnType<typeof getValueType>) => void
}

export class TypeEditor extends Component<TypeEditorProps> {
  constructor (props: TypeEditorProps) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (e: Event) {
    const { onChange } = this.props
    const newVal = (e.target as HTMLSelectElement).value as TypeEditorProps['type']
    if (onChange !== undefined) onChange(newVal)
  }

  render () {
    const { props, handleChange } = this
    return <select
      value={props.type}
      disabled={props.allowedTypes.length <= 1}
      onChange={handleChange}>
      {props.allowedTypes.map(allowedType => (
        <option value={allowedType}>{allowedType}</option>
      ))}
    </select>
  }
}

// String Value Editor
type StringValueEditorProps = {
  value: string
  rule?: ValidationRule<string>
  fallback?: string
}

type StringValueEditorState = {}

export class StringValueEditor extends Component<StringValueEditorProps, StringValueEditorState> {
  render () {
    const { props } = this
    const { value, rule, fallback } = props
    const validated = validateOne(value, rule, fallback).validated

    // Select in list
    if (isArray(rule)) {
      return <select
        value={validated}
        disabled={rule.length <= 1}>
        {rule.map(opt => (
          <option value={opt}>{opt}</option>
        ))}
      </select>
    }

    // Free input
    return <input
      type='text'
      value={validated} />
  }
}
