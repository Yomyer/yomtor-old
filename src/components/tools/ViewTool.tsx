import React, {
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState
} from 'react'
import EditorContext from '../EditorContext'
import { HotKeysEvent, useHotkeys } from '../../uses/useHokeys'
import { useEventListener } from '../../uses/useEventListener'
import {
    MouseEvent,
    Point,
    Rectangle,
    Tool,
    ToolEvent,
    Grid
} from '@yomyer/paper'
import Grabbing from '../icons/cursor/Grabbing'
import Grab from '../icons/cursor/Grab'

type Props = {
    factor?: number
    pixelGrid?: boolean
}

const ViewTool: React.FC<Props> = ({ children, factor, pixelGrid }) => {
    const {
        canvas,
        setGlobalCursor,
        setCursor,
        clearCursor,
        clearGlobalCursor
    } = useContext(EditorContext)
    const [tool, setTool] = useState<Tool>()
    const offset = useRef<Point>()
    const scrollDragDirection = useRef<Point>()
    const dragEvent = useRef<ToolEvent>()
    const downPoint = useRef<Point>()

    const wheelMove = useCallback(
        (e: WheelEvent) => {
            if (tool && tool.mainActived) {
                const point = new canvas.Point(e.deltaX, e.deltaY).divide(
                    factor
                )

                canvas.view.center = canvas.view.center.add(
                    point.divide(canvas.view.zoom)
                )
            }
        },
        [tool]
    )

    const arrowMove = useCallback(
        (e: HotKeysEvent) => {
            if (
                tool &&
                tool.mainActived &&
                !canvas.project.activeItems.length
            ) {
                const point = e.delta
                    .multiply((e.isPressed('shift') && 10) || 1)
                    .multiply(-factor)

                canvas.view.center = canvas.view.center.add(
                    point.divide(canvas.view.zoom)
                )
            }
        },
        [tool]
    )

    useEffect(() => {
        if (!canvas) return
        setTool(canvas.createTool('View'))

        if (pixelGrid) {
            canvas.project.grid = new Grid({ actived: true })
        }

        canvas.view.on('mousemove', (e: MouseEvent) => {
            offset.current = e.point
        })

        canvas.view.on('mousedrag', (e: MouseEvent) => {
            const rect = new Rectangle(
                new Point(0, 0),
                canvas.view.viewSize
            ).expand(-5)

            const point = canvas.view.projectToView(e.point)
            const inside = rect.contains(point)

            dragEvent.current = (e as unknown) as ToolEvent
            dragEvent.current.downPoint = downPoint.current

            scrollDragDirection.current = null

            if (!inside) {
                scrollDragDirection.current = new Point(
                    point.x < rect.x ? -1 : point.x > rect.width ? 1 : 0,
                    point.y < rect.y ? -1 : point.y > rect.height ? 1 : 0
                )

                canvas.view.center = canvas.view.center.add(
                    scrollDragDirection.current
                        .multiply(factor)
                        .divide(canvas.view.zoom)
                )
            }
        })

        canvas.view.on('mouseup', () => {
            scrollDragDirection.current = null
        })

        canvas.view.on('mousedown', (e: ToolEvent) => {
            downPoint.current = e.point
        })

        canvas.view.on('frame', (e: any) => {
            if (!(e.count % 1)) {
                setTimeout(() => {
                    if (scrollDragDirection.current) {
                        const delta = scrollDragDirection.current
                            .multiply(factor)
                            .divide(canvas.view.zoom)
                        const point = dragEvent.current.point.add(delta)

                        dragEvent.current.point = point
                        dragEvent.current.delta = delta

                        canvas.project.removeOn('mousedrag')

                        canvas.view.emit('mousedrag', dragEvent.current)

                        canvas.view.handleMouseEvent(
                            'mousedrag',
                            dragEvent.current,
                            point
                        )
                    }
                })
            }
        })
    }, [canvas])

    useEffect(() => {
        if (!tool) return

        tool.onMouseDown = () => {
            setGlobalCursor(Grabbing)
        }

        tool.onMouseDrag = (e: ToolEvent) => {
            const offset = e.downPoint.subtract(e.point)
            canvas.view.center = canvas.view.center.add(offset)
        }

        tool.onMouseUp = () => {
            clearGlobalCursor(Grabbing)
        }
    }, [tool])

    useHotkeys(
        'space',
        () => {
            if (tool && tool.mainActived) {
                setCursor(Grab)
                tool.activate()
            }
            return false
        },
        () => {
            if (tool && tool.actived) {
                clearGlobalCursor(Grabbing)
                clearCursor(Grab)
                tool.activeMain()
            }
            return false
        },
        [tool]
    )

    useHotkeys(
        'arrows,shift+arrows',
        (_, e: HotKeysEvent) => {
            arrowMove(e)
        },
        [tool]
    )

    useEventListener(
        'wheel',
        (e: WheelEvent) => {
            wheelMove(e)
        },
        canvas && canvas.view.element
    )

    return <>{children}</>
}

ViewTool.defaultProps = {
    factor: 5,
    pixelGrid: true
}

export default ViewTool
