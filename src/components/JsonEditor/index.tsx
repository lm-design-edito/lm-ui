import { Component } from 'preact'

type JsonPrimitiveValue = string | number | boolean | null
type JsonValue = JsonPrimitiveValue | JsonValue[] | { [key: string]: JsonValue }
type JsonPath = Array<string | number>

type ValidationOptions<T extends any> = Array<T>
type ValidationFunction<T extends any> = (input: T) => (
  { success: true, validated: T }
  | { success: false, validated: T, reason?: string }
)

type Validator<T extends any> = ValidationOptions<T> | ValidationFunction<T>

function validate<T> (input: T, rule?: Validator<T>): ReturnType<ValidationFunction<T>> {
  if (Array.isArray(rule)) {
    const firstRuleElement = rule.at(0)
    if (firstRuleElement === undefined) return { success: true, validated: input }
    const isValid = rule.includes(input)
    if (isValid) return { success: true, validated: input }
    return {
      success: false,
      reason: `${input} is not in the options list`,
      validated: firstRuleElement
    }
  }
  if (rule === undefined) return { success: true, validated: input }
  return rule(input)
}

function validateMany<T extends any> (input: T, ...rules: Validator<T>[]): ReturnType<ValidationFunction<T>> {
  if (rules.length === 0) return validate(input)
  return rules.reduce((latestValidationResult, rule) => {
    if (!latestValidationResult.success) return latestValidationResult
    return validate(latestValidationResult.validated, rule)
  }, validate(input))
}

// STRING VALUE ==========================================================

type StringValueEditorProps = {
  path?: JsonPath
  value: string
  onChange?: (val: string) => void
  validation?: Validator<StringValueEditorProps['value']>
}

type StringValueEditorState = {
  value: StringValueEditorProps['value']
}

export class StringValueEditor extends Component<StringValueEditorProps, StringValueEditorState> {
  $root: HTMLSelectElement | HTMLInputElement | null = null

  constructor (props: StringValueEditorProps) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    const { value, validation, onChange, path } = props
    const validationResult = validate(value, validation)
    if (!validationResult.success) throw new Error(`The initial string value ${value} at path ${path?.join('/')} is not valid : ${validationResult.reason}`)
    const initValue = validationResult.validated
    this.state = { value: initValue }
    if (onChange !== undefined) onChange(initValue)
  }

  handleChange (e: Event) {
    const { $root } = this
    const { onChange, path, validation } = this.props
    const rawNewValue = (e.target as HTMLInputElement).value
    const validationResult = validate(rawNewValue, validation)
    if (!validationResult.success) {
      if ($root !== null) { $root.value = this.state.value }
      return;
    }
    const newValue = validationResult.validated
    this.setState(curr => {
      if (onChange === undefined) return { ...curr, value: newValue }
      console.group(`StringValue - ${path?.join('/')} - handle change`)
      console.log(newValue)
      onChange(newValue)
      console.groupEnd()
      return { ...curr, value: newValue }
    })
  }

  render () {
    const { validation } = this.props
    const { value } = this.state
    // Select option
    if (Array.isArray(validation) && validation.length > 0) return <select
      disabled={validation.length === 1}
      onChange={this.handleChange}
      ref={$n => { this.$root = $n }}>
      {validation.map(item => <option
        value={item}
        selected={item === value}>
        {item}
      </option>)}
    </select>
    // Free input
    return <input
      type='text'
      onInput={this.handleChange}
      defaultValue={value}
      ref={$n => { this.$root = $n }} />
  }
}

// NUMBER VALUE ==========================================================

type NumberValueEditorProps = {
  path?: JsonPath
  value: number
  onChange?: (val: number) => void
  validation?: Validator<NumberValueEditorProps['value']>
}

type NumberValueEditorState = {
  value: NumberValueEditorProps['value']
}

export class NumberValueEditor extends Component<NumberValueEditorProps, NumberValueEditorState> {
  $root: HTMLSelectElement | HTMLInputElement | null = null

