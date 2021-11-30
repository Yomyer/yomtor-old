import { Group, Tool } from '@yomyer/paper'
import React, { useContext, useEffect, useState, useCallback } from 'react'
import { useHotkeys } from '../../uses/useHokeys'
import EditorContext from '../EditorContext'

const GroupTool: React.FC = ({ children }) => {
    const { canvas } = useContext(EditorContext)
    const [tool, setTool] = useState<Tool>()

    const group = useCallback(() => {
        const activeItems = canvas.project.activeItems
        if (activeItems.length) {
            const group = new Group()
            group.insertBelow(activeItems[0])
            group.insertChildren(0, activeItems)

            tool.activeMain()
            console.log(group)
        }
    }, [tool])

    const ungroup = useCallback(() => {
        console.log('ungruoup')
    }, [tool])

    useEffect(() => {
        if (!canvas) return
        setTool(canvas.createTool('Group'))
    }, [canvas])

    useEffect(() => {
        // if (!tool) return
    }, [tool])

    useHotkeys('cmd+g', group, () => {}, [tool])
    useHotkeys('cmd+shift+g', ungroup, () => {}, [tool])

    return <span onClick={group}>{children}</span>
}

export default GroupTool
