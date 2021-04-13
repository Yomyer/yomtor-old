import React, { useContext } from 'react'
import { Grid, Toolbar, makeStyles } from '@material-ui/core'

import {
    AligmentProperties,
    Canvas,
    Properties,
    RectProperties,
    Yomtor,
    Zoom,
    Color,
    YomtorRectangle,
    FabricContext
} from 'yomtor'

const maxWidth = 240

const useStyles = makeStyles((theme) => ({
    aside: {
        maxWidth: maxWidth,
        flexBasis: maxWidth,
        minWidth: maxWidth,
        background: theme.palette.background.paper,
        borderWidth: '1px',
        borderColor: theme.palette.divider,
        borderRightStyle: 'solid'
    },
    main: {
        height: '100%'
    }
}))

const ButtonTest: React.FC = () => {
    const [canvas] = useContext(FabricContext)

    const addRect = () => {
        const rect = new YomtorRectangle()
        canvas.add(rect)
    }

    return <button onClick={() => addRect()}>rect</button>
}

const App = () => {
    const { aside, main } = useStyles()

    const settings = {
        colors: [new Color('#000'), new Color('#000')]
    }

    return (
        <Yomtor settings={settings}>
            <Grid container wrap='nowrap' className={main}>
                <Grid item xs={3} className={aside}>
                    <Properties>
                        <AligmentProperties></AligmentProperties>
                        <RectProperties></RectProperties>
                    </Properties>
                </Grid>
                <Grid item xs={12}>
                    <Toolbar>
                        <ButtonTest></ButtonTest>
                    </Toolbar>
                    <Canvas>
                        <Zoom></Zoom>
                    </Canvas>
                </Grid>
            </Grid>
        </Yomtor>
    )
}

export default App
