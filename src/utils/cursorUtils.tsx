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

export const setGlobalCursor = (cursor?: Cursor) => {
    if (!document.querySelector('.global-cursor-' + name)) {
        const div = document.createElement('div')
        div.style.cssText =
            'position:fixed; z-index:5000; left:0; top:0; right: 0; bottom:0;'

        if (cursor && cursor.cursor1x) {
            div.style.cssText += createRetinaCursor(cursor)
        } else {
            div.style.cssText += `cursor: ${cursor.name}`
        }

        if (cursor) div.className = 'global-cursor global-cursor-' + cursor.name
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

export const setCursor = (cursor?: Cursor) => {
    if (cursor && cursor.cursor1x) {
        document.body.style.cssText += createRetinaCursor(cursor)
    } else {
        document.body.style.cssText += `cursor: ${cursor.name}`
    }
}

export const clearCursor = () => {
    document.body.style.cursor = null
}
