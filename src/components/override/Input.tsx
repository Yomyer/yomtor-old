import React, { forwardRef, MutableRefObject, useRef } from 'react'
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
    const input = useRef<HTMLInputElement>()

    /*
    useEffect(() => {
        const listener = (_e: MouseEvent) => {
            input.current.blur()
        }

        window.addEventListener('click', listener)
        return () => {
            window.removeEventListener('click', listener)
        }
    }, [])
    */

    return (
        <input
            ref={(node) => {
                input.current = node
                if (typeof ref === 'function') {
                    ref(node)
                } else if (ref) {
                    ;(ref as MutableRefObject<HTMLDivElement>).current = node
                }
            }}
            className={root}
            autoComplete='off'
            {...props}
        />
    )
})

Input.defaultProps = {
    onChange: () => {}
}

export default Input