  constructor (props: NumberValueEditorProps) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    const { value, validation, onChange, path } = props
    const validationResult = validate(value, validation)
    if (!validationResult.success) throw new Error(`The initial number value ${value} at path ${path?.join('/')} is not valid : ${validationResult.reason}`)
    const initValue = validationResult.validated
    this.state = { value: initValue }
    if (onChange !== undefined) onChange(initValue)
  }

  handleChange (e: Event) {
    const { $root } = this
    const { onChange, path, validation } = this.props
    const rawNewValue = window.parseFloat((e.target as HTMLInputElement).value)
    const validationResult = validate(rawNewValue, validation)
    if (!validationResult.success) {
      if ($root !== null) { $root.value = `${this.state.value}` }
      return;
    }
    const newValue = validationResult.validated
    this.setState(curr => {
      if (onChange === undefined) return { ...curr, value: newValue }
      console.group(`NumberValue - ${path?.join('/')} - handle change`)
      console.log(newValue)
      onChange(newValue)
      console.groupEnd()
      return { ...curr, value: newValue }
    })
  }

  render () {
    const { validation } = this.props
    const { value } = this.state
    // Select option
    if (Array.isArray(validation) && validation.length > 0) return <select
      disabled={validation.length === 1}
      onChange={this.handleChange}
      ref={$n => { this.$root = $n }}>
      {validation.map(item => <option
        value={item}
        selected={item === value}>
        {item}
      </option>)}
    </select>
    // Free input
    return <input
      type='number'
      onInput={this.handleChange}
      defaultValue={`${value}`}
      ref={$n => { this.$root = $n }} />
  }
}

// BOOLEAN VALUE ==========================================================

type BooleanValueEditorProps = {
  path?: JsonPath
  value: boolean
  onChange?: (val: boolean) => void
  validation?: Validator<BooleanValueEditorProps['value']>
}

type BooleanValueEditorState = {
  value: BooleanValueEditorProps['value']
}

export class BooleanValueEditor extends Component<BooleanValueEditorProps, BooleanValueEditorState> {
  $root: HTMLSelectElement | HTMLInputElement | null = null

  constructor (props: BooleanValueEditorProps) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    const { value, validation, onChange, path } = props
    const validationResult = validate(value, validation)
    if (!validationResult.success) throw new Error(`The initial boolean value ${value} at path ${path?.join('/')} is not valid : ${validationResult.reason}`)
    const initValue = validationResult.validated
    this.state = { value: initValue }
    if (onChange !== undefined) onChange(initValue)
  }

  handleChange (e: Event) {
    const { $root } = this
    const { onChange, path, validation } = this.props
    const isSelectElement = (e.target as HTMLElement).tagName === 'SELECT'
    const rawNewValue = isSelectElement
      ? (e.target as HTMLSelectElement).value === 'true'
      : (e.target as HTMLInputElement).checked
    const validationResult = validate(rawNewValue, validation)
    if (!validationResult.success) {
      if ($root !== null) {
        if (isSelectElement) { ($root as HTMLSelectElement).value = `${this.state.value}` }
        else { ($root as HTMLInputElement).checked = this.state.value }
      }
      return;
    }
    const newValue = validationResult.validated
    this.setState(curr => {
      if (onChange === undefined) return { ...curr, value: newValue }
      console.group(`BooleanValue - ${path?.join('/')} - handle change`)
      console.log(newValue)
      onChange(newValue)
      console.groupEnd()
      return { ...curr, value: newValue }
    })
  }

  render () {
    const { validation } = this.props
    const { value } = this.state
    // Select option
    if (Array.isArray(validation) && validation.length > 0) return <select
      disabled={validation.length === 1}
      onChange={this.handleChange}
      ref={$n => { this.$root = $n }}>
      {validation.map(item => <option
        value={`${item}`}
        selected={item === value}>
        {`${item}`}
      </option>)}
    </select>
    // Free input
    return <input
      type='checkbox'
      onInput={this.handleChange}
      defaultChecked={value}
      ref={$n => { this.$root = $n }} />
  }
}

// NULL VALUE ==========================================================

type NullValueEditorProps = {
  value: null
  onChange?: (val: null) => void
}

export class NullValueEditor extends Component<NullValueEditorProps> {
  render () {
    return <span>null</span>
  }
}

// TYPE =================================================

type TypeEditorProps = {
  path?: JsonPath
  type: 'string' | 'number' | 'boolean' | 'null' | 'object' | 'array'
  onChange?: (val: TypeEditorProps['type']) => void
  validation?: Validator<TypeEditorProps['type']>
}

type TypeEditorState = {
  type: TypeEditorProps['type']
}

export class TypeEditor extends Component<TypeEditorProps, TypeEditorState>  {
  $root: HTMLSelectElement | null = null

