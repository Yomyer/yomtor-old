import React from 'react'
import { createUseStyles } from 'react-jss'
import { clearProps } from '../../utils/clearProps'

// type props = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

const useStyles = createUseStyles({
    root: {
        border: 'none',
        width: '100%'
    }
})

const Button: React.FC<any> = (props) => {
    const { root } = useStyles()

    return <button className={root} {...clearProps(props)}></button>
}

export default Button
