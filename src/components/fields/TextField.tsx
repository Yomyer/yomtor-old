import React from 'react'
import { clearProps } from '../../utils'
import Input from '../override/Input'
import Field, { FieldProps } from './Field'

type Props = FieldProps<HTMLInputElement>

const TextField: React.FC<Props> = ({ multiple, ...props }) => {
    return (
        <Field {...props}>
            <Input
                {...{
                    ...clearProps(props),
                    ...{
                        placeholder: multiple ? 'Multiple' : ''
                    }
                }}
            />
        </Field>
    )
}

export default TextField