  constructor (props: TypeEditorProps) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    const { type, validation, onChange, path } = props
    const validationResult = validate(type, validation)
    if (!validationResult.success) throw new Error(`The initial type ${type} at path ${path?.join('/')} is not valid : ${validationResult.reason}`)
    const initType = validationResult.validated
    this.state = { type: initType }
    if (onChange !== undefined) onChange(initType)
  }

  handleChange (e: Event) {
    const { $root } = this
    const { onChange, path, validation } = this.props
    const rawNewValue = (e.target as HTMLSelectElement).value as TypeEditorProps['type']
    const validationResult = validate(rawNewValue, validation)
    if (!validationResult.success) {
      if ($root !== null) { $root.value = this.state.type }
      return;
    }
    const newType = validationResult.validated
    this.setState(curr => {
      if (onChange === undefined) return { ...curr, value: newType }
      console.group(`Type - ${path?.join('/')} - handle change`)
      console.log(newType)
      onChange(newType)
      console.groupEnd()
      return { ...curr, value: newType }
    })
  }

  render () {
    const { validation } = this.props
    const { type } = this.state

    // Select option
    if (Array.isArray(validation) && validation.length > 0) {
      return <select
        disabled={validation.length === 1}
        onChange={this.handleChange}
        ref={$n => { this.$root = $n }}>
        {validation.map(item => <option
          value={`${item}`}
          selected={type === item}>
          {`${item}`}
        </option>)}
      </select>
    }

    // Free input
    return <select
      onChange={this.handleChange}
      ref={$n => { this.$root = $n }}>
      <option value='string' selected={type === 'string'}>string</option>
      <option value='number' selected={type === 'number'}>number</option>
      <option value='boolean' selected={type === 'boolean'}>boolean</option>
      <option value='null' selected={type === 'null'}>null</option>
      <option value='object' selected={type === 'object'}>object</option>
      <option value='array' selected={type === 'array'}>array</option>
    </select>
  }
}

// KEY ==========================================================

type KeyEditorProps = {
  path?: JsonPath
  name: string
  onChange?: (val: string) => void
  validation?: Validator<KeyEditorProps['name']>
}

export class KeyEditor extends Component<KeyEditorProps> {
  constructor (props: KeyEditorProps) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (val: string) {
    const { onChange, path } = this.props
    if (onChange === undefined) return;
    console.group(`Key - ${path?.join('/')} - handle value change`)
    console.log(val)
    onChange(val)
    console.groupEnd()
  }

  render () {
    const { name, path, validation } = this.props
    return <StringValueEditor
      path={path}
      value={name}
      onChange={this.handleChange}
      validation={validation} />
  }
}

// PROPERTY ==========================================================

type PropertyEditorProps = {
  path?: JsonPath
  name: KeyEditorProps['name']
  value: ValueEditorProps['value']
  onChange?: (name: PropertyEditorProps['name'], value: PropertyEditorProps['value']) => void
  nameValidation?: KeyEditorProps['validation']
  valueValidation?: ValueEditorProps['validation']
}

type PropertyEditorState = {
  name: PropertyEditorProps['name']
  value: PropertyEditorProps['value']
}

export class PropertyEditor extends Component<PropertyEditorProps, PropertyEditorState> {
  state: PropertyEditorState = {
    name: this.props.name,
    value: this.props.value
  }
 
  constructor (props: PropertyEditorProps) {
    super(props)
    this.handleKeyChange = this.handleKeyChange.bind(this)
    this.handleValueChange = this.handleValueChange.bind(this)
  }

  handleKeyChange (name: string) {
    this.setState({ name })
    const { onChange, path } = this.props
    if (onChange === undefined) return;
    const { value } = this.state
    console.group(`Property - ${path?.join('/')} - handle key change`)
    console.log({ name, value })
    onChange(name, value)
    console.groupEnd()
  }

  handleValueChange (value: JsonValue) {
    this.setState({ value })
    const { onChange, path } = this.props
    if (onChange === undefined) return;
    const { name } = this.state
    console.group(`Property - ${path?.join('/')} handle value change`)
    console.log({ name, value })
    onChange(name, value)
    console.groupEnd()
  }

  render () {
    const { name, value, path, nameValidation, valueValidation } = this.props
    return <>
      <KeyEditor
        path={path}
        name={name}
        onChange={this.handleKeyChange}
        validation={nameValidation} />:&nbsp;
      <ValueEditor  
        path={path}
        value={value}
        onChange={this.handleValueChange}
        validation={valueValidation} />
    </>
  }
}

// OBJECT =================================================

