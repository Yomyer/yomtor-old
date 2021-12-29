import { PaperScope } from '@yomyer/paper'

export type Cursor = {
    id: string
    d: string
    fill?: string
    x?: string
    y?: string
    stroke?: string
}

type Props = {
    action?: Cursor
    rotation: number
    subAction?: Cursor
    global?: boolean
    clear?: boolean
}

const styles: { [key: string]: HTMLStyleElement } = {}
let cursorPaperScope: PaperScope

export const cursorWithScope = (paperScope: PaperScope) => {
    cursorPaperScope = paperScope
}

export const setCursor = (
    action: Cursor,
    rotation?: number,
    subAction?: Cursor
) => {
    setAction({ action, rotation, subAction, global: false, clear: false })
}

export const setGlobalCursor = (
    action: Cursor,
    rotation?: number,
    subAction?: Cursor
) => {
    setAction({ action, rotation, subAction, global: true, clear: false })
}

export const clearCursor = (
    actions: Cursor | Cursor[],
    rotation?: number,
    subAction?: Cursor
) => {
    setAction({ actions, rotation, subAction, global: false, clear: true })
}

export const clearGlobalCursor = (
    actions: Cursor | Cursor[],
    rotation?: number,
    subAction?: Cursor
) => {
    setAction({ actions, rotation, subAction, global: true, clear: true })
}

const setAction = ({
    action,
    actions,
    ...cursor
}: Props & { actions?: Cursor | Cursor[] }): void => {
    actions instanceof Array
        ? actions.forEach((a) => setClass({ action: a, ...cursor }, true))
        : setClass({ action: action || actions, ...cursor })
}

async function setClass(
    { action, subAction, rotation, clear, global }: Props,
    all?: boolean
) {
    const name =
        action.id + ((subAction && subAction.id) || '') + (rotation || '')

    if (global) {
        clear && all
            ? clearAll(document.body.classList, action.id)
            : document.body.classList[clear ? 'remove' : 'add'](name)
    } else {
        clear && all
            ? clearAll(cursorPaperScope.view.element.classList, action.id)
            : cursorPaperScope.view.element.classList[clear ? 'remove' : 'add'](
                  name
              )
    }

    if (!styles[name] && !clear) {
        const tag = await generateStyleTag(name, {
            action,
            subAction,
            rotation
        })
        if (tag) {
            styles[name] = tag
        }
    }
}

const clearAll = (classList: DOMTokenList, find: string) => {
    classList.forEach((c: string) => {
        try {
            if (c.startsWith(find)) {
                classList.remove(c)
            }
        } catch (error) {}
    })
}

const toBase64SVG = (svg: SVGElement) => {
    return `data:image/svg+xml;base64,${toBase64(
        new XMLSerializer().serializeToString(svg)
    )}`
}

const toBase64 = (string: string) => {
    return window.btoa(string)
}
const createNode = (tag: string, values?: { [key: string]: string }) => {
    const node = document.createElementNS('http://www.w3.org/2000/svg', tag)
    for (const key in values) node.setAttributeNS(null, key, values[key])
    return node
}

const generateShadow = (): SVGElement => {
    const filter = createNode('filter', {
        id: 'shadow',
        height: '200%',
        width: '200%',
        x: '-50.9%',
        y: '-41.4%'
    })
    filter.appendChild(
        createNode('feGaussianBlur', {
            stdDeviation: '2',
            in: 'SourceAlpha'
        })
    )
    filter.appendChild(
        createNode('feOffset', { dy: '2', result: 'offsetblur' })
    )
    const transfer = createNode('feComponentTransfer')
    transfer.appendChild(
        createNode('feFuncA', { type: 'linear', slope: '0.5' })
    )
    filter.appendChild(transfer)

    const merge = createNode('feMerge')
    merge.appendChild(createNode('feMergeNode'))
    merge.appendChild(createNode('feMergeNode', { in: 'SourceGraphic' }))

    filter.appendChild(merge)

    return filter
}

const generateSVGCursor = (
    { action: cursorData, subAction: subCursorData, rotation }: Props,
    scale = 1
): SVGElement => {
    const svg = createNode('svg', {
        width: `64px`,
        height: '64px'
    })
    svg.appendChild(generateShadow())

    const g = createNode('g', {
        transform: `scale(${scale})`,
        style: 'filter:url(#shadow)'
    })

    if (subCursorData) {
        const subCrusor = createNode('g', {
            'transform-origin': 'center',
            stroke: 'none',
            'stroke-width': '1',
            fill: 'none',
            'fill-rule': 'evenodd',
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round'
        })
        subCrusor.appendChild(
            createNode('path', {
                ...subCursorData,
                'stroke-width': '2'
            })
        )
        g.appendChild(subCrusor)
    }

    const cursor = createNode('g', {
        transform: `rotate(${rotation || 0})`,
        'transform-origin': 'center',
        stroke: 'none',
        'stroke-width': '1',
        fill: 'none',
        'fill-rule': 'evenodd',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
    })
    cursor.appendChild(
        createNode('path', { ...cursorData, 'stroke-width': '2' })
    )
    g.appendChild(cursor)

    svg.appendChild(g)

    return svg
}

const generateStyle = async (className: string, cursor: Props) => {
    const data = { x: '4', y: '4', ...cursor.action }
    const svg64 = toBase64SVG(generateSVGCursor(cursor, 0.5))
    const png64 = toBase64SVG(generateSVGCursor(cursor))

    return `body.${className} *, .${className}{
        cursor: url(${png64})${data.x} ${data.y},auto !important;
        cursor: url(${svg64})${data.x} ${data.y},auto !important;
        cursor: -webkit-image-set(url(${png64})2x,url(${png64})1x)${data.x} ${data.y},auto !important;`
}

const generateStyleTag = async (
    name: string,
    cursor: Props
): Promise<HTMLStyleElement> => {
    if (document.querySelector(`style[cursor="${name}"]`)) {
        return null
    }

    const head = document.head || document.getElementsByTagName('head')[0]
    const style = document.createElement('style') as HTMLStyleElement
    style.setAttribute('cursor', name)
    style.appendChild(
        document.createTextNode(await generateStyle(name, cursor))
    )

    head.appendChild(style)

    return style
}

export default Cursor
