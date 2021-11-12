import React, { useState, useCallback, useEffect, useContext } from 'react'
import EditorContext from '../EditorContext'
import Cursors, { CursorType } from './Cursors'

type Props = {
    action: CursorType
    rotation: number
    subAction?: CursorType
    global?: boolean
    clear?: boolean
}

const CursorController: React.FC<Props> = ({
    action,
    subAction,
    rotation,
    global,
    clear
}) => {
    const { canvas } = useContext(EditorContext)
    const [className, setClassName] = useState<string>('')
    const [styles, setStyles] = useState<{ [key: string]: HTMLStyleElement }>(
        {}
    )

    useEffect(() => {
        if (!Cursors[action]) {
            return
        }

        async function setClass() {
            const name = btoa(action + subAction + rotation)
                .toLowerCase()
                .replace(/=/g, '')

            if (!styles[name]) {
                styles[name] = await generateStyleTag(name)
                setStyles(styles)
            }

            setClassName(`_${name}`)
        }

        setClass()
    }, [action, subAction, rotation])

    useEffect(() => {
        if (className) {
            if (global) {
                document.body.classList[clear ? 'remove' : 'add'](className)
            } else {
                canvas.view.element.classList[clear ? 'remove' : 'add'](
                    className
                )
            }
        }
    }, [className, global, clear])

    const toBase64PNG = useCallback(
        (svg: SVGElement): Promise<string> => {
            return new Promise((resolve, reject) => {
                const canvas = document.createElement(
                    'canvas'
                ) as HTMLCanvasElement
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
        },
        [action, subAction, rotation]
    )

    const toBase64SVG = useCallback(
        (svg: SVGElement) => {
            return `data:image/svg+xml;base64,${toBase64(
                new XMLSerializer().serializeToString(svg)
            )}`
        },
        [action, subAction, rotation]
    )

    const toBase64 = useCallback(
        (string: string) => {
            return window.btoa(string)
        },
        [action, subAction, rotation]
    )

    const createNode = useCallback(
        (tag: string, values?: { [key: string]: string }) => {
            const node = document.createElementNS(
                'http://www.w3.org/2000/svg',
                tag
            )
            for (const key in values)
                node.setAttributeNS(null, key, values[key])
            return node
        },
        [action, subAction, rotation]
    )

    const generateShadow = useCallback((): SVGElement => {
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
    }, [action, subAction, rotation])

    const generateSVGCursor = useCallback(
        (scale = 1): SVGElement => {
            const cursorData = Cursors[action].props
            const subCursorData = Cursors[subAction] && Cursors[subAction].props

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
        },
        [action, subAction, rotation]
    )

    const generateStyle = useCallback(
        async (name) => {
            const data = { x: '4', y: '4', ...Cursors[action].props }
            const svg64 = toBase64SVG(generateSVGCursor(0.5))
            const png64 = await toBase64PNG(generateSVGCursor())

            return `body._${name} *, ._${name}{
            cursor: url(${png64})${data.x} ${data.y},auto !important;
            cursor: url(${svg64})${data.x} ${data.y},auto !important;
            cursor: -webkit-image-set(url(${png64})2x,url(${png64})1x)${data.x} ${data.y},auto !important;`
        },
        [action, subAction, rotation]
    )

    const generateStyleTag = useCallback(
        async (name: string): Promise<HTMLStyleElement> => {
            const head =
                document.head || document.getElementsByTagName('head')[0]
            const style = document.createElement('style') as HTMLStyleElement
            style.setAttribute('cursor', name)
            style.appendChild(
                document.createTextNode(await generateStyle(name))
            )

            head.appendChild(style)

            return style
        },
        [action, subAction, rotation]
    )

    return <></>
}

CursorController.defaultProps = {
    action: 'default',
    subAction: null,
    rotation: 0,
    global: false
}

export default CursorController
