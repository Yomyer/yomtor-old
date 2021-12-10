import { Group, Item, Rectangle, Tool, ToolEvent } from '@yomyer/paper'
import { first, orderBy } from 'lodash'
import React, { useContext, useEffect, useState, useCallback } from 'react'
import { useHotkeys } from '../../uses/useHokeys'
import EditorContext from '../EditorContext'

const GroupTool: React.FC = ({ children }) => {
    const { canvas } = useContext(EditorContext)
    const [tool, setTool] = useState<Tool>()

    const group = useCallback(() => {
        console.log('group')
        const activeItems = orderBy(canvas.project.activeItems, 'index')
        if (activeItems.length) {
            const group = new Group({ name: 'Group' })

            group.insertBelow(activeItems[0])
            group.insertChildren(0, activeItems)

            tool.activeMain()
            canvas.project.deactivateAll()
            group.actived = true

            canvas.fire(['selection:updated', 'object:created'], {
                items: canvas.project.activeItems
            })
        }
    }, [tool])

    const ungroup = useCallback(() => {
        const activeItems = canvas.project.activeItems.slice()

        activeItems.forEach((item) => {
            if (item.className === 'Group') {
                item.children.slice().forEach((child) => {
                    child.insertBelow(item)
                    child.actived = true
                })

                item.remove()
            }
        })

        canvas.fire(['selection:updated', 'object:deleted'], {
            items: canvas.project.activeItems
        })
    }, [tool])

    useEffect(() => {
        if (!canvas) return
        setTool(canvas.createTool('Group'))

        canvas.on('edit', (e: ToolEvent) => {
            if (e.item instanceof Group) {
                const rect = new Rectangle(e.point)
                const items = orderBy(
                    e.item.getItems({
                        overlapping: rect,
                        recursive: false,
                        match: (item: Item) => {
                            if (item.className === 'Group') {
                                const children = item.getItems({
                                    class: canvas.Item,
                                    overlapping: rect
                                })
                                return !!children.length
                            }

                            return true
                        }
                    }),
                    ['index'],
                    ['desc']
                )

                if (items.length) {
                    canvas.project.deactivateAll()
                    first(items).actived = true

                    canvas.fire('selection:updated', { items: [first(items)] })
                }
            }
        })
    }, [canvas])

    useEffect(() => {
        // if (!tool) return
    }, [tool])

    useHotkeys('cmd+g', group, () => {}, [tool])
    useHotkeys('cmd+shift+g', ungroup, () => {}, [tool])

    return <span onClick={group}>{children}</span>
}

export default GroupTool
