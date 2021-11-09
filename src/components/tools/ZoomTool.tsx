import { Tool } from '@yomyer/paper'
import React, { useContext, useEffect, useState, useCallback } from 'react'
import { useEventListener } from '../../uses/useEventListener'
import { useHotkeys } from '../../uses/useHokeys'
import Button from '../override/Button'
import { EditorContext } from '../Yomtor'

type Props = {
    factor?: number
    max?: number
    min?: number
}

// https://jsfiddle.net/4va7kuwn/
const ZoomTool: React.FC<Props> = ({ factor }) => {
    const { canvas } = useContext(EditorContext)
    const [tool, setTool] = useState<Tool>()
    const [zoom, setZoom] = useState<number>()

    const wheelZoom = useCallback(
        (e: WheelEvent) => {
            if (!tool) return

            if (e.metaKey) {
                tool.activate()

                const oldZoom = canvas.view.zoom
                const oldCenter = canvas.view.center

                const mousePosition = canvas.view.viewToProject(
                    new canvas.Point(e.offsetX, e.offsetY)
                )

                const reverse = 1 - 1 / factor
                const newZoom =
                    e.deltaY > 0 ? oldZoom * reverse : oldZoom / reverse
                canvas.view.zoom = newZoom

                canvas.view.center = canvas.view.center.add(
                    mousePosition
                        .subtract(oldCenter)
                        .multiply(1 - oldZoom / newZoom)
                )

                setZoom(newZoom)

                tool.activeMain()
            } else {
                tool.activeMain()
            }
        },
        [tool]
    )

    useEffect(() => {
        if (!canvas) return
        setTool(canvas.createTool('Zoom'))
    }, [canvas])

    useEffect(() => {
        // if (!tool) return
    }, [tool])

    useEffect(() => {
        if (!zoom) return
        canvas.view.emit('zoom', { zoom })
    }, [zoom])

    useHotkeys(
        '*+cmd',
        () => {},
        () => {
            if (tool && tool.actived) {
                tool.activeMain()
            }
            return false
        },
        [tool]
    )

    useEventListener(
        'wheel',
        (e: WheelEvent) => {
            wheelZoom(e)
        },
        canvas && canvas.view.element
    )

    return (
        <>
            <Button>{zoom}</Button>
        </>
    )
}

ZoomTool.defaultProps = {
    factor: 8
}

export default ZoomTool
