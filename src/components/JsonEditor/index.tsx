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

export const isPrimitive = (val: unknown): val is PrimitiveValue => {
  const type = getValueType(val) 
  return ['string', 'number', 'boolean', 'null'].includes(type)
}

export const valueDefaults = {
  string: '',
  number: 0,
  boolean: false,
  null: null,
  array: [],
  object: {}
}

export type ValueType = ReturnType<typeof getValueType>

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
      this._value = Json.cloneValue(jsonValue, true) as PrimitiveValue
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

  static cloneValue (input: Value, deep: boolean = false): Value {
    if (isArray(input)) return [...input].map(subInput => deep
      ? Json.cloneValue(subInput, deep)
      : subInput)
    if (isObject(input)) return Object
      .entries(input)
      .reduce((reduced, [key, subInput]) => ({
        ...reduced,
        [key]: deep ? Json.cloneValue(subInput, deep) : subInput
      }), {} as ObjectValue)
    return input
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
        else if (_value[pos] === undefined) { _value[pos] = new Json(Json.cloneValue(fillValue ?? null, true)) }
      })
    } else {
      if (!isObject(this._value)) { this._value = {} }
      this._value[prop] = new Json(value)
    }
    return this
  }

  setValueAtPath (path: Path, value: Value, fillValue?: Value): this {
    if (path.length === 0) {
      if (isObject(value)) {
        this._value = Object
          .entries(value)
          .reduce((reduced, [key, val]) => ({
            ...reduced,
            [key]: new Json(val)
          }), {} as { [key: string]: Json })
      } else if (isArray(value)) {
        this._value = value.map(val => new Json(val))
      } else {
        this._value = Json.cloneValue(value, true) as PrimitiveValue
      }
      return this
    }
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

  static areDeepEqual (valueA: Value, valueB: Value) {
    if (isPrimitive(valueA) && isPrimitive(valueB)) return valueA === valueB
    const jsonA = new Json(valueA).sortProperties()
    const jsonB = new Json(valueB).sortProperties()
    const strA = JSON.stringify(jsonA.json)
    const strB = JSON.stringify(jsonB.json)
    return strA === strB
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

export function makeValidationSuccess<T extends Value> (
  validated: T,
  input: T | undefined
): ValidationSuccessResult<T> {
  return makeValidationResult(true, validated, input)
}

export function makeValidationFailure<T extends Value> (
  validated: T,
  input: T | undefined,
  reason: string
): ValidationFailureResult<T> {
  return makeValidationResult(false, validated, input, reason)
}

export type ValidationOptions<T extends Value> = Array<T>
export type ValidationFunction<T extends Value> = (input: T) => ValidationResult<T>
export type ValidationRule<T extends Value> = ValidationOptions<T> | ValidationFunction<T>

export function validateOne<T extends Value> (input: T, rule?: ValidationRule<T>, fallback?: T): ValidationResult<T> {
  if (Array.isArray(rule)) {
    const firstRuleElement = rule.at(0)
    if (firstRuleElement === undefined) return makeValidationSuccess(input, input)
    const isValid = rule.includes(input)
    if (isValid) return makeValidationSuccess(input, input)
    return makeValidationFailure(fallback ?? firstRuleElement, input, `${input} is not in the options list`)
  }
  if (rule === undefined) return makeValidationSuccess(input, input)
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
    scheme?: Scheme,
    path: Path = [],
    testFallback: boolean = true
  ): SchemeTestResults {
    
    if (scheme === undefined) return []
  
    if (testFallback) {
      const fallbackTest = test(scheme.fallback, scheme, path, false)
      const someResultsAreBad = fallbackTest.some(result => result.result.success === false)
      if (someResultsAreBad) throw new Error(`provided fallback (${scheme.fallback}) in scheme doesn\'t comply to scheme at path /${path.join('/')}`)
    }
  
    if (isString(input)) {
      if (scheme.string === undefined) return [{ path, result: makeValidationFailure(scheme.fallback, input, 'string type is not allowed') }]
      if (scheme.string === true) return [{ path, result: makeValidationSuccess(input, input) }]
      if (scheme.string.rule === undefined) return [{ path, result: makeValidationSuccess(input, input) }]
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
      if (scheme.number === undefined) return [{ path, result: makeValidationFailure(scheme.fallback, input, 'number type is not allowed') }]
      if (scheme.number === true) return [{ path, result: makeValidationSuccess(input, input) }]
      if (scheme.number.rule === undefined) return [{ path, result: makeValidationSuccess(input, input) }]
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
      if (scheme.boolean === undefined) return [{ path, result: makeValidationFailure(scheme.fallback, input, 'boolean type is not allowed') }]
      if (scheme.boolean === true) return [{ path, result: makeValidationSuccess(input, input) }]
      if (scheme.boolean.rule === undefined) return [{ path, result: makeValidationSuccess(input, input) }]
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
      if (scheme.null === undefined) return [{ path, result: makeValidationFailure(scheme.fallback, input, 'null type is not allowed') }]
      return [{ path, result: makeValidationSuccess(input, input) }]
    }
  
    if (isArray(input)) {
      if (scheme.array === undefined) return [{ path, result: makeValidationFailure(scheme.fallback, input, 'array type is not allowed') }]
      if (scheme.array === true) return [{ path, result: makeValidationSuccess(input, input) }]
      const {
        minLength = 0,
        maxLength = Infinity,
        values: subSchemes = [],
        rule = (input: ArrayValue) => makeValidationSuccess(input, input),
        fallback
      } = scheme.array
      if (testFallback && scheme.array.fallback !== undefined) {
        const fallbackTest = test(scheme.array.fallback, scheme, path, false)
        const someResultsAreBad = fallbackTest.some(result => result.result.success === false)
        if (someResultsAreBad) throw new Error(`provided array fallback in scheme doesn\'t comply to scheme at path /${path.join('/')}`)
      }
      if (input.length < minLength) return [{ path, result: makeValidationFailure(fallback ?? scheme.fallback, input, 'array length should be at least of ${minLength}') }]
      if (input.length > maxLength) return [{ path, result: makeValidationFailure(fallback ?? scheme.fallback, input, 'array length should be at most of ${maxLength}') }]
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
          return [{ path: subPath, result: makeValidationFailure(subScheme?.fallback ?? null, input, 'value expected') }]
        }
        if (subScheme === undefined) return [{ path: subPath, result: makeValidationSuccess(subInput, subInput) }]
        return test(subInput, subScheme, subPath)
      })
      return subResults.flat()
    }
    
    if (isObject(input)) {
      if (scheme.object === undefined) return [{ path, result: makeValidationFailure(scheme.fallback, input, 'object type is not allowed') }]
      if (scheme.object === true) return [{ path, result: makeValidationSuccess(input, input) }]
      const {
        properties: subSchemes = {},
        rule = (input: ObjectValue) => makeValidationSuccess(input, input),
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
          return [{ path: subPath, result: makeValidationFailure(subScheme?.fallback ?? null, undefined, 'value expected') }]
        }
        if (subScheme === undefined) return [{ path: subPath, result: makeValidationSuccess(subInput, subInput) }]
        return test(subInput, subScheme, subPath)
      })
      return subResults.flat()
    }
    
    return [{ path, result: makeValidationFailure(scheme.fallback, input, 'input is not a valid JSON type') }]
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
    const results = test(input, scheme)
    const fixed = applyTestResults(input, results)
    return fixed
  }

  export function getAllowedTypes (scheme?: Scheme): ValueType[] {
    if (scheme === undefined) return ['string', 'number', 'boolean', 'null', 'array', 'object']
    const returned: ValueType[] = []
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
  path?: Path
}

