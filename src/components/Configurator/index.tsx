import { Component } from 'preact'

// Select

type SelectInputProps = {
  name: string
  options: Array<{
    label: string
    value: string
  }>
  valueListener?: (value?: string) => void
}

class SelectInput extends Component<SelectInputProps> {
  constructor (props: SelectInputProps) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount(): void {
    const { valueListener, options } = this.props
    if (valueListener === undefined) return;
    const firstValue = options.at(0)?.value
    valueListener(firstValue)
  }

  handleChange (event: Event) {
    const { valueListener } = this.props
    if (valueListener === undefined) return;
    const value = (event.target as HTMLSelectElement).value
    valueListener(value)
  }

  render () {
    const { name, options } = this.props
    return <div>
      <span>{name}</span>
      <select onChange={this.handleChange}>
        {options.map(({ label, value }, pos) => {
          return <option value={value} selected={pos === 0}>
            {label}
          </option>
        })}
      </select>
    </div>
  }
}

// Boolean

type BooleanInputProps = {
  name: string
  valueListener?: (value?: boolean) => void
}

class BooleanInput extends Component<BooleanInputProps> {
  constructor (props: BooleanInputProps) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount(): void {
    const { valueListener } = this.props
    if (valueListener === undefined) return;
    valueListener(false)
  }

  handleChange (event: Event) {
    const { valueListener } = this.props
    if (valueListener === undefined) return;
    const value = (event.target as HTMLInputElement).checked
    valueListener(value)
  }

  render () {
    const { name } = this.props
    return <div>
      <span>{name}</span>
      <input type='checkbox' onChange={this.handleChange}></input>
    </div>
  }
}

type ConfiguratorSelectProp = SelectInputProps & { type: 'select' }
type ConfiguratorBooleanProp = BooleanInputProps & { type: 'boolean' }
type ConfiguratorPrimitiveProp = ConfiguratorSelectProp | ConfiguratorBooleanProp
type ConfiguratorProp = ConfiguratorPrimitiveProp

// Configurator

type ConfiguratorProps = {
  name: string
  options: Array<ConfiguratorProp>
  valueListener?: (value?: any) => void
}

type ConfiguratorState = { value: any }

export default class Configurator extends Component<ConfiguratorProps, ConfiguratorState> {
  state: ConfiguratorState = { value: {} }
  constructor (props: ConfiguratorProps) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount(): void {
    const { valueListener } = this.props
    if (valueListener === undefined) return;
    valueListener(this.state.value)
  }

  handleChange (field: string, val: any) {
    const stateSetter = (curr: ConfiguratorState) => ({
      ...curr,
      value: { ...curr.value, [field]: val }
    })
    const callback = () => {
      const { valueListener } = this.props
      if (valueListener === undefined) return;
      valueListener(this.state.value)
    }
    this.setState(stateSetter, callback)
  }

  render () {
    const { options, name } = this.props
    return <div>
      <span>{name}</span>
      <div style={{ paddingLeft: '16px' }}>
        {options.map(option => {
          if (option.type === 'select') return <SelectInput
            name={option.name}
            options={option.options}
            valueListener={v => this.handleChange(option.name, v)} />
          if (option.type === 'boolean') return <BooleanInput
            name={option.name}
            valueListener={v => this.handleChange(option.name, v)} />
          else return <></>
        })}
      </div>
    </div>
  }
}