type ObjectEditorProps = {
  path?: JsonPath
  value: { [key: string]: JsonValue }
  onChange?: (value: ObjectEditorProps['value']) => void
  allowPropertyCreation?: boolean
  allowPropertyDeletion?: boolean
  keysValidation?: PropertyEditorProps['nameValidation']
  valuesValidation?: PropertyEditorProps['valueValidation']
  propertiesValidation?: {
    [key: string]: {
      deletable?: boolean
      name: PropertyEditorProps['nameValidation']
      value: PropertyEditorProps['valueValidation']
    }
  }
}

type ObjectEditorState = {
  value: ObjectEditorProps['value']
  propertiesValidation: NonNullable<ObjectEditorProps['propertiesValidation']>
}

export class ObjectEditor extends Component<ObjectEditorProps, ObjectEditorState> {
  state: ObjectEditorState = {
    value: this.props.value,
    propertiesValidation: this.props.propertiesValidation ?? {}
  }

  constructor (props: ObjectEditorProps) {
    super(props)
    this.handlePropertyChange = this.handlePropertyChange.bind(this)
    this.handlePropertyDeletion = this.handlePropertyDeletion.bind(this)
    this.handlePropertyCreation = this.handlePropertyCreation.bind(this)
  }

  handlePropertyChange (prevName: string, newName: string, value: JsonValue) {
    this.setState(curr => {
      let newValue: { [key: string]: JsonValue } = { ...curr.value, [newName]: value }
      if (prevName !== newName) { delete newValue[prevName] }        
      const { onChange, path } = this.props
      if (onChange === undefined) return { ...curr, value: newValue }
      console.group(`ObjectValue - ${path?.join('/')} - handle property change`)
      console.log(newValue)
      onChange(newValue)
      console.groupEnd()
      return { ...curr, value: newValue }
    })
  }

  handlePropertyDeletion (key: string) {
    this.setState(curr => {
      const newValue = { ...curr.value }
      delete newValue[key]
      const { onChange, path } = this.props
      if (onChange === undefined) return { ...curr, value: newValue }
      console.group(`ObjectValue - ${path?.join('/')} - handle property deletion`)
      console.log(newValue)
      onChange(newValue)
      console.groupEnd()
      return { ...curr, value: newValue }
    })
  }

  handlePropertyCreation () {
    this.setState(curr => {
      const newValue = { ...curr.value, ['']: '' }
      const { onChange, path } = this.props
      if (onChange === undefined) return { ...curr, value: newValue }
      console.group(`ObjectValue - ${path?.join('/')} - handle property creation`)
      console.log(newValue)
      onChange(newValue)
      console.groupEnd()
      return { ...curr, value: newValue }
    })
  }

  render () {
    const {
      path,
      allowPropertyCreation,
      allowPropertyDeletion,
      keysValidation,
      valuesValidation
    } = this.props
    const { value, propertiesValidation } = this.state
    return <>
      <span>{'{'}</span>
      <div style={{ paddingLeft: 40 }}>
        {Object.entries(value).map(([key, subValue]) => {
          const propertyValidationData = propertiesValidation[key]
          const isUndeletable = allowPropertyDeletion === false
            || propertyValidationData?.deletable === false
          return <div>
            <button
              disabled={isUndeletable}
              onClick={() => this.handlePropertyDeletion(key)}>x</button>
            <PropertyEditor
              path={[...(path ?? []), key]}
              name={key}
              value={subValue}
              onChange={(name, subValue) => this.handlePropertyChange(key, name, subValue)}
              nameValidation={name => {
                const validators: Validator<string>[] = []
                if (keysValidation !== undefined) validators.push(keysValidation)
                if (propertyValidationData?.name !== undefined) validators.push(propertyValidationData.name)
                return validateMany(name, ...validators)
              }}
              valueValidation={value => {
                const validators: Validator<JsonValue>[] = []
                if (valuesValidation !== undefined) validators.push(valuesValidation)
                if (propertyValidationData?.value !== undefined) validators.push(propertyValidationData?.value)
                return validateMany(value, ...validators)
              }} />
          </div>
        })}
        <button
          disabled={allowPropertyCreation === false}
          onClick={this.handlePropertyCreation}>
          + Add
        </button>
      </div>
      <span>{'}'}</span>
    </>
  }
}

// ARRAY =================================================

type ArrayEditorProps = {
  path?: JsonPath
  value: JsonValue[]
  onChange?: (value: ArrayEditorProps['value']) => void
  allowPropertyCreation?: boolean
  allowPropertyDeletion?: boolean
  allowPropertiesShift?: boolean
  valuesValidation?: ValueEditorProps['validation']
  minLength?: number
  maxLength?: number
  propertiesValidation?: Array<{
    deletable?: boolean
    value: ValueEditorProps['validation']
  }>
}

