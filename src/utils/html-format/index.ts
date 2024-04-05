export default function htmlFormat (htmlString: string): string {
  const fakeDiv = document.createElement('div')
  fakeDiv.innerHTML = htmlString
  const output = [...fakeDiv.childNodes]
    .map(child => formatNode(child, 0))
    // .filter(content => content !== '')
    .join('\n')
  return output
}

function formatNode (node: Node, indentationDepth: number = 0): string {
  const spaces = (' ').repeat(2 * indentationDepth)
  if (node.nodeType === Node.TEXT_NODE) {
    const { textContent } = node
    if (textContent === null || textContent.trim() === '') return ''
    return `${spaces}${textContent.trim()}`
  }
  if (node.nodeType === Node.ELEMENT_NODE) {
    const clone = node.cloneNode() as Element
    const outerHTML = clone.outerHTML
    let openingTag = ''
    let closingTag = ''
    if (outerHTML.endsWith('/>')) {
      openingTag = outerHTML
      closingTag = ''
    } else {
      const tagName = clone.tagName.toLowerCase()
      const endOfOpeningTagIndex = outerHTML.indexOf('>') + 1
      openingTag = outerHTML.substring(0, endOfOpeningTagIndex)
      closingTag = `</${tagName}>`
    }
    const element = node as Element
    const children = [...element.childNodes]
    const firstChild = children.at(0)
    if (children.length === 0) return `${spaces}${openingTag}${closingTag}`
    if (children.length === 1
      && firstChild !== undefined
      && firstChild.nodeType === Node.TEXT_NODE) {
      return `${spaces}${openingTag}${formatNode(firstChild, 0)}${closingTag}`
    }
    return [
      `${spaces}${openingTag}`,
      ...children
        .map(child => formatNode(child, indentationDepth + 1))
        .filter(e => e.trim() !== ''),
      `${spaces}${closingTag}`
    ].join('\n')
  }
  if (node.nodeType === Node.COMMENT_NODE) {
    const comment = node as Comment
    const { textContent } = comment
    if (textContent === null) return ''
    return `${spaces}<!-- ${textContent.trim()} -->`
  }
  return ''
}
