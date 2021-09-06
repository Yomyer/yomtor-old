import { Group, Point } from '@yomyer/paper'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { EditorContext } from '../Yomtor'

const CursorInfoTool: React.FC = () => {
    const { canvas, theme } = useContext(EditorContext)
    const group = useRef<Group>(null)

    const [info, setInfo] = useState<{
        label: string
        point: Point
    }>(null)

    useEffect(() => {
        if (!canvas) return

        canvas.on('info:updated', (info: any) => {
            setInfo(info)
        })
    }, [canvas])

    if (group.current) {
        group.current.remove()
        group.current = null
    }

    if (info) {
        const label = new canvas.PointText({
            fillColor: theme.palette.canvas.info.color,
            point: [0, 0],
            content: info.label,
            fontSize: 12,
            guide: true,
            fontWeight: 200
        })

        const padding = new canvas.Point(16, 6)
        const background = new canvas.Path.Rectangle({
            rectangle: {
                point: [
                    label.bounds.x - padding.x / 2,
                    label.bounds.y - padding.y / 2
                ],
                size: [
                    label.bounds.width + padding.x,
                    label.bounds.height + padding.y
                ]
            },
            radius: 4,
            fillColor: theme.palette.canvas.info.background,
            guide: true
        })

        group.current = new canvas.Group([background, label])
        group.current.set({
            pivot: group.current.bounds.topLeft,
            position: info.point && info.point.add(7 / canvas.view.zoom),
            guide: true
        })
        group.current.sendToIndex(5)
        group.current.scale(1 / canvas.view.zoom)
        group.current.removeOn({
            drag: true,
            up: true
        })
    }

    return <></>
}

export default CursorInfoTool
