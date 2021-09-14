import React, { useContext, useEffect, useRef, useState } from 'react'
import { EditorContext } from '../Yomtor'
import paper from 'paper'

type Props = {
    onInserMode?: (status: boolean) => void
}

const RectangleTool: React.FC<Props> = ({ children, onInserMode }) => {
    const { canvas } = useContext(EditorContext)
    const [insertMode, setInserMode] = useState(false)
    const [tool, setTool] = useState<paper.Tool>()
    const phantom = useRef<paper.Path.Rectangle>(null)

    useEffect(() => {
        if (!canvas) return
        console.log(canvas)
        setTool(canvas.createTool('Rectangle'))
    }, [canvas])

    useEffect(() => {
        if (!tool) return

        onInserMode((canvas.project.insertMode = insertMode))

        if (insertMode) {
            tool.activate()
        } else if (tool) {
            if (phantom.current) phantom.current.remove()
            tool.activateMain()
        }
    }, [insertMode])

    useEffect(() => {
        if (!tool) return

        tool.onMouseDrag = (e: paper.ToolEvent) => {
            if (phantom.current) phantom.current.remove()

            phantom.current = new paper.Path.Rectangle({
                from: e.downPoint,
                to: e.point,
                strokeColor: 'black',
                guide: true,
                parent: canvas.guides
            })

            canvas.setInfo(
                `${phantom.current.bounds.width} x ${phantom.current.bounds.height}`,
                e.point
            )
        }

        tool.onMouseUp = (e: paper.ToolEvent) => {
            setInserMode(false)

            if (phantom.current) {
                phantom.current.remove()
                canvas.project.deactivateAll()

                new canvas.Path.Rectangle({
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

        tool.onKeyDown = (e: paper.KeyEvent) => {
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
