import { Item, PaperScope, Tool, ToolEvent } from '@yomyer/paper'
import React, { ForwardRefRenderFunction } from 'react'
import ObjectTool from '../components/tools/ObjectTool'
import { YomtorTheme } from '../styles/createTheme'
import Cursor from './cursorUtils'

type Props = {
    hotKey?: string
    cursor?: Cursor
    onInserMode?: (status: boolean) => void
    children?: JSX.Element
}

export const createObjectTool = (
    onPhantom: (
        event: ToolEvent,
        canvas: PaperScope,
        theme: YomtorTheme
    ) => Item,
    onObject: (
        event: ToolEvent,
        canvas: PaperScope,
        theme: YomtorTheme
    ) => Item,
    displayName: string,
    hotKey?: string,
    cursor?: Cursor
) => {
    const Component: ForwardRefRenderFunction<Tool, Props> = (
        { children, ...props },
        ref: any
    ) => {
        if (!props.hotKey) {
            props.hotKey = hotKey
            props.cursor = cursor
        }

        return (
            <ObjectTool
                onPhantom={onPhantom}
                onObject={onObject}
                {...props}
                ref={ref}
            >
                {children}
            </ObjectTool>
        )
    }

    if (process.env.NODE_ENV !== 'production') {
        Component.displayName = `${displayName}Tool`
    }

    return React.memo(React.forwardRef(Component))
}