type ArrayEditorState = {
  value: ArrayEditorProps['value']
  _changesCount: number
}

export class ArrayEditor extends Component<ArrayEditorProps, ArrayEditorState> {
  state: ArrayEditorState = {
    value: this.props.value,
    _changesCount: 0
  }
  
  constructor (props: ArrayEditorProps) {
    super(props)
    this.handlePropertyChange = this.handlePropertyChange.bind(this)
    this.handlePropertyDeletion = this.handlePropertyDeletion.bind(this)
    this.handlePropertyCreation = this.handlePropertyCreation.bind(this)
    this.handlePropertyLift = this.handlePropertyLift.bind(this)
    this.handlePropertyDrop = this.handlePropertyDrop.bind(this)
  }

  handlePropertyChange (position: number, value: JsonValue) {
    this.setState(curr => {
      let newValue = [
        ...curr.value.slice(0, position),
        value,
        ...curr.value.slice(position + 1)
      ]
      const { onChange, path } = this.props
      if (onChange === undefined) return { ...curr, value: newValue }
      console.group(`ArrayValue - ${path?.join('/')} - handle property change`)
      console.log(newValue)
      onChange(newValue)
      console.groupEnd()
      return { ...curr, value: newValue }
    })
  }

  handlePropertyDeletion (pos: number) {
    this.setState(
      curr => {
        const newValue = [
          ...curr.value.slice(0, pos),
          ...curr.value.slice(pos + 1)
        ]
        const { onChange, path } = this.props
        if (onChange === undefined) return {
          ...curr,
          value: newValue,
          _changesCount: curr._changesCount + 1
        }
        console.group(`ArrayValue - ${path?.join('/')} - handle property deletion`)
        console.log(newValue)
        onChange(newValue)
        console.groupEnd()
        return {
          ...curr,
          value: newValue,
          _changesCount: curr._changesCount + 1
        }
      }
    )
  }

  handlePropertyCreation () {
    this.setState(curr => {
      const newValue = [...curr.value, '']
      const { onChange, path } = this.props
      if (onChange === undefined) return { ...curr, value: newValue }
      console.group(`ArrayValue - ${path?.join('/')} - handle property creation`)
      console.log(newValue)
      onChange(newValue)
      console.groupEnd()
      return { ...curr, value: newValue }
    })
  }

  handlePropertyLift (position: number) {
    if (position <= 0) return;
    this.setState(curr => {
      const newValue = [
        ...curr.value.slice(0, position - 1),
        curr.value[position] as JsonValue,
        curr.value[position - 1] as JsonValue,
        ...curr.value.slice(position + 1)
      ]
      const { onChange, path } = this.props
      if (onChange === undefined) return {
        ...curr,
        value: newValue,
        _changesCount: curr._changesCount + 1
      }
      console.group(`ArrayValue - ${path?.join('/')} - handle property lift`)
      console.log(newValue)
      onChange(newValue)
      console.groupEnd()
      return {
        ...curr,
        value: newValue,
        _changesCount: curr._changesCount + 1
      }
    })
  }

  handlePropertyDrop (position: number) {
    if (position >= this.state.value.length - 1) return;
    this.setState(curr => {
      const newValue = [
        ...curr.value.slice(0, position),
        curr.value[position + 1] as JsonValue,
        curr.value[position] as JsonValue,
        ...curr.value.slice(position + 2)
      ]
      const { onChange, path } = this.props
      if (onChange === undefined) return {
        ...curr,
        value: newValue,
        _changesCount: curr._changesCount + 1
      }
      console.group(`ArrayValue - ${path?.join('/')} - handle property drop`)
      console.log(newValue)
      onChange(newValue)
      console.groupEnd()
      return {
        ...curr,
        value: newValue,
        _changesCount: curr._changesCount + 1
      }
    })
  }