export class ValueEditor extends Component<ValueEditorProps> {
  constructor (props: ValueEditorProps) {
    super(props)
    this.handleTypeChange = this.handleTypeChange.bind(this)
    this.handleValueChange = this.handleValueChange.bind(this)
  }

  handleTypeChange (type: ValueType) {
    const { value, scheme, onChange } = this.props
    const currValidated = Scheme.apply(value, scheme)
    const currType = getValueType(currValidated)
    if (type === currType) return this.forceUpdate()
    const schemeTypeField = scheme === undefined ? true : scheme[type]
    if (schemeTypeField === undefined) return this.forceUpdate()
    if (onChange === undefined) return;
    if (schemeTypeField === true) return onChange(Json.cloneValue(valueDefaults[type], true))
    const { rule, fallback } = schemeTypeField
    if (fallback !== undefined) return onChange(fallback)
    if (rule === undefined) return onChange(Json.cloneValue(valueDefaults[type], true))
    const validated = validateOne('', rule as ValidationRule<Value>, scheme?.fallback).validated
    return onChange(validated)
  }

  handleValueChange (newValue: Value) {
    const { value, scheme, onChange } = this.props
    const currValidated = Scheme.apply(value, scheme)
    const validated = Scheme.apply(newValue, scheme)
    if (Json.areDeepEqual(currValidated, validated)) return this.forceUpdate()
    if (onChange === undefined) return;
    return onChange(validated)
  }

