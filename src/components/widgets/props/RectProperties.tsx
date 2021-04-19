import React, { useContext, useEffect, useCallback, useState } from 'react'
import { Block, Section } from '../../containers'
import { NumericField } from '../../fields'
import { CanvasContext } from '../../Yomtor'

const RectProperties: React.FC = () => {
    const [canvas] = useContext(CanvasContext)
    const [rect, setRect] = useState({
        width: 0,
        height: 0,
        left: 0,
        top: 0,
        angle: 0
    })

    /*
    const updateRect = useCallback(
        (toFix = 2) => {
            const active = canvas?.getActiveObject()

            setRect({
                width: Number((active?.width || 0).toFixed(2)) || 0.5,
                height: Number((active?.height || 0).toFixed(2)) || 0.5,
                left: Number((active?.left || 0).toFixed(toFix)) || 0,
                top: Number((active?.top || 0).toFixed(toFix)) || 0,
                angle: Number((active?.angle || 0).toFixed(2)) || 0
            })
        },
        [canvas]
    )
    */
    const onUpdate = useCallback(
        (e) => {
            console.log(e)
            /*
            const active = canvas?.getActiveObject()
            const { name, value } = onChange(e)

            active?.set(name, +value)

            canvas?.requestRenderAll()
           
            if (name === 'angle')
                updateRect(['left', 'top'].includes(name) ? 0 : 2)

            */
        },
        [canvas, rect]
    )

    const onChange = useCallback(
        (e) => {
            const target = e.target
            const value = target.value
            const name = target.name

            setRect({ ...rect, ...{ [name]: value } })

            return { name, value }
        },
        [canvas, rect]
    )

    useEffect(() => {
        /*
        if (!canvas) {
            return
        }
       
        canvas.on('selection:created', () => updateRect())
        canvas.on('selection:updated', () => updateRect())
        canvas.on('object:moving', () => updateRect(0))
        canvas.on('object:scaling', () => updateRect())
        canvas.on('object:rotating', () => updateRect())
        */
    }, [canvas])

    return (
        <Section>
            <Block>
                <NumericField
                    name='left'
                    suffix='X'
                    value={rect.left.toString()}
                    onUpdate={onUpdate}
                    onChange={onChange}
                />
                <NumericField
                    name='top'
                    suffix='Y'
                    value={rect.top.toString()}
                    onUpdate={onUpdate}
                    onChange={onChange}
                />
                <NumericField
                    name='angle'
                    suffix='º'
                    value={rect.angle.toString()}
                    onUpdate={onUpdate}
                    onChange={onChange}
                />
            </Block>
            <Block>
                <NumericField
                    name='width'
                    abs
                    suffix='W'
                    min={0.5}
                    value={rect.width.toString()}
                    onUpdate={onUpdate}
                    onChange={onChange}
                />
                <NumericField
                    name='height'
                    abs
                    suffix='H'
                    min={0.5}
                    value={rect.height.toString()}
                    onUpdate={onUpdate}
                    onChange={onChange}
                />
            </Block>
        </Section>
    )
}

export default RectProperties
