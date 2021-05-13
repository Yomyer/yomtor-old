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
        outline: 'none'
    }
})

const Button = forwardRef<HTMLInputElement, Props>((props, ref) => {
    const { root } = useStyles()

    return <button ref={ref} className={root} {...props} />
})

export default Button