  render () {
    const { props, handleTypeChange, handleValueChange } = this
    const { value, scheme, path } = props
    const validated = Scheme.apply(value, scheme)
    const type = getValueType(validated)
    const allowedTypes = Scheme.getAllowedTypes(scheme)
    const strPath = path !== undefined ? `/${path.join('/')}` : undefined
    return <span
      className='value-editor'
      data-path={strPath}>
      <TypeEditor
        type={type}
        allowedTypes={[...allowedTypes]}
        onChange={handleTypeChange}
        path={path} />
      {type === 'string' && <StringValueEditor
        value={validated as string}
        rule={isObject(scheme?.string) ? scheme?.string.rule : undefined}
        fallback={isObject(scheme?.string) ? scheme?.string.fallback : undefined}
        onChange={handleValueChange}
        path={path} />}
      {type === 'number' && <NumberValueEditor
        value={validated as number}
        rule={isObject(scheme?.number) ? scheme?.number.rule : undefined}
        fallback={isObject(scheme?.number) ? scheme?.number.fallback : undefined}
        onChange={handleValueChange}
        path={path} />}
      {type === 'boolean' && <BooleanValueEditor
        value={validated as boolean}
        rule={isObject(scheme?.boolean) ? scheme?.boolean.rule : undefined}
        fallback={isObject(scheme?.boolean) ? scheme?.boolean.fallback : undefined}
        onChange={handleValueChange}
        path={path} />}
      {type === 'null' && <span className='null-value-editor' data-path={strPath}>null</span>}
      {type === 'array' && <ArrayValueEditor
        value={validated as ArrayValue}
        rule={isObject(scheme?.array) ? scheme?.array.rule : undefined}
        fallback={isObject(scheme?.array) ? scheme?.array.fallback : undefined}
        preventPropertyCreation={isObject(scheme?.array) ? scheme?.array.preventPropertyCreation : undefined}
        preventPropertyDeletion={isObject(scheme?.array) ? scheme?.array.preventPropertyDeletion : undefined}
        preventPropertiesShift={isObject(scheme?.array) ? scheme?.array.preventPropertiesShift : undefined}
        minLength={isObject(scheme?.array) ? scheme?.array.minLength : undefined}
        maxLength={isObject(scheme?.array) ? scheme?.array.maxLength : undefined}
        values={isObject(scheme?.array) ? scheme?.array.values : undefined}
        onChange={handleValueChange}
        path={path} />}
      {type === 'object' && <ObjectValueEditor
        value={validated as ObjectValue}
        rule={isObject(scheme?.object) ? scheme?.object.rule : undefined}
        fallback={isObject(scheme?.object) ? scheme?.object.fallback : undefined}
        preventPropertyCreation={isObject(scheme?.object) ? scheme?.object.preventPropertyCreation : undefined}
        preventPropertyDeletion={isObject(scheme?.object) ? scheme?.object.preventPropertyDeletion : undefined}
        properties={isObject(scheme?.object) ? scheme?.object.properties : undefined}
        onChange={handleValueChange}
        path={path} />}
    </span>
  }
}

// Type Editor

export type TypeEditorProps = {
  type: ValueType
  allowedTypes: ValueType[]
  onChange?: (type: ValueType) => void
  path?: Path
}

export class TypeEditor extends Component<TypeEditorProps> {
  constructor (props: TypeEditorProps) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (e: Event) {
    const { onChange } = this.props
    if (onChange === undefined) return;
    const newVal = (e.target as HTMLSelectElement).value as TypeEditorProps['type']
    onChange(newVal)
  }

