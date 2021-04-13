import React, { useRef, useState } from 'react'
import ArrowIcon from '../icons/ArrowIcon'
import Input from '../override/Input'
import Field, { FieldProps } from './Field'
import { createUseStyles, useTheme } from 'react-jss'
import Draggable from 'react-draggable'
import { clearGlobalCursor, setGlobalCursor } from '../../utils/setCursor'
import Ink from 'react-ink'
import useLongPress from '../../uses/useLongPress'
import { clearProps } from '../../utils'

type Props = {
    prefix?: string
    suffix?: string
    abs?: boolean
    zero?: boolean
    integrer?: boolean
    max?: number
    min?: number
} & FieldProps<HTMLInputElement>

type Names = 'root' | 'prefix' | 'suffix' | 'arrows'

const useStyles = createUseStyles<
    Names,
    Props & { showArrows: boolean; focused: boolean },
    any
>(() => ({
    root: {
        background: 'white',
        border: '1px solid rgba(0,0,0,.12)',
        borderRadius: 3,
        color: 'rgba(0, 0, 0, 0.87)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        boxSizing: 'border-box',
        placeContent: 'stretch space-between',
        alignItems: 'stretch',
        padding: '0 5px',
        fontSize: 10,
        minHeight: 22
    },
    prefix: {
        display: 'flex',
        placeContent: 'center center',
        alignItems: 'center',
        cursor: 'ew-resize',
        transform: 'none !important'
    },
    suffix: {
        display: 'flex',
        placeContent: 'center center',
        alignItems: 'center',
        cursor: 'ew-resize',
        transform: 'none !important'
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
        background: 'white',
        borderLeft: '1px solid rgba(0,0,0,.12)',
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
    /* showArrows: {
        opacity: 1,
        pointerEvents: 'all',
    } */
}))

const isValid = ({ zero, integrer }: Props, value: any) => {
    let pattern = '^-?'
    // pattern += !abs ? '-?' : '';
    pattern += zero ? '\\d*' : '[1-9]\\d*'
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
    onUpdate,
    ...props
}) => {
    const [defaultValue, setDefatulValue] = useState('0')
    const [showArrows, setShowArrows] = useState(false)
    const [focused, setFocused] = useState(false)
    const theme = useTheme()

    const input = useRef<HTMLInputElement>()
    const styles = useStyles({ theme, ...{ showArrows, focused } })

    const update = (e: any, offset = 0) => {
        if (!onUpdate) return
        if (!isValid(props, e.target.value)) {
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

        if (abs && value < 0) {
            value = 0
        }

        e.target.value = Number(value)

        onUpdate(e)
    }

    props.onBlur = (e: any) => {
        update(e)
        setFocused(false)
    }

    props.onFocus = (e) => {
        setDefatulValue(e.target.value)
        setFocused(true)
    }

    props.onInput = (e: any) => {
        if (isValid(props, e.target.value)) {
            setDefatulValue(e.target.value)
        }
    }

    props.onKeyPress = (e) => {
        if (e.key === 'Enter') {
            update(e)
        }
    }

    props.onKeyDown = (e) => {
        if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
            update(e, e.key === 'ArrowUp' ? 1 : -1)
            e.preventDefault()
        }
    }

    const onDrag = (e: any, ui: any) => {
        if (!ui.deltaX) return
        e.target.value = props.value
        e.target.name = props.name

        update(e, ui.deltaX)
    }

    const onDragStart = () => {
        setGlobalCursor('ew-resize')
    }

    const onDragStop = () => {
        clearGlobalCursor()
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
                        <div className={styles.prefix}>{prefix}</div>
                    </Draggable>
                )}
                <Input
                    ref={input}
                    {...{
                        ...clearProps(props),
                        ...{
                            placeholder: multiple ? 'Multiple' : ''
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
                        <div className={styles.suffix}>{suffix}</div>
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

export default NumericField
