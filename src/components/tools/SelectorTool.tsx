import { isEqual } from 'lodash'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { round } from '../../utils/mathUtils'
import { EditorContext } from '../Yomtor'
import SelectorSelect from './selector/SelectorSelect'

type Props = {
    color?: string
}

const SelectorTool: React.FC<Props> = ({ children, color }) => {
    const { canvas } = useContext(EditorContext)
    const [tool, setTool] = useState<paper.Tool>()
    const hightlight = useRef<paper.Item>(null)
    const selector = useRef<paper.Group>(null)
    const mode = useRef<string>('none')
    const activedItems = useRef<number[]>([])

    const isActiveItemsUpdated = (): boolean => {
        return isEqual(
            activedItems.current,
            canvas.project.activedItems.map((item) => item.id)
        )
    }
    const updateAtiveItems = () => {
        activedItems.current = canvas.project.activedItems.map(
            (item) => item.id
        )
    }

    useEffect(() => {
        if (!canvas) return
        setTool(canvas.createTool('Selector', true))
    }, [canvas])

    useEffect(() => {
        if (!tool) return

        tool.onActivate = () => {
            if (!isActiveItemsUpdated()) {
                canvas.fire('selection:created', {
                    ...{ items: canvas.project.activedItems }
                })
                updateAtiveItems()
            }
        }

        tool.onDeactivate = () => {
            updateAtiveItems()
        }

        tool.onMouseDown = (e: paper.ToolEvent) => {
            let action = null
            mode.current = 'none'

            if (selector.current) {
                action = selector.current.hitTest(e.downPoint, {
                    stroke: false,
                    fill: true
                })
                mode.current = 'action'
            }

            if (!action) {
                if (hightlight.current) {
                    hightlight.current.remove()
                }

                const item = canvas.project.getItemByPoint(e.downPoint)

                const updated = canvas.project.activedItems.length
                    ? 'updated'
                    : 'created'

                if (!e.modifiers.shift && (!item || (item && !item.actived))) {
                    canvas.project.deactivateAll()
                }

                if (item) {
                    if (!item.actived) {
                        item.actived = true
                    } else if (e.modifiers.shift) {
                        item.actived = false
                    }

                    mode.current = 'move'

                    if (!isActiveItemsUpdated()) {
                        canvas.fire(`selection:${updated}`, {
                            ...{ items: canvas.project.activedItems }
                        })
                    }

                    updateAtiveItems()
                } else if (activedItems.current.length) {
                    canvas.fire(`selection:cleared`, {
                        ...{ items: canvas.project.activedItems }
                    })
                    activedItems.current = []
                }
            }
        }

        tool.onMouseMove = (e: paper.ToolEvent) => {
            if (hightlight.current) hightlight.current.remove()

            const item = canvas.project.getItemByPoint(e.point)

            if (item && !item.actived) {
                hightlight.current =
                    ((item as paper.Path).pathData &&
                        new canvas.Path((item as paper.Path).pathData)) ||
                    item.clone()

                hightlight.current.set({
                    strokeColor: color,
                    strokeWidth: 2,
                    guide: true
                })
            }
        }

        tool.onMouseDrag = (e: paper.ToolEvent) => {
            if (mode.current === 'move') {
                canvas.project.activedItems.forEach((item) => {
                    item.pivot = item.bounds.topLeft
                    item.position = round(item.position.add(e.delta))
                    item.pivot = item.bounds.center
                })
                canvas.fire('object:moving', e)
            }
        }

        tool.onMouseUp = (e: paper.ToolEvent) => {
            canvas.fire('object:moved', e)
        }
    }, [tool])

    return <SelectorSelect ref={selector}>{children}</SelectorSelect>
}

SelectorTool.defaultProps = {
    color: '#008EFC'
}

export default SelectorTool
