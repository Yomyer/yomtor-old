export type Cursor = {
    name: string
    cursor1x?: string
    cursor2x?: string
    offset?: { x: number; y: number }
    keyword?: string
}

const createRetinaCursor = ({
    cursor1x,
    cursor2x,
    offset,
    keyword = 'auto'
}: Cursor): string => {
    const cssText = []

    cssText.push(`cursor: url(${cursor1x})`)
    if (offset) cssText.push(` ${offset.x} ${offset.y}`)
    cssText.push(`, ${keyword}`)

    if (cursor2x) {
        cssText.push(';')
        cssText.push(
            `cursor: -webkit-image-set(url(${cursor1x}) 1x,url(${cursor2x}) 2x)`
        )
        if (offset) cssText.push(` ${offset.x} ${offset.y}`)
        cssText.push(`, ${keyword}`)
    }

    return cssText.join('')
}

export const setGlobalCursor = (cursor: Cursor) => {
    const name = `global-cursor-${cursor.name}`

    if (!document.querySelector(`.${name}`)) {
        const div = document.createElement('div')
        div.style.cssText =
            'position:fixed; z-index:5000; left:0; top:0; right: 0; bottom:0;'

        if (cursor.cursor1x) {
            div.style.cssText += createRetinaCursor(cursor)
        } else {
            div.style.cssText += `cursor: ${cursor.keyword}`
        }

        div.className = `global-cursor ${name}`

        document.body.append(div)
    }
}

export const clearGlobalCursor = (cursor?: Cursor) => {
    if (cursor && cursor.name) {
        document.body.querySelector('.global-cursor-' + cursor.name)?.remove()
    } else {
        document.body.querySelector('.global-cursor')?.remove()
    }
}

export const setCursor = (cursor?: Cursor, element?: HTMLElement) => {
    element = element || document.body

    if (cursor && cursor.cursor1x) {
        element.style.cssText += createRetinaCursor(cursor)
    } else {
        element.style.cssText += `cursor: ${cursor.name}`
    }
}

export const clearCursor = (element?: HTMLElement) => {
    element = (element instanceof HTMLElement && element) || document.body

    element.style.cursor = null
}
