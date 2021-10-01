import { isUndefined } from 'lodash'
import React from 'react'
import { createUseStyles } from 'react-jss'
import { YomtorTheme } from '../../styles/createTheme'

type Props = {
    actived?: boolean
    visible?: boolean
    gap?: number
    margin?: number
    padding?: number
}

const useStyles = createUseStyles<'root', Props, YomtorTheme>({
    root: {
        width: '100%',
        height: 'inherit',
        minHeight: 'inherit',
        maxHeight: 'inherit',
        display: 'flex',
        boxSizing: 'border-box',
        placeContent: 'center space-between',
        alignItems: 'center',
        flexDirection: 'row',
        padding: (props) => `0 ${props.padding}px`,
        margin: (props) => `${props.margin}px 0`,
        '& > *': {
            width: '100%',
            marginRight: (props) => props.gap
        },
        '& > *:last-child': {
            marginRight: '0'
        },
        pointerEvents: (props) =>
            !isUndefined(props.actived) && (props.actived ? 'all' : 'none')
    }
})

const Block: React.FC<Props> = ({ children, visible, ...props }) => {
    const { root } = useStyles({ ...props })

    return <>{visible ? <div className={root}>{children}</div> : null}</>
}

Block.defaultProps = {
    visible: true,
    gap: 10,
    margin: 10,
    padding: 10
}

export default Block
