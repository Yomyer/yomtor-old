import React, { createContext, useState } from 'react'

import { Provider } from 'react-redux'

import { store } from '../redux'
import { Settings } from '../redux/settings/settings.model'
import { isUndefined } from 'lodash'
import { ThemeProvider } from 'react-jss'

type Props = {
    settings?: Settings
    theme?: {}
    overrideSettings?: boolean
}

type FabContext = [fabric.Canvas | null, (c: fabric.Canvas) => void]

export const FabricContext = createContext<FabContext>([null, () => {}])

const Yomtor: React.FC<Props> = ({
    children,
    settings,
    theme,
    overrideSettings
}) => {
    const [canvas, setCanvas] = useState<fabric.Canvas | null>(null)

    const initCanvas = (c: fabric.Canvas): void => {
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
                <FabricContext.Provider value={[canvas, initCanvas]}>
                    {children}
                </FabricContext.Provider>
            </ThemeProvider>
        </Provider>
    )
}

Yomtor.defaultProps = {
    theme: {
        colorPrimary: 'red'
    }
}

export default Yomtor
