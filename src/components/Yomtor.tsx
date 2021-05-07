import React, { createContext, useState } from 'react'

import { Provider } from 'react-redux'

import { store } from '../redux'
import { Settings } from '../redux/settings/settings.model'
import { isUndefined } from 'lodash'
import { ThemeProvider } from 'react-jss'
import { createTheme } from '../styles'
import { YomtorTheme } from '../styles/createTheme'

type Props = {
    settings?: Settings
    theme?: {}
    overrideSettings?: boolean
}

type EditorContextProps = {
    canvas: paper.PaperScope | null
    initCanvas: (c: paper.PaperScope) => void
    settings: Settings
    theme: YomtorTheme
}
export const EditorContext = createContext<EditorContextProps>({
    canvas: null,
    initCanvas: () => {},
    settings: {},
    theme: {}
})

const Yomtor: React.FC<Props> = ({
    children,
    settings,
    theme,
    overrideSettings
}) => {
    const [canvas, setCanvas] = useState<paper.PaperScope | null>(null)

    const initCanvas = (c: paper.PaperScope): void => {
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
                    value={{ canvas, initCanvas, settings, theme }}
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
