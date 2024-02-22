import { render, Component } from 'preact'
import App from 'providers/App'

import { isObject, Json, makeValidationSuccess, makeValidationFailure, Scheme, ValueEditor } from 'components/JsonEditor/index2'

const scheme: Scheme.Scheme = {
  fallback: { prop: true },
  string: {
    // rule: ['hey', 'ho', 'lets go!'],
    rule: (val: string) => val.startsWith('c')
      ? makeValidationSuccess(val, val)
      : makeValidationFailure('c...', val, 'must start with c'),
    fallback: 'clets go!'
  },
  number: {
    rule: [77],
    fallback: 77
  },
  boolean: {
    rule: [true],
    fallback: true
  },
  array: {
    values: [{
      optional: false,
      scheme: { fallback: 'obligé', string: true }
    }, {
      optional: true,
      scheme: { fallback: 'optionnel', string: true }
    }],
    fallback: ['obligé']
  },
  object: {
    properties: {
      prop: { optional: true },
      prop2: { optional: true },
      prop3: { optional: true }
    }
  }
}

const input = { prop: true, prop2: 'coucou' }

class MyApp extends Component {
  state: { value: any } = { value: input }
  constructor(props: {}) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }
  handleChange (value: any) {
    console.log(value)
    this.setState({ value })
  }
  render () {
    return <>
      <style>{`
        .object-value-editor__properties,
        .array-value-editor__properties {
          padding-left: 40px;
        }
      `}</style>
      <ValueEditor
        value={this.state.value}
        scheme={scheme}
        onChange={this.handleChange}
        path={[]} />
    </>
  }
}

const target = document.querySelector('.root')
// if (target !== null) render(<App/>, target)
if (target !== null) render(<MyApp />, target)
