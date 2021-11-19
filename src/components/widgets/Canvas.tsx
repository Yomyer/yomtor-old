import React, { useContext, useEffect, useRef, useState } from 'react'
import { createUseStyles } from 'react-jss'
import { PaperScope } from '@yomyer/paper'
import { YomtorTheme } from '../../styles/createTheme'
import EditorContext from '../EditorContext'
import Default from '../icons/cursor/Default'
import { cursorWithScope, setCursor } from '../../utils/cursorUtils'

type Props = {
    actions?: React.ReactNode
}
type Classes = 'root' | 'tools' | 'canvas'

const useStyles = createUseStyles<
    Classes,
    { hasArtboards: boolean },
    YomtorTheme
>((theme) => ({
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
        background: (props) =>
            props.hasArtboards ? theme.palette.canvas.background : 'white',
        width: '100%',
        height: '100%'
    }
}))

const Canvas: React.FC<Props> = ({ children }) => {
    const wrapperRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const { canvas, initCanvas } = useContext(EditorContext)
    const [hasArtboards, setHasArtboards] = useState(false)

    const styles = useStyles({ hasArtboards })

    useEffect(() => {
        const scope = new PaperScope()
        scope.setup(canvasRef.current)

        initCanvas(scope)
        cursorWithScope(scope)
    }, [])

    useEffect(() => {
        if (!canvas) {
            return
        }

        setCursor(Default)

        canvas.on(['object:created', 'object:deleted'], () => {
            setHasArtboards(!!canvas.project.artboards.length)
        })
    }, [canvas])

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
