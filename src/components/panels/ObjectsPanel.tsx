import { Item, Path } from '@yomyer/paper'
import React, {
    MouseEvent,
    useCallback,
    useContext,
    useEffect,
    useState
} from 'react'
import EditorContext from '../EditorContext'
import Artboard from '../icons/Artboard'
import Group from '../icons/Group'
import Image from '../icons/Image'
import { TreeNodeData } from './tree/TreeNode'
import TreeView from './tree/TreeView'
import { createSvgIcon } from '../../utils'

const ObjectsPanel: React.FC = () => {
    const { canvas } = useContext(EditorContext)
    const [data, setData] = useState<TreeNodeData<Item>[]>([])

    useEffect(() => {
        if (!canvas) return

        canvas.on(
            [
                'object:created',
                'object:deleted',
                'object:resized',
                'object:rotated',
                'selection:created',
                'selection:updated',
                'selection:cleared'
            ],
            () => {
                setData([...canvas.project.activeLayer.children])
            }
        )
    }, [canvas])

    const onClick = useCallback(
        (node: TreeNodeData<Item>, e: MouseEvent) => {
            const actives = canvas.project.activeItems

            let status = 'created'

            if (actives.length) {
                status = 'updated'
            }

            if (!e.metaKey || !node) {
                canvas.project.deactivateAll()
            }

            if (node) {
                let actived = true

                if (actives.map((item) => item.uid).includes(node.uid)) {
                    actived = false
                }

                node.actived = actived
            } else {
                status = 'cleared'
            }
            canvas.fire(`selection:${status}`)

            e.stopPropagation()
        },
        [canvas]
    )

    const hightlight = useCallback(
        (node: TreeNodeData<Item>, status = false) => {
            node.highlighted = status
        },
        [canvas]
    )

    const activeFilter = useCallback(
        (node: TreeNodeData<Item>) => {
            return node.actived
        },
        [canvas]
    )

    const iconFilter = useCallback(
        (node: TreeNodeData<Item>) => {
            switch (node.className) {
                case 'Artboard':
                    return <Artboard />
                case 'Group':
                    return <Group />
                case 'Path':
                    const pathData = node instanceof Path && node.pathData
                    const info = node.bounds
                    const scale = Math.max(
                        (info.width * 100) / 24,
                        (info.height * 100) / 24
                    )

                    const strokeWidth = 2 * (1 + scale / 100)
                    const PathIcon = createSvgIcon(
                        <path
                            d={pathData}
                            fillOpacity='0'
                            strokeOpacity='1'
                            strokeWidth={strokeWidth}
                        />,
                        'Arrow'
                    )
                    return (
                        <PathIcon
                            viewport={`${info.left - strokeWidth / 2} ${
                                info.top - strokeWidth / 2
                            } ${info.width + strokeWidth} ${
                                info.height + strokeWidth
                            }`}
                        />
                    )
                    break
            }

            return <Image />
        },
        [canvas]
    )

    return (
        <>
            <TreeView
                data={data}
                onClick={onClick}
                onMouseEnter={(node) => hightlight(node, true)}
                onMouseLeave={(node) => hightlight(node)}
                iconFilter={iconFilter}
                activeFilter={activeFilter}
            />
        </>
    )
}

export default ObjectsPanel
