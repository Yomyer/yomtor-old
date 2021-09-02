import React, {
    ForwardRefRenderFunction,
    MutableRefObject,
    RefObject,
    useCallback,
    useContext,
    useEffect,
    useRef
} from 'react'
import { EditorContext } from '../components/Yomtor'
import paper from 'paper'
import { clearCursor, Cursor, setCursor } from './cursorUtils'
import { YomtorTheme } from '../styles/createTheme'
export type CustomControlProps = {
    group: RefObject<paper.Group>
    selector: paper.Selector
    onFrame?: (event?: any) => void
    onMouseDown?: (event?: any) => void
    onMouseDrag?: (event?: any) => void
    onMouseUp?: (event?: any) => void
    onClick?: (event?: any) => void
    onDoubleClick?: (event?: any) => void
    onMouseMove?: (event?: any) => void
    onMouseEnter?: (event?: any) => void
    onMouseLeave?: (event?: any) => void
}

type CreateCustomControlArgs = {
    corner?: paper.CornersName
    offset?: paper.Point | number
    cursor?: Cursor
    item?: (
        canvas: paper.PaperScope,
        group?: RefObject<paper.Group>,
        selector?: paper.Selector
    ) => paper.Item
    onFrame?: (event?: any) => void
    onMouseDown?: (event?: any) => void
    onMouseDrag?: (event?: any) => void
    onMouseUp?: (event?: any) => void
    onClick?: (event?: any) => void
    onDoubleClick?: (event?: any) => void
    onMouseMove?: (event?: any) => void
    onMouseEnter?: (event?: any) => void
    onMouseLeave?: (event?: any) => void
}

export const createCustomControlDefaultItem = (
    canvas: paper.PaperScope,
    theme: YomtorTheme
) => {
    return new canvas.Path.Rectangle({
        size: 7,
        fillColor: theme.palette.canvas.corners.background,
        strokeColor: theme.palette.canvas.corners.border,
        strokeWidth: 0.2
    })
}

export const createCustomControl = ({
    item,
    offset = new paper.Point(0, 0),
    corner = 'topLeft',
    cursor,
    onFrame = () => {},
    onMouseDown = () => {},
    onMouseDrag = () => {},
    onMouseUp = () => {},
    onClick = () => {},
    onDoubleClick = () => {},
    onMouseMove = () => {},
    onMouseEnter = () => {},
    onMouseLeave = () => {}
}: CreateCustomControlArgs): React.FC<CustomControlProps> => {
    const Component: ForwardRefRenderFunction<
        paper.Item,
        CustomControlProps
    > = (
        {
            selector,
            group,
            onFrame: frame,
            onMouseDown: mouseDown,
            onMouseDrag: mouseDrag,
            onMouseUp: mouseUp,
            onClick: click,
            onDoubleClick: doubleClick,
            onMouseMove: mouseMove,
            onMouseEnter: mouseEnter,
            onMouseLeave: mouseLeave
        },
        ref
    ) => {
        const { canvas, theme } = useContext(EditorContext)
        const rect = useRef<paper.Item>(null)
        const originalParams = useRef<any>(null)
        const oldScale = useRef<number>(1)

        const zoom = useCallback(
            (reset = false) => {
                if (!canvas || !rect.current) return

                if (!originalParams.current) {
                    originalParams.current = {
                        shadowBlur: rect.current.shadowBlur,
                        shadowOffset: rect.current.shadowOffset,
                        strokeWidth: rect.current.strokeWidth
                    }
                }

                rect.current.set({
                    shadowBlur:
                        originalParams.current.shadowBlur / canvas.view.zoom,
                    shadowOffset:
                        originalParams.current.shadowOffset / canvas.view.zoom,
                    strokeWidth:
                        originalParams.current.strokeWidth / canvas.view.zoom
                })

                rect.current.scale((reset && 1) || oldScale.current)
                rect.current.scale(1 / canvas.view.zoom)
                rect.current.data.isControl = true

                oldScale.current = canvas.view.zoom
            },
            [canvas]
        )

        useEffect(() => {
            if (!canvas) return

            canvas.view.on('zoom', () => zoom())
        }, [canvas])

        if (canvas && group) {
            if (selector && selector.points) {
                if (group.current && !rect.current) {
                    rect.current =
                        (item && item(canvas, group, selector)) ||
                        createCustomControlDefaultItem(canvas, theme)

                    rect.current.set({
                        guide: true,
                        shadowColor: 'rgba(0, 0, 0, 0.3)',
                        shadowBlur: 2,
                        shadowOffset: 1,
                        position: selector.points[corner].add(offset as any),
                        rotation: selector.angle,
                        strokeScaling: true
                    })

                    canvas.project.currentStyle.strokeScaling = true
                    rect.current.onFrame = frame || onFrame
                    rect.current.onMouseDown = mouseDown || onMouseDown
                    rect.current.onMouseDrag = mouseDrag || onMouseDrag
                    rect.current.onMouseUp = mouseUp || onMouseUp
                    rect.current.onClick = click || onClick
                    rect.current.onDoubleClick = doubleClick || onDoubleClick
                    rect.current.onMouseMove = mouseMove || onMouseMove

                    rect.current.data.corner = corner
                    rect.current.data.offset = offset

                    zoom(true)

                    rect.current.onMouseEnter = (e: paper.MouseEvent) => {
                        cursor && setCursor(cursor)

                        if (mouseEnter) {
                            mouseEnter(e)
                        } else {
                            onMouseEnter(e)
                        }
                    }
                    rect.current.onMouseLeave = (e: paper.MouseEvent) => {
                        cursor && clearCursor()

                        if (mouseLeave) {
                            mouseLeave(e)
                        } else {
                            onMouseLeave(e)
                        }
                    }

                    group.current.addChild(rect.current)
                } else if (rect.current) {
                    rect.current.set({
                        position: selector.points[corner].add(offset as any),
                        rotation: selector.angle - rect.current.angle
                    })

                    rect.current.bringToFront()
                }
            } else {
                rect.current = null
            }

            if (ref) {
                ;(ref as MutableRefObject<paper.Item>).current = rect.current
            }
        }
        return <></>
    }

    return React.memo(React.forwardRef(Component))
}