  render () {
    const {
      path,
      allowPropertyCreation,
      allowPropertyDeletion,
      allowPropertiesShift,
      valuesValidation,
      propertiesValidation,
      minLength,
      maxLength
    } = this.props
    const { value, _changesCount } = this.state
    return <>
      <span>{'['}</span>
      <div style={{ paddingLeft: 40 }}>
        {value.map((subValue, subValuePos) => {
          const propertyValidationData = (propertiesValidation ?? [])[subValuePos]
          const isUndeletable = allowPropertyDeletion === false
            || propertyValidationData?.deletable === false
            || value.length <= (minLength ?? 0)
          const isUnshiftable = allowPropertiesShift === false
          const isUnlhiftable = isUnshiftable || subValuePos === 0
          const isUndroppable = isUnshiftable || subValuePos === value.length - 1
          return <div key={`${subValuePos}-${_changesCount}`}>
            <button
              disabled={isUndeletable}
              onClick={() => this.handlePropertyDeletion(subValuePos)}>
              x
            </button>
            <button
              disabled={isUnlhiftable}
              onClick={() => this.handlePropertyLift(subValuePos)}>
              ↑
            </button>
            <button
              disabled={isUndroppable}
              onClick={() => this.handlePropertyDrop(subValuePos)}>
              ↓
            </button>
            <ValueEditor
              path={[...(path ?? []), subValuePos]}
              value={subValue}
              onChange={value => this.handlePropertyChange(subValuePos, value)}
              validation={value => {
                const validators: Validator<JsonValue>[] = []
                if (valuesValidation !== undefined) validators.push(valuesValidation)
                if (propertyValidationData?.value !== undefined) validators.push(propertyValidationData.value)
                return validateMany(value, ...validators)
              }} />
          </div>
        })}
        <button
          disabled={allowPropertyCreation === false || value.length >= (maxLength ?? Infinity)}
          onClick={this.handlePropertyCreation}>
          + Add
        </button>
      </div>
      <span>{']'}</span>
    </>
  }
}

// VALUE =================================================

type ValueEditorProps = {
  path?: JsonPath
  value: JsonValue
  onChange?: (value: JsonValue) => void
  validation?: Validator<JsonValue>
}

type ValueEditorState = {
  value: JsonValue
}

export class ValueEditor extends Component<ValueEditorProps, ValueEditorState> {
  state: ValueEditorState = { value: this.props.value }

  constructor (props: ValueEditorProps) {
    super(props)
    this.getValueType = this.getValueType.bind(this)
    this.handleTypeChange = this.handleTypeChange.bind(this)
    this.handleValueChange = this.handleValueChange.bind(this)
  }

  getValueType (val: JsonValue): TypeEditorProps['type'] {
    if (typeof val === 'string') return 'string'
    if (typeof val === 'number') return 'number'
    if (typeof val === 'boolean') return 'boolean'
    if (val === null) return 'null'
    if (Array.isArray(val)) return 'array'
    return 'object'
  }

  handleTypeChange (type: TypeEditorProps['type']) {
    if (this.getValueType(this.state.value) === type) return;
    this.setState(curr => {
      let newValue: JsonValue
      if (type === 'string') { newValue = '' }
      else if (type === 'number') { newValue = 0 }
      else if (type === 'boolean') { newValue = false }
      else if (type === 'null') { newValue = null }
      else if (type === 'object') { newValue = {} }
      else { newValue = [] }
      const newState = { ...curr, value: newValue }
      const { onChange, path } = this.props
      if (onChange === undefined) return newState
      const { value } = newState
      console.group(`Value - ${path?.join('/')} - handle type change`)
      console.log(value)
      onChange(value)
      console.groupEnd()
      return newState
    })
  }

  handleValueChange (value: JsonValue) {
    this.setState({ value })
    const { onChange, path } = this.props
    if (onChange === undefined) return;
    console.group(`Value - ${path?.join('/')} - handle value change`)
    console.log(value)
    onChange(value)
    console.groupEnd()
  }

  render () {
    const { path } = this.props
    const { value } = this.state
    const type = this.getValueType(value)
    return <>
      <TypeEditor
        path={path}
        type={type}
        onChange={this.handleTypeChange} />
      {type === 'string' && <StringValueEditor
        path={path}
        value={value as string}
        onChange={this.handleValueChange} />}
      {type === 'number' && <NumberValueEditor
        path={path}
        value={value as number}
        onChange={this.handleValueChange} />}
      {type === 'boolean' && <BooleanValueEditor
        path={path}
        value={value as boolean}
        onChange={this.handleValueChange} />}
      {type === 'null' && <NullValueEditor
        value={value as null}
        onChange={this.handleValueChange} />}
      {type === 'object' && <ObjectEditor
        path={path}
        value={value as { [key: string]: JsonValue }}
        onChange={this.handleValueChange} />}
      {type === 'array' && <ArrayEditor
        path={path}
        value={value as JsonValue[]}
        onChange={this.handleValueChange} />}
    </>
  }
}
