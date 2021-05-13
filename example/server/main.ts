import { createServer } from 'http'
import { Server, Socket } from 'socket.io'
import jwt from 'jsonwebtoken'
import { Player } from 'yomtor'

const httpServer = createServer()
const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
})
const secret = process.env.JWT_SECRET || 'I95VWunF5wYfqziLbMynRPkpQ6dnA111'

const port = process.env.PORT || 4000

const players: Player[] = []

io.on('connection', (socket: Socket) => {
    console.log('user connected')
    const expires: number = 60 * 60

    socket.emit('player:entered', {
        expires,
        id: socket.id,
        token: jwt.sign({ id: socket.id }, secret, { expiresIn: expires })
    })

    socket.on('player:login', (data) => {
        players.push({ ...data, ...{ id: socket.id } })

        io.emit('players:changed', players)
    })

    socket.on('player:modified', (data) => {
        const player = players.find((player) => player.id === socket.id)

        if (player) {
            player.changes = data
            console.log(data)
            socket.broadcast.emit('players:changed', players)
            player.changes = []
        }
    })

    socket.on('player:selected', (data) => {
        const player = players.find((player) => player.id === socket.id)

        if (player) {
            player.selectedItems = data
            socket.broadcast.emit('players:changed', players)
        }
    })

    socket.on('disconnect', () => {
        const index = players.findIndex((player) => socket.id === player.id)
        players.splice(index, 1)

        io.emit('players:changed', players)
        console.log('Logout user ' + index)
    })
})

httpServer.listen(port, function () {
    console.log(`listening on *:${port}`)
})
