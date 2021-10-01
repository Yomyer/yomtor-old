import React, { forwardRef } from 'react'
import { createUseStyles } from 'react-jss'

type Props = React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
>

const useStyles = createUseStyles({
    root: {
        border: 'none',
        width: '100%',
        outline: 'none',
        background: 'none',
        color: 'inherit',
        userSelect: 'none',
        cursor: 'inherit',
        minHeight: 'inherit',
        height: 'inherit',
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center'
    }
})

const Button = forwardRef<HTMLInputElement, Props>((props, ref) => {
    const { root } = useStyles()

    return <button ref={ref} className={root} {...props} />
})

export default Button
