declare module '*.module.scss' {
  const content: { [className: string]: string }
  export = content
}

declare module 'https://assets-decodeurs.lemonde.fr/design-edito/v1.beta/shared/index.js?idle' {
  export default any
}

declare module 'http://localhost:3000/shared/index.js?idle' {
  export default any
}
