import { isUndefined } from 'lodash'
import React from 'react'
import { createUseStyles } from 'react-jss'
import { YomtorTheme } from '../../styles/createTheme'

type Props = {
    actived?: boolean
    visible?: boolean
}

const useStyles = createUseStyles<'block', Props, YomtorTheme>({
    block: {
        width: '100%',
        height: 'inherit',
        minHeight: 'inherit',
        maxHeight: 'inherit',
        display: 'flex',
        boxSizing: 'border-box',
        placeContent: 'center space-between',
        alignItems: 'center',
        flexDirection: 'row',
        padding: '0 10px',
        margin: '10px 0',
        '& > *': {
            width: '100%',
            marginRight: '10px'
        },
        '& > *:last-child': {
            marginRight: '0'
        },
        pointerEvents: (props) =>
            !isUndefined(props.actived) && (props.actived ? 'all' : 'none')
    }
})

const Block: React.FC<Props> = ({ children, visible, ...props }) => {
    const { block } = useStyles({ ...props })

    return <>{visible ? <div className={block}>{children}</div> : null}</>
}

Block.defaultProps = {
    visible: true
}

export default Block