  render () {
    const { props, handleChange } = this
    const strPath = props.path !== undefined ? `/${props.path.join('/')}` : undefined
    return <select
      className='type-editor'
      data-path={strPath}
      data-value={props.type}
      value={props.type}
      disabled={props.allowedTypes.length <= 1}
      onChange={handleChange}>
      {props.allowedTypes.map(allowedType => (
        <option
          class='type-editor__option'
          data-value={allowedType}
          data-path={strPath}
          value={allowedType}>
          {allowedType}
        </option>
      ))}
    </select>
  }
}

// String Value Editor

type StringValueEditorProps = {
  value: string
  rule?: ValidationRule<string>
  fallback?: string
  onChange?: (value: string) => void
  path?: Path
}

export class StringValueEditor extends Component<StringValueEditorProps> {
  constructor (props: StringValueEditorProps) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (e: Event) {
    const { onChange } = this.props
    if (onChange === undefined) return;
    const newVal = (e.target as HTMLSelectElement | HTMLInputElement).value
    return onChange(newVal)
  }

  render () {
    const { props, handleChange } = this
    const { value, rule, fallback, path } = props
    const validated = validateOne(value, rule, fallback).validated
    const strPath = path !== undefined ? `/${path.join('/')}` : undefined

    // Select in list
    if (isArray(rule) && rule.length > 0) {
      return <select
        className='string-value-editor string-value-editor_select'
        data-path={strPath}
        data-value={validated}
        value={validated}
        disabled={rule.length <= 1}
        onChange={handleChange}>
        {rule.map(opt => (
          <option
            className='string-value-editor__option'
            data-value={opt}
            value={opt}>
            {opt}
          </option>
        ))}
      </select>
    }

    // Free input
    return <input
      className='string-value-editor string-value-editor_input'
      data-path={strPath}
      data-value={validated}
      type='text'
      value={validated}
      onChange={handleChange} />
  }
}

// Number Value Editor

type NumberValueEditorProps = {
  value: number
  rule?: ValidationRule<number>
  fallback?: number
  onChange?: (value: number) => void
  path?: Path
}

export class NumberValueEditor extends Component<NumberValueEditorProps> {
  constructor (props: NumberValueEditorProps) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (e: Event) {
    const { onChange } = this.props
    if (onChange === undefined) return;
    const newVal = window.parseFloat((e.target as HTMLSelectElement | HTMLInputElement).value)
    return onChange(newVal)
  }

  render () {
    const { props, handleChange } = this
    const { value, rule, fallback, path } = props
    const validated = validateOne(value, rule, fallback).validated
    const strPath = path !== undefined ? `/${path.join('/')}` : undefined

    // Select in list
    if (isArray(rule) && rule.length > 0) {
      return <select
        className='number-value-editor number-value-editor_select'
        data-path={strPath}
        data-value={validated}
        value={validated}
        disabled={rule.length <= 1}
        onChange={handleChange}>
        {rule.map(opt => (
          <option
            className='number-value-editor__option'
            data-value={opt}
            value={opt}>
            {opt}
          </option>
        ))}
      </select>
    }

    // Free input
    return <input
      className='number-value-editor number-value-editor_input'
      data-path={strPath}
      data-value={validated}
      type='number'
      value={validated}
      onChange={handleChange} />
  }
}

// Boolean Value Editor

type BooleanValueEditorProps = {
  value: boolean
  rule?: ValidationRule<boolean>
  fallback?: boolean
  onChange?: (value: boolean) => void
  path?: Path
}

export class BooleanValueEditor extends Component<BooleanValueEditorProps> {
  constructor (props: BooleanValueEditorProps) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (e: Event) {
    const { onChange } = this.props
    if (onChange === undefined) return;
    const newVal = (e.target as HTMLInputElement).checked
    return onChange(newVal)
  }

  render () {
    const { props, handleChange } = this
    const { value, rule, fallback, path } = props
    const validated = validateOne(value, rule, fallback).validated
    const strPath = path !== undefined ? `/${path.join('/')}` : undefined

    // Free input
    return <input
      className='boolean-value-editor'
      data-path={strPath}
      data-value={validated}  
      type='checkbox'
      checked={validated}
      disabled={isArray(rule) && rule.length === 1}
      onChange={handleChange} />
  }
}

// Array Value Editor

