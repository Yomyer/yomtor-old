import React, { useContext, useEffect, useRef, useState } from 'react'
import { CanvasContext } from '../Yomtor'

type Props = {
    color?: string
}

const Selector: React.FC<Props> = ({ color }) => {
    const [canvas] = useContext(CanvasContext)
    const [tool, setTool] = useState<paper.Tool>()
    const hightlight = useRef<paper.Item>(null)
    const active = useRef<paper.Selector>(null)
    const mode = useRef<string>('none')

    useEffect(() => {
        if (!canvas) return
        setTool(canvas.createTool('Selector', true))

        canvas.view.on('frame', () => {
            if (active.current) active.current.remove()

            if (
                canvas.project.activedItems.length &&
                canvas.getTool('Selector').actived
            ) {
                let bounds = new canvas.Rectangle(
                    canvas.project.activedItems[0].bounds
                )

                canvas.project.activedItems.forEach(
                    (item) => (bounds = bounds.unite(item.bounds))
                )

                active.current = new canvas.Selector(bounds)
            }
        })
    }, [canvas])

    useEffect(() => {
        if (!tool) return

        tool.onMouseDown = (e: paper.ToolEvent) => {
            if (hightlight.current) hightlight.current.remove()

            const item = canvas.project.getItemByPoint(e.downPoint)

            canvas.project.deactivateAll()
            if (item) {
                item.actived = true
            }

            console.log(active.current)

            if (active.current && active.current.contains(e.point)) {
                mode.current = 'move'
            } else {
                //     mode.current = 'none'
            }
        }
        tool.onMouseMove = (e: paper.ToolEvent) => {
            if (hightlight.current) hightlight.current.remove()

            const item = canvas.project.getItemByPoint(e.point, {
                filter: (item: paper.Item) => !item.actived
            })

            if (item) {
                hightlight.current = item.clone()
                hightlight.current.set({
                    strokeColor: color,
                    strokeWith: 1,
                    guide: true
                })
            }
        }

        tool.onMouseDrag = (e: paper.ToolEvent) => {
            if (!active.current) return

            if (mode.current === 'move') {
                canvas.project.activedItems.forEach((item) => {
                    item.position = item.position.add(e.delta)
                })
            }
        }
    }, [tool])

    return <></>
}

Selector.defaultProps = {
    color: '#008EFC'
}

export default Selector
