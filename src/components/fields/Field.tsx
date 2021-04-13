import React, { ReactNode, SyntheticEvent } from 'react'

export type FieldProps<T> = {
    value?: any
    multiple?: boolean
    label?: string
    labelPosition?: 'above' | 'below'
    labelAlign?: 'start' | 'end'
    draggable?: boolean
    disabled?: boolean
    onUpdate?: (event?: SyntheticEvent<T>) => void
} & React.DetailedHTMLProps<React.InputHTMLAttributes<T>, T>

type Props<T> = FieldProps<T> & { children?: ReactNode }

const Field = <T extends object>({
    label,
    labelPosition = 'above',
    children
}: Props<T>) => {
    return (
        <div>
            {label && labelPosition === 'above' ? <label>{label}</label> : ''}
            {children}
        </div>
    )
}

export default Field
