import React, { useState } from 'react'

import { Provider } from 'react-redux'

import { store } from '../redux'
import { Settings } from '../redux/settings/settings.model'
import { isUndefined } from 'lodash'
import { ThemeProvider } from 'react-jss'
import { createTheme } from '../styles'
import { PaperScope } from '@yomyer/paper'
import CursorController from './icons/CursorController'
import EditorContext from './EditorContext'
import Cursor from './icons/Cursor'
import Default from './icons/cursor/Default'

type Props = {
    settings?: Settings
    theme?: {}
    overrideSettings?: boolean
}

const Yomtor: React.FC<Props> = ({
    children,
    settings,
    theme,
    overrideSettings
}) => {
    const [canvas, setCanvas] = useState<PaperScope | null>(null)
    const [action, setAction] = useState<{
        action: Cursor | Cursor[]
        rotation: number
        subAction?: Cursor
        global?: boolean
        clear?: boolean
    }>({
        action: Default,
        rotation: 0
    })

    const initCanvas = (c: PaperScope): void => {
        setCanvas(c)
    }

    const setCursor = (
        action: Cursor,
        rotation = 0,
        subAction?: Cursor
    ): void => {
        setAction({ action, rotation, subAction, global: false, clear: false })
    }
    const setGlobalCursor = (
        action: Cursor,
        rotation = 0,
        subAction?: Cursor
    ): void => {
        setAction({ action, rotation, subAction, global: true })
    }

    const clearCursor = (
        action: Cursor | Cursor[],
        rotation = 0,
        subAction?: Cursor
    ): void => {
        setAction({ action, rotation, subAction, global: false, clear: true })
    }
    const clearGlobalCursor = (
        action: Cursor | Cursor[],
        rotation = 0,
        subAction?: Cursor
    ): void => {
        setAction({ action, rotation, subAction, global: true, clear: true })
    }

    return (
        <Provider
            store={store(
                { settings },
                !overrideSettings || isUndefined(overrideSettings)
            )}
        >
            <ThemeProvider theme={theme || {}}>
                <EditorContext.Provider
                    value={{
                        canvas,
                        initCanvas,
                        settings,
                        theme,
                        setCursor,
                        setGlobalCursor,
                        clearGlobalCursor,
                        clearCursor
                    }}
                >
                    {children}

                    <CursorController cursor={action} />
                </EditorContext.Provider>
            </ThemeProvider>
        </Provider>
    )
}

Yomtor.defaultProps = {
    theme: createTheme()
}

export default Yomtor
