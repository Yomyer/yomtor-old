import React from 'react'
import { createUseStyles } from 'react-jss'
import { YomtorTheme } from '../../styles/createTheme'
import Button from '../override/Button'
import Field, { FieldProps } from '../form/Field/Field'

type Props = FieldProps<HTMLButtonElement>

type Classes = 'root'

const useStyles = createUseStyles<Classes, Props, YomtorTheme>((theme) => ({
    root: {
        color: theme.palette.text.primary,
        minHeight: 22,
        cursor: 'pointer',
        opacity: 0.5
    }
}))

const ButtonField: React.FC<Props> = ({ children, ...props }) => {
    const { root } = useStyles(props)

    return (
        <Field {...props}>
            <div className={root}>
                <Button>{children}</Button>
            </div>
        </Field>
    )
}

export default ButtonField
