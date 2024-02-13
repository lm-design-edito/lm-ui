export default function getBrowserDefaultScrollbarWidth () {
  const container = document.createElement('div')
  container.style.visibility = 'hidden'
  container.style.overflow = 'scroll'
  document.body.appendChild(container)
  const inner = document.createElement('div')
  container.appendChild(inner)
  const scrollbarWidth = container.offsetWidth - inner.offsetWidth
  document.body.removeChild(container)
  return scrollbarWidth
}
