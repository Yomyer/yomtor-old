import React from 'react'
import { createUseStyles } from 'react-jss'
import TreeNode, { TreeNodeData, TreeNodeEvents } from './TreeNode'

type Props<T = any> = {
    data: TreeNodeData<T>[]
} & TreeNodeEvents<T>

const useStyles = createUseStyles({
    root: {
        height: '100%',
        width: '100%',
        overflow: 'auto',
        fontSize: 12
    }
})

const TreeView: React.FC<Props> = ({ data, children, ...props }) => {
    const { root } = useStyles()

    return (
        <div className={root} onClick={(e) => props.onClick(null, e)}>
            {data.map((node, key) => (
                <TreeNode
                    key={key}
                    node={node}
                    {...{ name: node.name, children: node.children }}
                    {...props}
                />
            ))}
        </div>
    )
}

TreeView.defaultProps = {
    data: []
}

export default TreeView
