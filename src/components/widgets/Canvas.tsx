import React, { useContext, useEffect, useRef, useCallback } from 'react'
import { createUseStyles } from 'react-jss'
import { FabricContext } from '../Yomtor'
import { useEventListener } from '../../hooks/event-listener'
import { fabric } from 'fabric'

const useStyles = createUseStyles({
    root: {
        height: '100%',
        width: '100%'
    },
    tools: {
        position: 'absolute',
        bottom: 0,
        right: 0
    }
})

const Canvas: React.FC = ({ children }) => {
    const styles = useStyles()
    const wrapperRef = useRef<HTMLDivElement>(null)
    const [canvas, initCanvas] = useContext(FabricContext)

    const resizeHandle = useCallback(() => {
        const wrapper = wrapperRef.current

        if (!canvas || !wrapper) return

        canvas.setHeight(wrapper.clientHeight)
        canvas.setWidth(wrapper.clientWidth)
        canvas.setBackgroundColor('white', () => {})
        canvas.renderAll()
    }, [canvas])

    useEffect(() => {
        initCanvas(
            new fabric.Canvas('yomtor-canvas', { uniformScaling: false })
        )
    }, [])

    useEffect(() => {
        if (!canvas) return

        resizeHandle()

        canvas.on('object:scaling', function () {
            var obj = canvas.getActiveObject()

            var obj = canvas.getActiveObject(),
                width = obj.width || 0,
                height = obj.height || 0,
                scaleX = obj.scaleX || 1,
                scaleY = obj.scaleY || 1

            obj.set({
                width: width * scaleX,
                height: height * scaleY,
                scaleX: 1,
                scaleY: 1
            })
        })
    }, [canvas])

    useEventListener('resize', resizeHandle)

    return (
        <div className={styles.root} ref={wrapperRef}>
            <canvas id='yomtor-canvas'></canvas>
            <div className={styles.tools}>{children}</div>
        </div>
    )
}

export default Canvas
