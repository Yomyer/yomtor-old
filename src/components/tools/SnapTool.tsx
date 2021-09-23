import { Tool } from '@yomyer/paper'
import React, { useContext, useEffect, useState } from 'react'
import { EditorContext } from '../Yomtor'

const SnapTool = () => {
    const { canvas } = useContext(EditorContext)
    const [tool, setTool] = useState<Tool>()

    useEffect(() => {
        if (!canvas) return
        setTool(canvas.createTool('Snap'))
    }, [canvas])

    useEffect(() => {
        // if (!tool) return
    }, [tool])

    return <div />
}

export default SnapTool
