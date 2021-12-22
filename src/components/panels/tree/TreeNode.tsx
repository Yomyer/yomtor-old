import React, { MouseEvent } from 'react'
import { createUseStyles } from 'react-jss'
import { YomtorTheme } from '../../../styles/createTheme'

export type TreeNodeData<T = unknown> = {
    name: string
    children: TreeNodeData<T>[]
    icon?: React.ReactNode
} & T

export type TreeNodeEvents<T> = {
    iconFilter?: (node: TreeNodeData<T>) => React.ReactNode
    actionFilter?: (node: TreeNodeData<T>) => React.ReactNode
    activeFilter?: (node: TreeNodeData<T>) => boolean
    highlightFilter?: (node: TreeNodeData<T>) => boolean
    labelFilter?: (node: TreeNodeData<T>) => string
    onClick?: (node?: TreeNodeData<T>, e?: MouseEvent<HTMLElement>) => void
    onMouseEnter?: (node: TreeNodeData<T>, e?: MouseEvent<HTMLElement>) => void
    onMouseLeave?: (node: TreeNodeData<T>, e?: MouseEvent<HTMLElement>) => void
}

type Props<T = TreeNodeData> = {
    node?: T
    depth?: number
} & TreeNodeEvents<T>

const useStyles = createUseStyles<
    'root' | 'icon' | 'label' | 'actions' | 'collapser',
    Partial<Props>,
    YomtorTheme
>((theme) => ({
    root: {},
    icon: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        marginRight: 10
    },
    label: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'flex-start',
        alignContent: 'stretch',
        alignItems: 'center',
        height: 28,
        borderWidth: 1,
        borderStyle: 'solid',
        paddingRight: 10,
        color: (props) =>
            props.activeFilter && props.activeFilter(props.node)
                ? theme.palette.primary.contrastText
                : null,
        borderColor: (props) =>
            props.highlightFilter && props.highlightFilter(props.node)
                ? theme.palette.primary.light
                : 'transparent',
        paddingLeft: (props) => props.depth * 20 + 10,
        background: (props) =>
            props.activeFilter && props.activeFilter(props.node)
                ? theme.palette.primary.light
                : null,
        '& label': {
            flex: '1 1 100%',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontSize: 12
        }
    },
    actions: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'flex-start',
        alignContent: 'stretch',
        alignItems: 'center',
        '& > *': {
            display: 'flex',
            marginLeft: 7
        }
    },
    collapser: {}
}))

const TreeNode: React.FC<Props> = (props) => {
    const { root, icon, label, actions, collapser } = useStyles(props)

    const node = props.node
    const children = node.children || []

    return (
        <div className={root}>
            <div
                className={label}
                onMouseEnter={(e) => props.onMouseEnter(node, e)}
                onMouseLeave={(e) => props.onMouseLeave(node, e)}
                onClick={(e) => {
                    props.onClick(props.node, e)
                }}
            >
                <em className={collapser} />
                <em className={icon}>
                    {props.iconFilter ? props.iconFilter(node) : null}
                </em>
                <label>
                    {props.labelFilter ? props.labelFilter(node) : node.name}
                </label>
                {props.actionFilter ? (
                    <em className={actions}>{props.actionFilter(node)}</em>
                ) : null}
            </div>
            {children.length ? (
                <div>
                    {children.map((child, key) => (
                        <TreeNode
                            key={key}
                            {...props}
                            node={child}
                            depth={props.depth + 1}
                        />
                    ))}
                </div>
            ) : null}
        </div>
    )
}

TreeNode.defaultProps = {
    onClick: () => {},
    onMouseEnter: () => {},
    onMouseLeave: () => {},
    depth: 0
}

export default TreeNode
