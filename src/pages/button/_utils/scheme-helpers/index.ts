import { Scheme, makeValidationSuccess } from 'components/JsonEditor'

export const handlersScheme: Scheme.Scheme = {
  fallback: [],
  array: {
    values: new Array(100).fill(null).map(() => ({
      optional: true,
      scheme: {
        fallback: '',
        string: {
          rule: str => {
            const validated = str
              .trim()
              .replace(/[^\w]/g, '')
              .replace(/^\d+/g, '')
            return makeValidationSuccess(validated, str)
          }
        },
      }
    }))
  }
}
