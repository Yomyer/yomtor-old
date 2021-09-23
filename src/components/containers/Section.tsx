import React from 'react'
import { createUseStyles, useTheme } from 'react-jss'
import { YomtorTheme } from '../../styles/createTheme'
import { isUndefined } from 'lodash'

type Props = {
    actived?: boolean
    visible?: boolean
}

const useStyles = createUseStyles<'section', Props, YomtorTheme>(() => ({
    section: {
        pointerEvents: (props) =>
            !isUndefined(props.actived) && (props.actived ? 'all' : 'none')
    }
}))

const Section: React.FC<Props> = ({ children, visible, ...props }) => {
    const theme = useTheme<YomtorTheme>()
    const { section } = useStyles({ theme, ...props })

    return <>{visible ? <div className={section}>{children}</div> : null}</>
}

Section.defaultProps = {
    visible: true
}

export default Section
