import React, { forwardRef } from 'react'
import { createUseStyles } from 'react-jss'

type Props = React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
>

const useStyles = createUseStyles({
    root: {
        border: 'none',
        width: '100%',
        outline: 'none',
        background: 'none',
        color: 'inherit',
        userSelect: 'none'
    }
})

const Input = forwardRef<HTMLInputElement, Props>((props, ref) => {
    const { root } = useStyles()

    return <input ref={ref} className={root} autoComplete='off' {...props} />
})

Input.defaultProps = {
    onChange: () => {}
}

export default Input
