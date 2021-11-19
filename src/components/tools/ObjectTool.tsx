import { Item, KeyEvent, PaperScope, Tool, ToolEvent } from '@yomyer/paper'
import React, {
    useContext,
    useEffect,
    useRef,
    useState,
    useCallback,
    MutableRefObject
} from 'react'
import { useHotkeys } from '../../uses/useHokeys'
import EditorContext from '../EditorContext'
import { YomtorTheme } from '../../styles/createTheme'
import Cursor, { setCursor, clearCursor } from '../../utils/cursorUtils'
import Cross from '../icons/cursor/Cross'

type Props = {
    onInserMode?: (status: boolean) => void
    hotKey?: string
    cursor?: Cursor
    onPhantom: (
        event: ToolEvent,
        canvas: PaperScope,
        theme?: YomtorTheme
    ) => Item
    onObject: (
        event: ToolEvent,
        canvas: PaperScope,
        theme?: YomtorTheme
    ) => Item
    ref: MutableRefObject<Tool>
}

const ObjectTool: React.FC<Props> = ({
    children,
    onInserMode,
    onPhantom,
    onObject,
    hotKey,
    cursor,
    ref
}) => {
    const { canvas, theme } = useContext(EditorContext)
    const [insertMode, setInserMode] = useState(false)
    const [tool, setTool] = useState<Tool>()
    const phantom = useRef<Item>(null)

    const onClick = useCallback(() => {
        setInserMode(true)
    }, [canvas])

    useEffect(() => {
        if (!canvas) return
        setTool(canvas.createTool('Rectangle'))
    }, [canvas])

    useEffect(() => {
        if (!tool) return

        onInserMode((canvas.project.insertMode = insertMode))

        if (insertMode) {
            tool.activate()
        } else if (tool) {
            if (phantom.current) phantom.current.remove()
            tool.activeMain()
        }
    }, [insertMode])

    useEffect(() => {
        if (!tool) return

        tool.onActivate = () => {
            setCursor(Cross, 0, cursor)
        }

        tool.onDeactivate = () => {
            clearCursor(Cross, 0, cursor)
        }

        tool.onMouseDrag = (e: ToolEvent) => {
            if (phantom.current) phantom.current.remove()

            phantom.current = onPhantom(e, canvas, theme)

            canvas.setInfo(
                `${phantom.current.bounds.width} x ${phantom.current.bounds.height}`,
                e.point
            )
        }

        tool.onMouseUp = (e: ToolEvent) => {
            setInserMode(false)
            if (phantom.current) {
                phantom.current.remove()
                canvas.project.deactivateAll()

                onObject(e, canvas, theme)

                canvas.fire('object:created', e)
            }

            canvas.clearInfo()
        }

        tool.onKeyDown = (e: KeyEvent) => {
            if (e.key === 'escape') {
                setInserMode(false)
            }
        }
        if (ref) {
            ref.current = tool
        }
    }, [tool])

    useHotkeys(
        hotKey,
        () => {
            if (tool && (tool.mainActived || tool.mainActived === undefined)) {
                setInserMode(true)
            }
        },
        [tool]
    )

    return <span onClick={onClick}>{children}</span>
}

ObjectTool.defaultProps = {
    onInserMode: () => {},
    hotKey: 'r'
}

export default ObjectTool