type ArrayValueEditorProps = {
  value: ArrayValue
  rule?: ValidationRule<ArrayValue>
  fallback?: ArrayValue
  preventPropertyCreation?: boolean
  preventPropertyDeletion?: boolean
  preventPropertiesShift?: boolean
  minLength?: number
  maxLength?: number
  values?: Array<{
    optional?: boolean
    scheme?: Scheme.Scheme
  }>
  onChange?: (value: ArrayValue) => void
  path?: Path
}

export class ArrayValueEditor extends Component<ArrayValueEditorProps> {
  constructor (props: ArrayValueEditorProps) {
    super(props)
    this.handlePropertyChange = this.handlePropertyChange.bind(this)
    this.handlePropertyDeletion = this.handlePropertyDeletion.bind(this)
    this.handlePropertyLift = this.handlePropertyLift.bind(this)
    this.handlePropertyDrop = this.handlePropertyDrop.bind(this)
    this.handlePropertyCreation = this.handlePropertyCreation.bind(this)
  }

  handlePropertyChange (value: Value, position: number) {
    const { value: currValue, onChange } = this.props
    if (onChange === undefined) return;
    const newVal = [
      ...currValue.slice(0, position),
      value,
      ...currValue.slice(position + 1)
    ]
    return onChange(newVal)
  }

  handlePropertyDeletion (position: number) {
    const { value: currValue, onChange } = this.props
    if (onChange === undefined) return;
    const newVal = [
      ...currValue.slice(0, position),
      ...currValue.slice(position + 1)
    ]
    return onChange(newVal)
  }

  handlePropertyLift (position: number) {
    const { value: currValue, onChange } = this.props
    if (onChange === undefined) return;
    if (position <= 0) return;
    const newVal = [
      ...currValue.slice(0, position - 1),
      currValue[position] as Value,
      currValue[position - 1] as Value,
      ...currValue.slice(position + 1)
    ]
    return onChange(newVal)
  }

  handlePropertyDrop (position: number) {
    const { value: currValue, onChange } = this.props
    if (onChange === undefined) return;
    if (position >= currValue.length - 1) return;
    const newVal = [
      ...currValue.slice(0, position),
      currValue[position + 1] as Value,
      currValue[position] as Value,
      ...currValue.slice(position + 2)
    ]
    return onChange(newVal)
  }

  handlePropertyCreation () {
    const { value: currValue, onChange } = this.props
    if (onChange === undefined) return;
    return onChange([...currValue, null])
  }

