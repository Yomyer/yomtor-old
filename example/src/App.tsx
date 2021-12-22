import React from 'react'
// import React, { useEffect, useState } from 'react'
import { Grid, Toolbar, makeStyles, useMediaQuery } from '@material-ui/core'
// import socketIOClient, { Socket } from 'socket.io-client'

import {
    OvalTool,
    AligmentProperties,
    CanvasPanel,
    PropertiesPanel,
    RectProperties,
    Yomtor,
    ZoomTool,
    RectangleTool,
    ArtboardTool,
    SelectorTool,
    createTheme,
    // PlayersTool,
    // Player,
    Color,
    // colorWord,
    ViewTool,
    SnapTool,
    GroupTool,
    ObjectsPanel
} from 'yomtor'

// const ENDPOINT = 'http://localhost:4000'
const maxWidth = 240

const useStyles = makeStyles((theme) => ({
    start: {
        maxWidth: maxWidth,
        flexBasis: maxWidth,
        minWidth: maxWidth,
        background: theme.palette.background.default,
        borderWidth: '1px',
        borderColor: theme.palette.divider,
        borderRightStyle: 'solid'
    },
    end: {
        maxWidth: maxWidth,
        flexBasis: maxWidth,
        minWidth: maxWidth,
        background: theme.palette.background.default,
        borderWidth: '1px',
        borderColor: theme.palette.divider,
        borderLeftStyle: 'solid'
    },
    toolbar: {
        borderWidth: '1px',
        borderColor: theme.palette.divider,
        borderBottomStyle: 'solid'
    },
    main: {
        height: '100%'
    },
    canvasPanelCanvasPanel: {
        flexGrow: 1
    }
}))

/*

const names = [
    'Sergio',
    'David',
    'Pedro',
    'Javier',
    'Sara',
    'Susana',
    'Jorge',
    'Nacho',
    'Laura',
    'Éric',
    'Paula',
    'Desirée'
]
const surnames = [
    'Caballero',
    'Cabezas',
    'García',
    'Jaime',
    'Ruiz',
    'Lambea',
    'De La Torre',
    'Peña',
    'Cheze',
    'Torres',
    'Fernandez'
]

type Session = {
    expires?: number
    id?: string
    token?: string
}

*/

const App = () => {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
    // const [response, setResponse] = useState('')
    /*
    const [session, setSession] = useState<Session>({})
    const [socket, setSocket] = useState<Socket>(null)
    const [players, setPlayers] = useState<Player[]>([])
    */
    const { start, end, main, canvasPanelCanvasPanel, toolbar } = useStyles()

    const settings = {
        colors: [new Color('#000'), new Color('#000')]
    }
    const theme = createTheme({ type: prefersDarkMode ? 'dark' : 'light' })

    /*
    useEffect(() => {
        const socket = socketIOClient(ENDPOINT)
        setSocket(socket)
        return () => {
            socket.disconnect()
        }
    }, [])

    useEffect(() => {
        if (!socket) return
        socket.on('player:entered', (data) => {
            setSession(data)
        })
    }, [socket])

    useEffect(() => {
        if (!session || !socket) return
        const name = names[Math.floor(Math.random() * names.length - 1) + 1]
        const surname =
            surnames[Math.floor(Math.random() * surnames.length - 1) + 1]

        socket.emit('player:login', {
            name,
            surname,
            id: session.id,
            color: colorWord(name).toCSS(true)
        })

        socket.on('players:changed', (players) => {
            setPlayers(players)
        })
    }, [session])

    const onModified = (data: Player) => {
        socket.emit('player:modified', data)
    }

    const onSelected = (data: Player) => {
        socket.emit('player:selected', data)
    }
    */

    return (
        <Yomtor settings={settings} theme={theme}>
            <Grid container wrap='nowrap' className={main}>
                <Grid item xs={3} className={start}>
                    <PropertiesPanel>
                        <AligmentProperties />
                        <RectProperties />
                    </PropertiesPanel>
                </Grid>
                <Grid
                    container
                    direction='column'
                    alignItems='stretch'
                    justify='flex-start'
                    wrap='nowrap'
                    item
                    xs={12}
                >
                    <Grid item className={toolbar}>
                        <Toolbar>
                            <RectangleTool>
                                <button>Rect</button>
                            </RectangleTool>
                            <OvalTool>
                                <button>Oval</button>
                            </OvalTool>
                            <ArtboardTool>
                                <button>Artboard</button>
                            </ArtboardTool>

                            <GroupTool>
                                <button>Group :D</button>
                            </GroupTool>
                        </Toolbar>
                    </Grid>
                    <Grid item className={canvasPanelCanvasPanel}>
                        <CanvasPanel>
                            <ZoomTool />
                            <SelectorTool />
                            <ViewTool />
                            <SnapTool />
                            {/*
                            <PlayersTool
                                life
                                players={players}
                                owner={socket && socket.id}
                                onModified={onModified}
                                onSelected={onSelected}
                            />
                            */}
                        </CanvasPanel>
                    </Grid>
                </Grid>
                <Grid item xs={3} className={end}>
                    <ObjectsPanel />
                </Grid>
            </Grid>
        </Yomtor>
    )
}

export default App
