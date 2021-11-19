import React, { useState } from 'react'

import { Provider } from 'react-redux'

import { store } from '../redux'
import { Settings } from '../redux/settings/settings.model'
import { isUndefined } from 'lodash'
import { ThemeProvider } from 'react-jss'
import { createTheme } from '../styles'
import { PaperScope } from '@yomyer/paper'
import EditorContext from './EditorContext'

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

    const initCanvas = (c: PaperScope): void => {
        setCanvas(c)
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
                        theme
                    }}
                >
                    {children}
                </EditorContext.Provider>
            </ThemeProvider>
        </Provider>
    )
}

Yomtor.defaultProps = {
    theme: createTheme()
}

export default Yomtor
