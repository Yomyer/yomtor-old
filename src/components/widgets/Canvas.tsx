import React, { useContext, useEffect, useRef } from 'react'
import { createUseStyles } from 'react-jss'
import { CanvasContext } from '../Yomtor'
import paper from 'paper'
import Selector from '../tools/Selector'

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

const Canvas: React.FC = ({ children }) => {
    const styles = useStyles()
    const wrapperRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [canvas, initCanvas] = useContext(CanvasContext)

    useEffect(() => {
        const scope = new paper.PaperScope()

        scope.setup(canvasRef.current)
        initCanvas(scope)
    }, [])

    return (
        <div className={styles.root} ref={wrapperRef}>
            <canvas
                ref={canvasRef}
                className={styles.canvas}
                data-paper-resize='true'
            />
            <Selector />
            <div className={styles.tools}>{children}</div>
        </div>
    )
}

export default Canvas
