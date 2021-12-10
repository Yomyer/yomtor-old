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
            fillOpacity: 1,
            stroke: 'currentcolor',
            strokeOpacity: 0,
            width: '1em !important',
            height: '1em  !important',
            display: 'inline-block',
            flexShrink: 0,
            userSelect: 'none',
            transform: (props) => `rotate(${(props.rotate || 0) * 90}deg)`
        }
    },
    { link: false }
)

const SvgIcon: React.FC<IconProps> = ({ children, viewport, ...props }) => {
    const classes = useStyles(props)

    return (
        <svg viewBox={viewport} className={classes.root}>
            {children}
        </svg>
    )
}

SvgIcon.defaultProps = {
    rotate: 0,
    viewport: '0 0 24 24'
}

export default SvgIcon
