import React, {
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState
} from 'react'
import { EditorContext } from '../Yomtor'
import { HotKeysEvent, useHotkeys } from '../../uses/useHokeys'
import { setGlobalCursor } from '../../utils'
import { useEventListener } from '../../uses/useEventListener'
import { Grab } from '../icons/cursor'
import {
    clearCursor,
    clearGlobalCursor,
    setCursor
} from '../../utils/cursorUtils'
import { Grabbing } from '../icons/cursor/Grabbing'
import { MouseEvent, Point, Tool, ToolEvent } from '@yomyer/paper'

const ViewTool: React.FC = ({ children }) => {
    const { canvas } = useContext(EditorContext)
    const [tool, setTool] = useState<Tool>()
    const downPoint = useRef<Point>()
    const offset = useRef<Point>()

    const wheelMove = useCallback(
        (e: WheelEvent) => {
            if (tool && tool.isMain) {
                const point = new canvas.Point(e.deltaX, e.deltaY).divide(2)

                canvas.view.center = canvas.view.center.add(
                    point.divide(canvas.view.zoom)
                )
            }
        },
        [tool]
    )

    const arrowMove = useCallback(
        (e: HotKeysEvent) => {
            if (tool && tool.isMain && !canvas.project.activeItems.length) {
                const point = e.delta
                    .multiply((e.isPressed('shift') && 10) || 1)
                    .multiply(-5)

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
    }, [canvas])

    useEffect(() => {
        if (!tool) return

        tool.onMouseDown = (e: ToolEvent) => {
            downPoint.current = e.point
            setGlobalCursor(Grabbing)
        }

        tool.onMouseDrag = (e: ToolEvent) => {
            canvas.view.center = downPoint.current
                .subtract(e.point)
                .add(canvas.view.center)
        }
        tool.onMouseUp = () => {
            clearGlobalCursor(Grabbing)
        }

        canvas.view.on('mousemove', (e: MouseEvent) => {
            offset.current = e.point
        })
    }, [tool])

    useHotkeys(
        'space',
        () => {
            if (tool && tool.isMain) {
                setCursor(Grab, canvas.view.element)

                downPoint.current = offset.current
                tool.activate()
            }
            return false
        },
        () => {
            if (tool && tool.actived) {
                clearGlobalCursor()
                clearCursor(canvas.view.element)
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

export default ViewTool