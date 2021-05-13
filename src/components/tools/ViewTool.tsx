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

const ViewTool: React.FC = ({ children }) => {
    const { canvas } = useContext(EditorContext)
    const [tool, setTool] = useState<paper.Tool>()
    const downPoint = useRef<paper.Point>()
    const offset = useRef<paper.Point>()

    const wheelMove = useCallback(
        (e: WheelEvent) => {
            if (tool && tool.activatedMain) {
                const point = new canvas.Point(e.deltaX, e.deltaY).divide(2)

                canvas.view.center = canvas.view.center.add(point)
            }
        },
        [tool]
    )

    const arrowMove = useCallback(
        (e: HotKeysEvent) => {
            if (
                tool &&
                tool.activatedMain &&
                !canvas.project.activedItems.length
            ) {
                const point = e.direction
                    .multiply((e.isPressed('shift') && 10) || 1)
                    .multiply(5)

                canvas.view.center = canvas.view.center.add(point)
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

        tool.onMouseDown = (e: paper.ToolEvent) => {
            downPoint.current = e.point
            setGlobalCursor(Grabbing)
        }

        tool.onMouseDrag = (e: paper.ToolEvent) => {
            canvas.view.center = downPoint.current
                .subtract(e.point)
                .add(canvas.view.center)
        }
        tool.onMouseUp = () => {
            clearGlobalCursor(Grabbing)
        }
    }, [tool])

    useHotkeys(
        'space',
        () => {
            if (tool && tool.activatedMain) {
                setCursor(Grab, canvas.view.element)

                downPoint.current = canvas.view.viewToProject(offset.current)
                tool.activate()
            }
            return false
        },
        () => {
            if (tool && tool.actived) {
                clearGlobalCursor()
                clearCursor(canvas.view.element)
                tool.activateMain()
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
        'mousemove',
        (e: MouseEvent) => {
            if (canvas) {
                offset.current = new canvas.Point(e.offsetX, e.offsetY)
            }
        },
        canvas && canvas.view.element
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
