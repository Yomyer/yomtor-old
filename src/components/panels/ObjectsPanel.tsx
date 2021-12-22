import { Item, Path } from '@yomyer/paper'
import React, {
    MouseEvent,
    useCallback,
    useContext,
    useEffect,
    useState
} from 'react'
import EditorContext from '../EditorContext'
import { TreeNodeData } from './tree/TreeNode'
import TreeView from './tree/TreeView'
import { createSvgIcon } from '../../utils'
import { Visible, Group, Image, Artboard, Lock, Hide, Unlock } from '../icons'
import { createUseStyles } from 'react-jss'

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
                'selection:cleared',
                'hightlight:created',
                'hightlight:cleared'
            ],
            () => {
                update()
            }
        )
    }, [canvas])

    const update = useCallback(() => {
        setData([...canvas.project.activeLayer.children])
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

    const hightlightHandler = useCallback(
        (node: TreeNodeData<Item>, status = false) => {
            node.highlighted = status
            canvas.fire(`hightlight:${status ? 'created' : 'cleared'}`)
        },
        [canvas]
    )

    const lockHandler = useCallback(
        (node: TreeNodeData<Item>, status) => {
            node.locked = status
        },
        [canvas]
    )

    const hideHandler = useCallback(
        (node: TreeNodeData<Item>, status) => {
            node.visible = !status
        },
        [canvas]
    )

    const activeFilter = useCallback(
        (node: TreeNodeData<Item>) => {
            return node.actived
        },
        [canvas]
    )

    const highlightFilter = useCallback(
        (node: TreeNodeData<Item>) => {
            return node.highlighted
        },
        [canvas]
    )

    const actionFilter = useCallback(
        (node: TreeNodeData<Item>) => {
            const { lock, visible } = createUseStyles<
                'lock' | 'visible',
                { node: TreeNodeData<Item> }
            >({
                lock: {
                    display: (props) =>
                        props.node.highlighted ||
                        !props.node.visible ||
                        props.node.locked
                            ? 'flex'
                            : 'none',
                    visibility: (props) =>
                        props.node.highlighted || props.node.locked
                            ? 'visible'
                            : 'hidden'
                },
                visible: {
                    display: (props) =>
                        props.node.highlighted ||
                        !props.node.visible ||
                        props.node.locked
                            ? 'flex'
                            : 'none',
                    visibility: (props) =>
                        props.node.highlighted || !props.node.visible
                            ? 'visible'
                            : 'hidden'
                }
            })({ node })

            return (
                <>
                    <span
                        className={visible}
                        onClick={() => hideHandler(node, node.visible)}
                    >
                        {node.visible ? <Visible /> : <Hide />}
                    </span>
                    <span
                        className={lock}
                        onClick={() => lockHandler(node, !node.locked)}
                    >
                        {node.locked ? <Lock /> : <Unlock />}
                    </span>
                </>
            )
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
                onMouseEnter={(node) => hightlightHandler(node, true)}
                onMouseLeave={(node) => hightlightHandler(node)}
                iconFilter={iconFilter}
                activeFilter={activeFilter}
                highlightFilter={highlightFilter}
                actionFilter={actionFilter}
            />
        </>
    )
}

export default ObjectsPanel
