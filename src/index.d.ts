declare module '*.module.scss' {
  const content: { [className: string]: string }
  export = content
}

declare module '*.svg' {
  const content: string;
  export default content;
}

declare module 'prismjs/components/prism-pug' {
  const content: void
  export = content
}