  render () {
    const {
      props,
      handlePropertyChange,
      handlePropertyDeletion,
      handlePropertyLift,
      handlePropertyDrop,
      handlePropertyCreation
    } = this
    const {
      value,
      rule,
      fallback,
      preventPropertyCreation,
      preventPropertyDeletion,
      preventPropertiesShift,
      minLength,
      maxLength,
      values,
      path
    } = props
    const validated = validateOne(value, rule, fallback).validated
    const lastMantatoryPos = values?.reduce((lastMandatoryPos, valueData, valuePos) => {
      const { optional } = valueData
      if (optional !== true) return valuePos
      return lastMandatoryPos
    }, -1) ?? -1
    const isUnaddable = preventPropertyCreation || validated.length >= (maxLength ?? Infinity)
    const strPath = path !== undefined ? `/${path.join('/')}` : undefined

    const wrapperMainClass = 'array-value-editor'
    const wrapperClasses = [`${wrapperMainClass}`]
    if (isUnaddable) wrapperClasses.push(`${wrapperMainClass}_no-creation`)
    if (preventPropertyDeletion === true) wrapperClasses.push(`${wrapperMainClass}_no-deletion`)
    if (preventPropertiesShift === true) wrapperClasses.push(`${wrapperMainClass}_no-shift`)

    // Free input
    return <span
      className={wrapperClasses.join(' ')}
      data-path={strPath}
      data-min-length={minLength}
      data-max-length={maxLength}>
      <span className={`${wrapperMainClass}__opening-bracket`}>{'['}</span>
      <div className={`${wrapperMainClass}__properties`}>
        {validated.map((value, valuePos) => {
          const { scheme } = values?.[valuePos] ?? {}
          const isTrulyOptional = valuePos > lastMantatoryPos
          const prevIsTrulyOptional = valuePos - 1 > lastMantatoryPos
          const isUndeletable = preventPropertyDeletion === true
            || validated.length <= (minLength ?? 0)
            || !isTrulyOptional
          const isUnliftable = preventPropertiesShift === true
            || valuePos <= 0
            || !isTrulyOptional
            || !prevIsTrulyOptional
          const isUndroppable = preventPropertiesShift === true
            || valuePos >= validated.length - 1
            || !isTrulyOptional
          const propertyMainClass = `${wrapperMainClass}__property`
          const propertyClasses = [propertyMainClass]
          if (isTrulyOptional) propertyClasses.push(`${propertyMainClass}_optional`)
          if (isUndeletable) propertyClasses.push(`${propertyMainClass}_undeletable`)
          if (isUnliftable) propertyClasses.push(`${propertyMainClass}_unliftable`)
          if (isUndroppable) propertyClasses.push(`${propertyMainClass}_undroppable`)
          return <div
            className={`${wrapperMainClass}__property`}
            data-path={strPath !== undefined ? `${strPath}/${valuePos}` : undefined}
            data-local-path={valuePos}>
            <button
              className={`${wrapperMainClass}__delete-property`}
              disabled={isUndeletable}
              onClick={() => handlePropertyDeletion(valuePos)}>x</button>
            <button
              className={`${wrapperMainClass}__lift-property`}
              disabled={isUnliftable}
              onClick={() => handlePropertyLift(valuePos)}>↑</button>
            <button
              className={`${wrapperMainClass}__drop-property`}
              disabled={isUndroppable}
              onClick={() => handlePropertyDrop(valuePos)}>↓</button>
            <ValueEditor
              value={value}
              scheme={scheme}
              onChange={val => handlePropertyChange(val, valuePos)}
              path={path !== undefined ? [...path, valuePos] : undefined} />
          </div>
        })}
        <button
          className={`${wrapperMainClass}__create-property`}
          disabled={isUnaddable}
          onClick={handlePropertyCreation}>+ Create</button>
      </div>
      <span className={`${wrapperMainClass}__closing-bracket`}>{']'}</span>
    </span>
  }
}

// Array Value Editor

type ObjectValueEditorProps = {
  value: ObjectValue
  rule?: ValidationFunction<ObjectValue>
  fallback?: ObjectValue
  preventPropertyCreation?: boolean
  preventPropertyDeletion?: boolean
  properties?: {
    [key: string]: {
      optional?: boolean
      scheme?: Scheme.Scheme
    }
  }
  onChange?: (value: ObjectValue) => void
  path?: Path
}

export class ObjectValueEditor extends Component<ObjectValueEditorProps> {
  constructor (props: ObjectValueEditorProps) {
    super(props)
    this.handlePropertyChange = this.handlePropertyChange.bind(this)
    this.handleKeyChange = this.handleKeyChange.bind(this)
    this.handleKeyDeletion = this.handleKeyDeletion.bind(this)
    this.handlePropertyCreation = this.handlePropertyCreation.bind(this)
  }

  handlePropertyChange (key: string, value: Value) {
    const { value: currValue, onChange } = this.props
    if (onChange === undefined) return;
    const newValue = { ...currValue, [key]: value }
    return onChange(newValue)
  }

  handleKeyChange (prevKey: string, newKey: string) {
    const { value: currValue, onChange } = this.props
    if (onChange === undefined) return;
    const newKeyAlreadyExists = currValue[newKey] !== undefined
    if (newKeyAlreadyExists) return this.forceUpdate()
    const propValue = currValue[prevKey]
    if (propValue === undefined) return;
    const newValue = Object.entries(currValue).reduce((reduced, [key, val]) => {
      if (key === prevKey) return { ...reduced, [newKey]: val }
      return { ...reduced, [key]: val }
    }, {} as ObjectValue)
    delete newValue[prevKey]
    return onChange(newValue)
  }

  handleKeyDeletion (key: string) {
    const { value: currValue, onChange } = this.props
    if (onChange === undefined) return;
    const newValue = { ...currValue }
    delete newValue[key]
    return onChange(newValue)
  }

