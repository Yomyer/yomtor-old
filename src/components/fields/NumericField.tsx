import React, { useRef, useState } from 'react'
import ArrowIcon from '../icons/ArrowIcon'
import Input from '../override/Input'
import Field, { FieldProps } from './Field'
import { createUseStyles, useTheme } from 'react-jss'
import Draggable from 'react-draggable'
import {
    clearCursor,
    clearGlobalCursor,
    setCursor,
    setGlobalCursor
} from '../../utils/cursorUtils'
import Ink from 'react-ink'
import useLongPress from '../../uses/useLongPress'
import { clearProps } from '../../utils'
import { YomtorTheme } from '../../styles/createTheme'
import { ResizeEW } from '../icons/cursor'

type Props = {
    prefix?: string
    suffix?: string
    abs?: boolean
    zero?: boolean
    integrer?: boolean
    max?: number
    min?: number
    mutipleText?: string
} & FieldProps<HTMLInputElement>

type Classes = 'root' | 'prefix' | 'suffix' | 'arrows'

const useStyles = createUseStyles<
    Classes,
    Props & { showArrows: boolean; focused: boolean },
    YomtorTheme
>((theme) => ({
    root: {
        background: theme.palette.background.default,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: theme.palette.divider,
        borderRadius: theme.shape.borderRadius,
        color: theme.palette.text.primary,
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        boxSizing: 'border-box',
        placeContent: 'stretch space-between',
        alignItems: 'stretch',
        padding: '0 5px',
        fontSize: theme.typography.input.fontSize,
        minHeight: 22
    },
    prefix: {
        display: 'flex',
        placeContent: 'center center',
        alignItems: 'center',
        transform: 'none !important',
        opacity: (props) => (!props.focused && props.showArrows ? 0 : 0.5)
    },
    suffix: {
        display: 'flex',
        placeContent: 'center center',
        alignItems: 'center',
        transform: 'none !important',
        paddingLeft: 5,
        opacity: (props) => (!props.focused && props.showArrows ? 0 : 0.5)
    },

    arrows: {
        position: 'absolute',
        width: 18,
        right: 0,
        top: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignContent: 'stretch',
        alignItems: 'stretch',
        background: theme.palette.background,
        borderLeft: `1px solid ${theme.palette.divider}`,
        fontSize: 7,
        cursor: 'pointer',
        opacity: (props) => (!props.focused && props.showArrows ? 1 : 0),
        pointerEvents: (props) =>
            !props.focused && props.showArrows ? 'all' : 'none',
        '& > span': {
            flex: '1 1 50%',
            maxHeight: '50%',
            minHeight: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
            position: 'relative'
        }
    }
}))

const isValid = ({ zero, abs, integrer, multiple }: Props, value: any) => {
    let pattern = '^'
    pattern += !abs || !multiple ? '-?' : ''
    pattern += zero && !multiple ? '\\d*' : '[1-9]\\d*'
    pattern += !integrer ? '([.|,]?\\d+)?' : ''
    pattern += '$'
    const regexp = new RegExp(pattern)
    return regexp.exec(value)
}

const NumericField: React.FC<Props> = ({
    multiple,
    suffix,
    prefix,
    abs,
    zero,
    max,
    min,
    integrer,
    mutipleText,
    onUpdate,
    ...props
}) => {
    const [defaultValue, setDefatulValue] = useState('0')
    const [showArrows, setShowArrows] = useState(false)
    const [focused, setFocused] = useState(false)
    const theme = useTheme<YomtorTheme>()
    const validatorProps = { zero, abs, integrer }

    const input = useRef<HTMLInputElement>()
    const styles = useStyles({ theme, ...{ showArrows, focused } })
    const origin = { ...props }

    if (!mutipleText) mutipleText = 'Multiple'

    const update = (e: any, offset = 0) => {
        if (!onUpdate) return

        if (!isValid(validatorProps, e.target.value)) {
            e.target.value = defaultValue
        }

        if (e.altKey && !integrer) {
            offset /= 10
        }
        if (e.shiftKey) {
            offset *= 10
        }

        let value = Number(
            (+e.target.value.replace(',', '.') + offset).toFixed(2)
        )

        if (abs && value < 0 && !multiple) {
            value = 0
        }

        if (max && value > +max && !multiple) {
            value = +max
        }

        if (min && value < +min && !multiple) {
            value = +min
        }

        e.target.value = Number(value)

        onUpdate(e)
        setDefatulValue(e.target.value)
    }

    props.onBlur = (e: any) => {
        update(e)
        setFocused(false)
        origin.onBlur && origin.onBlur(e)
    }

    props.onFocus = (e) => {
        setDefatulValue(e.target.value)
        setFocused(true)
        origin.onFocus && origin.onFocus(e)
    }

    props.onInput = (e: any) => {
        if (isValid(validatorProps, e.target.value)) {
            setDefatulValue(e.target.value)
        }
        origin.onInput && origin.onInput(e)
    }

    props.onKeyPress = (e) => {
        if (e.key === 'Enter') {
            update(e)
        }
        origin.onKeyPress && origin.onKeyPress(e)
    }

    props.onKeyDown = (e) => {
        if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
            update(e, e.key === 'ArrowUp' ? 1 : -1)
            e.preventDefault()
        }
        origin.onKeyDown && origin.onKeyDown(e)
    }

    const onDrag = (e: any, ui: any) => {
        if (!ui.deltaX) return
        e.target.value = multiple ? '0' : props.value
        e.target.name = props.name

        update(e, ui.deltaX)
        input.current.focus()
    }

    const onDragStart = () => {
        setGlobalCursor(ResizeEW)
    }

    const onDragStop = (e: any) => {
        clearGlobalCursor()

        e.target.value = multiple ? '0' : props.value
        e.target.name = props.name

        onUpdate(e)
    }

    const handleIncrease = (e: any) => {
        e.target = input.current
        update(e, 1)
    }

    const handleDecrease = (e: any) => {
        e.target = input.current
        update(e, -1)
    }

    return (
        <Field {...props}>
            <div
                className={styles.root}
                onMouseEnter={() => setShowArrows(true)}
                onMouseLeave={() => setShowArrows(false)}
            >
                {prefix && (
                    <Draggable
                        axis='x'
                        onDrag={onDrag}
                        onStart={onDragStart}
                        onStop={onDragStop}
                    >
                        <div
                            className={styles.prefix}
                            onMouseEnter={() => setCursor(ResizeEW)}
                            onMouseLeave={clearCursor}
                        >
                            {prefix}
                        </div>
                    </Draggable>
                )}
                <Input
                    ref={input}
                    {...{
                        ...clearProps(props),
                        ...{
                            placeholder: multiple ? mutipleText : '',
                            value: multiple ? '' : props.value
                        }
                    }}
                />
                {suffix && (
                    <Draggable
                        axis='x'
                        onDrag={onDrag}
                        onStart={onDragStart}
                        onStop={onDragStop}
                    >
                        <div
                            className={styles.suffix}
                            onMouseEnter={() => setCursor(ResizeEW)}
                            onMouseLeave={clearCursor}
                        >
                            {suffix}
                        </div>
                    </Draggable>
                )}
                <div className={styles.arrows}>
                    <span {...useLongPress(handleIncrease)}>
                        <ArrowIcon rotate={2} />
                        <Ink />
                    </span>
                    <span {...useLongPress(handleDecrease)}>
                        <ArrowIcon />
                        <Ink />
                    </span>
                </div>
            </div>
        </Field>
    )
}

NumericField.defaultProps = {
    zero: true
}

export default NumericField
