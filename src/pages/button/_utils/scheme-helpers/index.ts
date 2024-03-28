import { Scheme } from 'components/JsonEditor'

export const handlersScheme: Scheme.Scheme = {
  fallback: [],
  array: {
    values: new Array(100).fill(null).map(() => ({
      optional: true,
      scheme: { fallback: '', string: true }
    }))
  }
}
