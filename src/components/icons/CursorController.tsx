import React, { useState, useEffect, useContext } from 'react'
import EditorContext from '../EditorContext'
import Cursor from './Cursor'
import Default from './cursor/Default'

type Props = {
    cursor: {
        action: Cursor | Cursor[]
        rotation: number
        subAction?: Cursor
        global?: boolean
        clear?: boolean
    }
}

const CursorController: React.FC<Props> = ({ cursor }) => {
    const { action, subAction, rotation, global, clear } = cursor
    const { canvas } = useContext(EditorContext)
    const [styles, setStyles] = useState<{ [key: string]: HTMLStyleElement }>(
        {}
    )

    useEffect(() => {
        if (!canvas) {
            return
        }

        function clearAll(classList: DOMTokenList, find: string) {
            classList.forEach((c: string) => {
                try {
                    if (c.startsWith(find)) {
                        classList.remove(c)
                    }
                } catch (error) {}
            })
        }

        async function setClass(cursor: Cursor, all?: boolean) {
            const name =
                cursor.id +
                ((subAction && subAction.id) || '') +
                (rotation || '')

            if (global) {
                clear && all
                    ? clearAll(document.body.classList, cursor.id)
                    : document.body.classList[clear ? 'remove' : 'add'](name)
            } else {
                clear && all
                    ? clearAll(canvas.view.element.classList, cursor.id)
                    : canvas.view.element.classList[clear ? 'remove' : 'add'](
                          name
                      )
            }

            if (!styles[name] && !clear) {
                console.log('???')
                const tag = await generateStyleTag(name, cursor)
                if (tag) {
                    styles[name] = tag
                    setStyles(styles)
                }
            }
        }

        action instanceof Array
            ? action.forEach((a) => setClass(a, true))
            : setClass(action)
    }, [action, subAction, rotation, global, clear])

    /*
    const toBase64PNG = (svg: SVGElement): Promise<string> => {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas') as HTMLCanvasElement
            canvas.width = 64
            canvas.height = 64

            const DOMURL = self.URL || self.webkitURL
            const ctx = canvas.getContext('2d')
            const string = new XMLSerializer().serializeToString(svg)
            const img = new Image()
            const blob = new Blob([string], {
                type: 'image/svg+xml;charset=utf-8'
            })
            const url = DOMURL.createObjectURL(blob)

            img.onload = function () {
                ctx.drawImage(img, 0, 0)
                const png = canvas.toDataURL('image/png')

                resolve(png)
                DOMURL.revokeObjectURL(png)
            }
            img.onerror = function (error) {
                reject(error)
            }

            img.src = url
        })
    }
    */

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

    const generateSVGCursor = (cursorData: Cursor, scale = 1): SVGElement => {
        const subCursorData = subAction

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
            transform: `rotate(${rotation})`,
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

    const generateStyle = async (className: string, cursor: Cursor) => {
        const data = { x: '4', y: '4', ...cursor }
        const svg64 = toBase64SVG(generateSVGCursor(cursor, 0.5))
        const png64 = toBase64SVG(generateSVGCursor(cursor))

        return `body.${className} *, .${className}{
            cursor: url(${png64})${data.x} ${data.y},auto !important;
            cursor: url(${svg64})${data.x} ${data.y},auto !important;
            cursor: -webkit-image-set(url(${png64})2x,url(${png64})1x)${data.x} ${data.y},auto !important;`
    }

    const generateStyleTag = async (
        name: string,
        cursor: Cursor
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
    return <></>
}

CursorController.defaultProps = {
    cursor: { action: Default, subAction: null, rotation: 0, global: false }
}

export default CursorController
