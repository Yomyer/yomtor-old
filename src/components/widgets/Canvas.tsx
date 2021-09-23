import React, { useContext, useEffect, useRef } from 'react'
import { createUseStyles } from 'react-jss'
import { EditorContext } from '../Yomtor'
import paper from '@yomyer/paper'

type Props = {
    actions?: React.ReactNode
}
type Classes = 'root' | 'tools' | 'canvas'

const useStyles = createUseStyles<Classes>({
    root: {
        height: '100%',
        width: '100%'
    },
    tools: {
        position: 'absolute',
        bottom: 0,
        right: 0
    },
    canvas: {
        background: 'white',
        width: '100%',
        height: '100%'
    }
})

const Canvas: React.FC<Props> = ({ children }) => {
    const styles = useStyles()
    const wrapperRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const { canvas, initCanvas } = useContext(EditorContext)

    useEffect(() => {
        const scope = new paper.PaperScope()

        scope.setup(canvasRef.current)
        initCanvas(scope)
    }, [])

    return (
        <div className={styles.root} ref={wrapperRef}>
            <canvas
                tabIndex={0}
                ref={canvasRef}
                className={styles.canvas}
                data-paper-resize='true'
                onMouseDown={() => {
                    canvasRef.current.focus()
                    canvasRef.current.blur()
                }}
            />
            <div className={styles.tools}>{children}</div>
        </div>
    )
}

export default Canvas
