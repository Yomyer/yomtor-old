import React from 'react'
import Button from '../override/Button'
import Field, { FieldProps } from './Field'

type Props = FieldProps<HTMLButtonElement>

const ButtonField: React.FC<Props> = ({ children, ...props }) => {
    return (
        <Field {...props}>
            <Button>{children}</Button>
        </Field>
    )
}

export default ButtonField
