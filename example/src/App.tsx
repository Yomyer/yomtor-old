import React from 'react'
import { Grid, Toolbar, makeStyles, useMediaQuery } from '@material-ui/core'

import {
    OvalTool,
    AligmentProperties,
    Canvas,
    Properties,
    RectProperties,
    Yomtor,
    Zoom,
    Color,
    RectangleTool,
    createTheme
} from 'yomtor'

const maxWidth = 240

const useStyles = makeStyles((theme) => ({
    aside: {
        maxWidth: maxWidth,
        flexBasis: maxWidth,
        minWidth: maxWidth,
        background: theme.palette.background.default,
        borderWidth: '1px',
        borderColor: theme.palette.divider,
        borderRightStyle: 'solid'
    },
    main: {
        height: '100%'
    }
}))

const App = () => {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

    const { aside, main } = useStyles()

    const settings = {
        colors: [new Color('#000'), new Color('#000')]
    }
    const theme = createTheme({ type: prefersDarkMode ? 'dark' : 'light' })

    return (
        <Yomtor settings={settings} theme={theme}>
            <Grid container wrap='nowrap' className={main}>
                <Grid item xs={3} className={aside}>
                    <Properties>
                        <AligmentProperties />
                        <RectProperties />
                    </Properties>
                </Grid>
                <Grid item xs={12}>
                    <Toolbar>
                        <RectangleTool>
                            <button>Rect</button>
                        </RectangleTool>
                        <OvalTool>
                            <button>Oval</button>
                        </OvalTool>
                    </Toolbar>
                    <Canvas>
                        <Zoom />
                    </Canvas>
                </Grid>
            </Grid>
        </Yomtor>
    )
}

export default App
