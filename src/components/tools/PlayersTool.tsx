import React from 'react'
import { PlayerTool } from './players'
import { Player } from '../../models'

type PlayersToolProps = {
    players: Player[]
    owner: string
    life?: boolean
    onModified?: (data: any) => void
    onSelected?: (data: any) => void
    onMoved?: (data: any) => void
}

const PlayersTool: React.FC<PlayersToolProps> = ({ players, ...props }) => {
    return (
        <>
            {players.map((player, index) => (
                <PlayerTool key={index} player={player} {...props} />
            ))}
        </>
    )
}

PlayersTool.defaultProps = {
    onModified: () => {},
    onSelected: () => {},
    onMoved: () => {},
    life: false
}

export default PlayersTool
