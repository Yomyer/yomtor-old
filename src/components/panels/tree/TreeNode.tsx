import React, { MouseEvent } from 'react'
import { createUseStyles } from 'react-jss'

export type TreeNodeData<T = unknown> = {
    name: string
    icon?: React.ReactNode
    children?: TreeNodeData<T>[]
} & T

export type TreeNodeEvents<T> = {
    iconFilter?: (node: TreeNodeData<T>) => React.ReactNode
    actionFilter?: (node: TreeNodeData<T>) => React.ReactNode
    activeFilter?: (node: TreeNodeData<T>) => boolean
    onClick?: (node?: TreeNodeData<T>, e?: MouseEvent<HTMLElement>) => void
    onMouseEnter?: (node: TreeNodeData<T>, e?: MouseEvent<HTMLElement>) => void
    onMouseLeave?: (node: TreeNodeData<T>, e?: MouseEvent<HTMLElement>) => void
}

type Props<T = any> = {
    node?: T
} & TreeNodeData &
    TreeNodeEvents<T>

const useStyles = createUseStyles<any, Partial<Props>>({
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
        paddingLeft: 10,
        background: (props) =>
            props.activeFilter && props.activeFilter(props.node) ? 'red' : null
    },
    actions: {},
    collapser: {},
    offspring: {
        paddingLeft: 20
    }
})

const TreeNode: React.FC<Props> = ({ name, children, node, ...props }) => {
    const { root, icon, label, actions, collapser, offspring } = useStyles({
        node,
        ...props
    })

    return (
        <div className={root}>
            <div
                className={label}
                onMouseEnter={(e) => props.onMouseEnter(node, e)}
                onMouseLeave={(e) => props.onMouseLeave(node, e)}
                onClick={(e) => {
                    props.onClick(node, e)
                }}
            >
                <em className={collapser} />
                <em className={icon}>{props.iconFilter(node)}</em>
                <label>{name}</label>
                {props.actionFilter ? (
                    <em className={actions}>{props.actionFilter(node)}</em>
                ) : null}
            </div>
            {children.length ? (
                <div className={offspring}>
                    {children.map((node, key) => (
                        <TreeNode
                            key={key}
                            node={node}
                            {...{ name: node.name, children: node.children }}
                            {...props}
                        />
                    ))}
                </div>
            ) : null}
        </div>
    )
}

TreeNode.defaultProps = {
    children: [],
    onClick: () => {},
    onMouseEnter: () => {},
    onMouseLeave: () => {}
}

export default TreeNode
