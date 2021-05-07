import React, { useContext, useEffect, useRef } from 'react'
import { Player } from '../../../models'
import { EditorContext } from '../../Yomtor'

type PlayerToolProps = {
    player: Player
    owner: string
    life?: boolean
    onModified?: (data: any) => void
    onSelected?: (data: any) => void
    onMoved?: (data: any) => void
}

const PlayerTool: React.FC<PlayerToolProps> = ({
    player,
    owner,
    onModified,
    onSelected,
    life
}) => {
    const { canvas } = useContext(EditorContext)
    const highlights = useRef<paper.Item[]>([])
    const selectedItems = useRef<paper.Item[]>([])

    useEffect(() => {
        if (player.id === owner) {
            const fireDispatch = (e: any) => {
                onModified(
                    e.items.map((item: paper.Path) => {
                        return item.exportJSON()
                    })
                )
            }

            if (life) {
                canvas.on('object:modifing', fireDispatch)
            }
            canvas.on('object:modified', fireDispatch)

            canvas.on('selection:modified', (e: any) => {
                onSelected(
                    e.items.map((item: paper.Path) => {
                        return item.id
                    })
                )
            })
        }
    }, [])

    if (player.id !== owner) {
        if (player.changes && player.changes.length) {
            player.changes
                .map((item) => canvas.project.importJSON(item))
                .forEach((item: any) => {
                    const exists = canvas.project.getItem({
                        id: item.id
                    })

                    if (exists) {
                        exists.replaceWith(item)
                    } else {
                        const layer = canvas.project.layers[item.data.layer]
                        if (layer) {
                            layer.insertChild(item.data.index, item)
                        }
                    }
                })
        }

        highlights.current.forEach((item) => item.remove())
        highlights.current = []
        selectedItems.current.forEach((item) => (item.blocked = false))
        selectedItems.current = []

        if (player.selectedItems && player.selectedItems.length) {
            player.selectedItems.forEach((id) => {
                const item = canvas.project.getItem({ id })
                if (item) {
                    const hightlight =
                        ((item as paper.Path).pathData &&
                            new canvas.Path((item as paper.Path).pathData)) ||
                        item.clone()

                    hightlight.set({
                        strokeColor: player.color,
                        strokeWidth: 2,
                        // dashArray: [10, 4],
                        guide: true
                    })

                    highlights.current.push(hightlight)

                    item.blocked = true
                    selectedItems.current.push(item)
                }
            })
        }
    }

    return <></>
}

PlayerTool.defaultProps = {
    onModified: () => {},
    onSelected: () => {},
    onMoved: () => {},
    life: false
}

export default PlayerTool
