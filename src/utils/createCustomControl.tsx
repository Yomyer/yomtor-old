import React, {
    ForwardRefRenderFunction,
    MutableRefObject,
    RefObject,
    useContext,
    useRef
} from 'react'
import { EditorContext } from '../components/Yomtor'
import paper from 'paper'
import { clearCursor, Cursor, setCursor } from './cursorUtils'
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

export const createCustomControlDefaultItem = (canvas: paper.PaperScope) => {
    return new canvas.Path.Rectangle({
        size: 7,
        fillColor: 'white',
        strokeColor: 'rgba(0, 0, 0, 0.7)',
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
        const { canvas } = useContext(EditorContext)
        const rect = useRef<paper.Item>(null)

        if (canvas && group) {
            if (selector && selector.points) {
                if (group.current && !rect.current) {
                    rect.current =
                        (item && item(canvas, group, selector)) ||
                        createCustomControlDefaultItem(canvas)

                    rect.current.set({
                        guide: true,
                        shadowColor: 'rgba(0, 0, 0, 0.3)',
                        shadowBlur: 2,
                        shadowOffset: 1,
                        position: selector.points[corner].add(offset as any),
                        rotation: selector.angle
                    })

                    rect.current.onFrame = frame || onFrame
                    rect.current.onMouseDown = mouseDown || onMouseDown
                    rect.current.onMouseDrag = mouseDrag || onMouseDrag
                    rect.current.onMouseUp = mouseUp || onMouseUp
                    rect.current.onClick = click || onClick
                    rect.current.onDoubleClick = doubleClick || onDoubleClick
                    rect.current.onMouseMove = mouseMove || onMouseMove

                    rect.current.data.corner = corner
                    rect.current.data.offset = offset

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
                    rect.current.position = selector.points[corner].add(
                        offset as any
                    )
                    rect.current.rotation = selector.angle - rect.current.angle

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
