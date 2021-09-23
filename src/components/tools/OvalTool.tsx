import { KeyEvent, Path, Tool, ToolEvent } from '@yomyer/paper'
import React, {
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState
} from 'react'
import { useHotkeys } from '../../uses/useHokeys'
import { EditorContext } from '../Yomtor'
import { round } from '../../utils/mathUtils'

type Props = {
    onInserMode?: (status: boolean) => void
    hotKey?: string
}

const OvalTool: React.FC<Props> = ({ children, onInserMode, hotKey }) => {
    const { canvas, theme } = useContext(EditorContext)
    const [insertMode, setInserMode] = useState(false)
    const [tool, setTool] = useState<Tool>()
    const phantom = useRef<Path>(null)

    const onClick = useCallback(() => {
        setInserMode(true)
    }, [canvas])

    useEffect(() => {
        if (!canvas) return
        setTool(canvas.createTool('Oval'))
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

        tool.onMouseDrag = (e: ToolEvent) => {
            if (phantom.current) phantom.current.remove()

            phantom.current = new Path.Ellipse({
                from: round(e.downPoint),
                to: round(e.point),
                strokeColor: theme.palette.path.default.border,
                strokeWidth: 1 / canvas.view.zoom,
                guide: true,
                parent: canvas.guidesLayer
            })

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

                new canvas.Path.Ellipse({
                    from: round(e.downPoint),
                    to: round(e.point),
                    strokeColor: theme.palette.path.default.border,
                    fillColor: theme.palette.path.default.background,
                    name: 'Oval',
                    actived: true
                })

                canvas.fire('object:created', e)
            }

            canvas.clearInfo()
        }

        tool.onKeyDown = (e: KeyEvent) => {
            if (e.key === 'escape') {
                setInserMode(false)
            }
        }
    }, [tool])

    useHotkeys(
        hotKey,
        () => {
            if (tool && tool.mainActived) {
                setInserMode(true)
            }
        },
        [tool]
    )

    return <span onClick={onClick}>{children}</span>
}

OvalTool.defaultProps = {
    onInserMode: () => {},
    hotKey: 'o'
}

export default OvalTool
