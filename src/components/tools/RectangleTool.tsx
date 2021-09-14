import { KeyEvent, Path, Tool, ToolEvent } from '@yomyer/paper'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { EditorContext } from '../Yomtor'

type Props = {
    onInserMode?: (status: boolean) => void
}

const RectangleTool: React.FC<Props> = ({ children, onInserMode }) => {
    const { canvas } = useContext(EditorContext)
    const [insertMode, setInserMode] = useState(false)
    const [tool, setTool] = useState<Tool>()
    const phantom = useRef<Path>(null)

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

        tool.onMouseDrag = (e: ToolEvent) => {
            if (phantom.current) phantom.current.remove()

            phantom.current = new Path.Rectangle({
                from: e.downPoint,
                to: e.point,
                strokeColor: 'black',
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

                const a = new canvas.Path.Rectangle({
                    from: e.downPoint,
                    to: e.point,
                    strokeColor: '#979797',
                    fillColor: '#D8D8D8',
                    name: 'Rectangle',
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

    const onClick = () => {
        setInserMode(true)
    }

    return <span onClick={onClick}>{children}</span>
}

RectangleTool.defaultProps = {
    onInserMode: () => {}
}

export default RectangleTool
