import React, { useContext, useEffect, useCallback, useState } from 'react'
import { Block } from '../../containers'
import { NumericField } from '../../fields'
import { FabricContext } from '../../Yomtor'

const RectProperties: React.FC = () => {
    const [canvas] = useContext(FabricContext)
    const [rect, setRect] = useState({
        width: 0,
        height: 0,
        left: 0,
        top: 0
    })

    const updateRect = useCallback(() => {
        const active = canvas?.getActiveObject()

        setRect({
            width: Number((active?.width || 0).toFixed(0)) || 0,
            height: Number((active?.height || 0).toFixed(0)) || 0,
            left: Number((active?.left || 0).toFixed(0)) || 0,
            top: Number((active?.top || 0).toFixed(0)) || 0
        })
    }, [canvas])

    const onUpdate = useCallback(
        (e) => {
            const active = canvas?.getActiveObject()
            const { name, value } = onChange(e)

            active?.set(name, +value)
            canvas?.requestRenderAll()
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
        if (!canvas) {
            return
        }

        canvas.on('selection:created', updateRect)
        canvas.on('selection:updated', updateRect)
        canvas.on('object:moving', updateRect)
        canvas.on('object:scaling', updateRect)
    }, [canvas])

    return (
        <Block>
            <NumericField
                name='width'
                abs={true}
                prefix='a'
                suffix='W'
                value={rect.width.toString()}
                onUpdate={onUpdate}
                onChange={onChange}
            ></NumericField>
            <NumericField
                name='height'
                abs={true}
                suffix='H'
                value={rect.height.toString()}
                onUpdate={onUpdate}
                onChange={onChange}
            ></NumericField>
        </Block>
    )
}

export default RectProperties
