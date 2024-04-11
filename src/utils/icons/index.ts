const pageUrl = new URL(window.location.href)

export namespace Icons {
  export function getUrlFromName (iconName: string) {
    return new URL(`/icons/assets/${iconName}.svg`, pageUrl)
  }
}