  handlePropertyCreation (key?: string, value?: Value) {
    const { value: currValue, onChange } = this.props
    if (onChange === undefined) return;
    let actualKey: string
    if (key === undefined) {
      const defaultKeyName = '<no-name>'
      const randomId = Math.random().toString(36).slice(2, 10)
      if (currValue[defaultKeyName] !== undefined) { actualKey = `<no-name-${randomId}>` }
      else { actualKey = defaultKeyName }
    } else {
      actualKey = key
    }
    if (currValue[actualKey] !== undefined) return this.forceUpdate()
    const newValue = { ...currValue, [actualKey]: value ?? null }
    return onChange(newValue)
  }

  render () {
    const {
      props,
      handlePropertyChange,
      handleKeyChange,
      handleKeyDeletion,
      handlePropertyCreation
    } = this
    const {
      value,
      rule,
      fallback,
      preventPropertyCreation,
      preventPropertyDeletion,
      properties,
      path
    } = props
    const validated = validateOne(value, rule, fallback).validated
    const missingDeclaredOptionalKeys = Object
      .entries(properties ?? {})
      .filter(([_, { optional }]) => (optional === true))
      .filter(([key]) => validated[key] === undefined)
      .map(([key]) => key)

    const strPath = path !== undefined ? `/${path.join('/')}` : undefined
    const wrapperMainClass = 'object-value-editor'
    const wrapperClasses = [wrapperMainClass]
    if (preventPropertyCreation === true) wrapperClasses.push(`${wrapperMainClass}_no-creation`)
    if (preventPropertyDeletion === true) wrapperClasses.push(`${wrapperMainClass}_no-deletion`)

    // Free input
    return <span
      className={wrapperClasses.join(' ')}
      data-path={strPath}>
      <span className={`${wrapperMainClass}__opening-brace`}>{'{'}</span>
      <div className={`${wrapperMainClass}__properties`}>
        {Object.entries(validated).map(([key, value]) => {
          const isOptional = properties === undefined
            || properties[key] === undefined
            || properties[key]?.optional === true
          const isUndeletable = preventPropertyDeletion || !isOptional
          const propertyMainClass = `${wrapperMainClass}__property`
          const propertyClasses = [propertyMainClass]
          if (isOptional) propertyClasses.push(`${propertyMainClass}_optional`)
          if (isUndeletable) propertyClasses.push(`${propertyMainClass}_undeletable`)
          return <div className={propertyClasses.join(' ')}>
            <button
              className={`${wrapperMainClass}__delete-property`}
              disabled={isUndeletable}
              onClick={() => handleKeyDeletion(key)}>x</button>
            <span
              className={`${wrapperMainClass}__property-name`}
              data-value={key}>
              <StringValueEditor
                value={key}
                rule={!isOptional ? [key] : undefined}
                onChange={newKey => handleKeyChange(key, newKey)}
                path={path !== undefined ? [...path, key] : undefined} />
            </span>
            <ValueEditor
              value={value}
              scheme={properties?.[key]?.scheme}
              onChange={newValue => handlePropertyChange(key, newValue)} />
          </div>
        })}
        {missingDeclaredOptionalKeys.map(key => (
          <button 
            className={`${wrapperMainClass}__create-optional-property`}
            data-value={key}
            disabled={preventPropertyCreation === true}
            onClick={() => handlePropertyCreation(key)}>
            Create optional key: {key}
          </button>
        ))}
        {<button 
          className={`${wrapperMainClass}__create-property`}
          disabled={preventPropertyCreation === true}
          onClick={() => handlePropertyCreation()}>
          + Create
        </button>}
      </div>
      <span className={`${wrapperMainClass}__closing-brace`}>{'}'}</span>
    </span>
  }
}

type JsonEditorProps = {
  initValue?: Value
  scheme?: Scheme.Scheme
  onChange: (value: Value) => void
}

type JsonEditorState = {
  value: Value
}

export class JsonEditor extends Component<JsonEditorProps, JsonEditorState> {
  state: { value: Value } = {
    value: this.props.initValue ?? null
  }

  render () {
    const { props, state } = this
    const { scheme, onChange } = props
    const { value } = state
    return <span className='json-editor'>
      <ValueEditor
      path={[]}
      value={value}
      scheme={scheme}
      onChange={value => {
        this.setState({ value })
        if (onChange !== undefined) onChange(value)
      }} />
    </span>
  }
}