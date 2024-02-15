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
    // Select option
    if (Array.isArray(validation)) return <select
      onChange={this.handleChange}
      ref={$n => { this.$root = $n }}>
      {validation.map((item, itemPos) => <option
        value={item}
        selected={itemPos === 0}>
        {item}
      </option>)}
    </select>
    // Free input
    return <input
      type='text'
      onInput={this.handleChange}
      defaultValue={this.props.value}
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
    // Select option
    if (Array.isArray(validation)) return <select
      onChange={this.handleChange}
      ref={$n => { this.$root = $n }}>
      {validation.map((item, itemPos) => <option
        value={item}
        selected={itemPos === 0}>
        {item}
      </option>)}
    </select>
    return <input
      type='number'
      onInput={this.handleChange}
      defaultValue={`${this.props.value}`}
      ref={$n => { this.$root = $n }} />
  }
}

// BOOLEAN VALUE ==========================================================

type BooleanValueEditorProps = {
  path?: JsonPath
  value: boolean
  onChange?: (val: boolean) => void
}

export class BooleanValueEditor extends Component<BooleanValueEditorProps> {
  constructor (props: BooleanValueEditorProps) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (e: Event) {
    const { onChange, path } = this.props
    if (onChange === undefined) return;
    const newValue = (e.target as HTMLInputElement).checked
    console.group(`BooleanValue - ${path?.join('/')} - handle change`)
    console.log(newValue)
    onChange(newValue)
    console.groupEnd()
  }

  render () {
    return <input
      type='checkbox'
      onChange={this.handleChange}
      defaultChecked={this.props.value} />
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
}

export class TypeEditor extends Component<TypeEditorProps> {
  constructor (props: TypeEditorProps) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (e: Event) {
    const { onChange, path } = this.props
    if (onChange === undefined) return;
    const newValue = (e.target as HTMLSelectElement).value as TypeEditorProps['type']
    console.group(`Type - ${path?.join('/')} - handle change`)
    console.log(newValue)
    onChange(newValue)
    console.groupEnd()
  }

  render () {
    const { type } = this.props
    return <select onChange={this.handleChange}>
      <option value='string' selected={type === 'string'}>string</option>
      <option value='number' selected={type === 'number'}>number</option>
      <option value='boolean' selected={type === 'boolean'}>boolean</option>
      <option value='null' selected={type === 'null'}>null</option>
      <option value='object' selected={type === 'object'}>object</option>
      <option value='array' selected={type === 'array'}>array</option>
    </select>
  }
}

// VALUE =================================================

type ValueEditorProps = {
  path?: JsonPath
  value: JsonValue
  onChange?: (value: JsonValue) => void
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
    this.setState(
      curr => {
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
      }
    )
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
      {type === 'array' && <ArrayEditor />}
    </>
  }
}

// KEY ==========================================================

type KeyEditorProps = {
  path?: JsonPath
  name: string
  onChange?: (val: string) => void
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
    const { name, path } = this.props
    return <StringValueEditor
      path={path}
      value={name}
      onChange={this.handleChange} />
  }
}

// PROPERTY ==========================================================

type PropertyEditorProps = {
  path?: JsonPath
  name: KeyEditorProps['name']
  value: ValueEditorProps['value']
  onChange?: (name: PropertyEditorProps['name'], value: PropertyEditorProps['value']) => void
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
    const { name, value, path } = this.props
    return <>
      <KeyEditor path={path} name={name} onChange={this.handleKeyChange} />
      <ValueEditor path={path} value={value} onChange={this.handleValueChange} />
    </>
  }
}

// OBJECT =================================================
type ObjectEditorProps = {
  path?: JsonPath
  value: { [key: string]: JsonValue }
  onChange?: (value: ObjectEditorProps['value']) => void
}

type ObjectEditorState = {
  value: ObjectEditorProps['value']
}

export class ObjectEditor extends Component<ObjectEditorProps, ObjectEditorState> {
  state: ObjectEditorState = { value: this.props.value }
  constructor (props: ObjectEditorProps) {
    super(props)
    this.handlePropertyChange = this.handlePropertyChange.bind(this)
    this.handlePropertyDeletion = this.handlePropertyDeletion.bind(this)
    this.handlePropertyCreation = this.handlePropertyCreation.bind(this)
  }

  handlePropertyChange (prevName: string, newName: string, value: JsonValue) {
    this.setState(
      curr => {
        let newValue: { [key: string]: JsonValue } = { ...curr.value, [newName]: value }
        if (prevName !== newName) { delete newValue[prevName] }        
        const { onChange, path } = this.props
        if (onChange === undefined) return { ...curr, value: newValue }
        console.group(`Object - ${path?.join('/')} - handle property change`)
        console.log(newValue)
        onChange(newValue)
        console.groupEnd()
        return { ...curr, value: newValue }
      }
    )
  }

  handlePropertyDeletion (key: string) {
    this.setState(
      curr => {
        const newValue = { ...curr.value }
        delete newValue[key]
        const { onChange, path } = this.props
        if (onChange === undefined) return { ...curr, value: newValue }
        console.group(`Object - ${path?.join('/')} - handle property deletion`)
        console.log(newValue)
        onChange(newValue)
        console.groupEnd()
        return { ...curr, value: newValue }
      }
    )
  }

  handlePropertyCreation () {
    this.setState(
      curr => {
        const newValue = { ...curr.value, [`${Math.random().toString(36).slice(2, 6)}`]: '' }
        const { onChange, path } = this.props
        if (onChange === undefined) return { ...curr, value: newValue }
        console.group(`Object - ${path?.join('/')} - handle property creation`)
        console.log(newValue)
        onChange(newValue)
        console.groupEnd()
        return { ...curr, value: newValue }
      }
    )
  }

  render () {
    const { path } = this.props
    const { value } = this.state
    return <>
      <span>{'{'}</span>
      <div style={{ paddingLeft: 40 }}>
        {Object.entries(value).map(([key, value]) => {
          return <div>
            <button onClick={() => this.handlePropertyDeletion(key)}>x</button>
            <PropertyEditor
              path={[...(path ?? []), key]}
              name={key}
              value={value}
              onChange={(name, value) => this.handlePropertyChange(key, name, value)} />
          </div>
        })}
        <button onClick={this.handlePropertyCreation}>+ Add</button>
      </div>
      <span>{'}'}</span>
    </>
  }
}

// ARRAY =================================================
type ArrayEditorProps = {}
export class ArrayEditor extends Component<ArrayEditorProps> {
  render () {
    return <></>
  }
}
