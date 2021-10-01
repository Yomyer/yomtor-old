import React from 'react'
import { createUseStyles } from 'react-jss'
import { IconProps } from '../..'

const useStyles = createUseStyles<'root', IconProps>(
    {
        root: {
            color: 'inherit',
            fontSize: 'inherit',
            boxSizing: 'content-box',
            fill: 'currentcolor',
            width: '1em',
            height: '1em',
            display: 'inline-block',
            flexShrink: 0,
            userSelect: 'none',
            transform: (props) => `rotate(${(props.rotate || 0) * 90}deg)`
        }
    },
    { link: false }
)

const SvgIcon: React.FC<IconProps> = ({ children, ...props }) => {
    const classes = useStyles(props)

    return (
        <svg viewBox='0 0 24 24' className={classes.root}>
            {children}
        </svg>
    )
}

SvgIcon.defaultProps = {
    rotate: 0
}

export default SvgIcon
