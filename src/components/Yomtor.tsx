import React, { createContext, useState } from 'react'

import { Provider } from 'react-redux'

import { store } from '../redux'
import { Settings } from '../redux/settings/settings.model'
import { isUndefined } from 'lodash'
import { ThemeProvider } from 'react-jss'
import { createTheme } from '../styles'
import paper from 'paper'

type Props = {
    settings?: Settings
    theme?: {}
    overrideSettings?: boolean
}

type CanvasContextProp = [
    paper.PaperScope | null,
    (c: paper.PaperScope) => void
]

export const CanvasContext = createContext<CanvasContextProp>([null, () => {}])

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
                <CanvasContext.Provider value={[canvas, initCanvas]}>
                    {children}
                </CanvasContext.Provider>
            </ThemeProvider>
        </Provider>
    )
}

Yomtor.defaultProps = {
    theme: createTheme()
}

export default Yomtor
