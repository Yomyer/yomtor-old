import React, { useState } from 'react'

import { ThemeProvider } from 'react-jss'
import { createTheme } from '../styles'
import { PaperScope } from '@yomyer/paper'
import EditorContext from './EditorContext'
import Settings from '../models/settings'

type Props = {
    settings?: Settings
    theme?: {}
    overrideSettings?: boolean
}

const Yomtor: React.FC<Props> = ({ children, settings, theme }) => {
    const [canvas, setCanvas] = useState<PaperScope | null>(null)

    const initCanvas = (c: PaperScope): void => {
        setCanvas(c)
    }

    return (
        <ThemeProvider theme={theme || {}}>
            <EditorContext.Provider
                value={{
                    canvas,
                    initCanvas,
                    settings,
                    theme
                }}
            >
                {children}
            </EditorContext.Provider>
        </ThemeProvider>
    )
}

Yomtor.defaultProps = {
    theme: createTheme()
}

export default Yomtor
