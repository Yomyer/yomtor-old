import { uniq } from 'lodash'
import React, { useContext, useEffect, useCallback, useState } from 'react'
import { round } from '../../../utils/mathUtils'
import { Block, Section } from '../../containers'
import { NumericField } from '../../fields'
import { EditorContext } from '../../Yomtor'

type Rect = {
    width: any
    height: any
    left: any
    top: any
    angle: any
}

const RectProperties: React.FC = () => {
    const { canvas } = useContext(EditorContext)
    const [{ multiple, rect }, setSettings] = useState<{
        multiple?: Rect
        rect?: Rect
    }>({
        multiple: {
            width: false,
            height: false,
            left: false,
            top: false,
            angle: false
        },
        rect: {
            width: 0,
            height: 0,
            left: 0,
            top: 0,
            angle: 0
        }
    })

    const updateRect = useCallback(
        (toFix = 2) => {
            const actives = canvas.project.activedItems.map((item) => {
                return item.selector
            })
            const active = actives[0]

            setSettings({
                multiple: {
                    width:
                        uniq(actives.map((item) => item.size.width)).length !==
                        1,
                    height:
                        uniq(actives.map((item) => item.size.height)).length !==
                        1,
                    left:
                        uniq(actives.map((item) => item.bounds.topLeft.x))
                            .length !== 1,
                    top:
                        uniq(actives.map((item) => item.bounds.topLeft.y))
                            .length !== 1,
                    angle: uniq(actives.map((item) => item.angle)).length !== 1
                },
                rect: {
                    width: round(active?.size.width || 0, 2) || 0.5,
                    height: round(active?.size.height || 0, 2) || 0.5,
                    left: round(active?.bounds.topLeft.x || 0, toFix) || 0,
                    top: round(active?.bounds.topLeft.y || 0, toFix) || 0,
                    angle: round(active?.angle || 0, 0) || 0
                }
            })
        },
        [canvas]
    )

    const onUpdate = useCallback(
        (e) => {
            const target = e.target
            const value = target.value
            const name = target.name

            const actives = canvas.project.activedItems.map((item) => {
                return item.selector
            })

            actives.forEach((selector: paper.Selector) => {
                let alter = +value

                if (e.type !== 'mouseup') {
                    switch (name) {
                        case 'angle':
                            if (e.type !== 'keypress' && multiple.angle) {
                                alter += selector.angle
                            }
                            selector.item.rotate(alter - selector.angle)
                            break

                        case 'width':
                        case 'height':
                            if (e.type !== 'keypress') {
                                if (multiple.width && name === 'width') {
                                    alter += selector.size.width
                                }
                                if (multiple.height && name === 'height') {
                                    alter += selector.size.height
                                }
                            }

                            const factor = new canvas.Point(
                                name === 'width'
                                    ? alter / selector.size.width
                                    : 1,
                                name === 'height'
                                    ? alter / selector.size.height
                                    : 1
                            )

                            selector.item.scaleWithRotate(
                                factor,
                                selector.points[
                                    name === 'width'
                                        ? 'leftCenter'
                                        : 'topCenter'
                                ]
                            )
                            break

                        case 'left':
                        case 'top':
                            if (e.type !== 'keypress') {
                                if (multiple.width && name === 'left') {
                                    alter += selector.bounds.topLeft.x
                                }
                                if (multiple.height && name === 'top') {
                                    alter += selector.bounds.topLeft.y
                                }
                            }

                            const delta = new canvas.Point(
                                name === 'left'
                                    ? alter - selector.bounds.topLeft.x
                                    : 0,
                                name === 'top'
                                    ? alter - selector.bounds.topLeft.y
                                    : 0
                            )

                            selector.item.position = selector.item.position.add(
                                delta
                            )

                            break
                    }
                }
            })

            console.log(e.type)
            if (name === 'angle') {
                canvas.fire(
                    ['keypress', 'mouseup'].includes(e.type)
                        ? 'object:rotated'
                        : 'object:rotating',
                    e
                )
            }
            if (['left', 'top'].includes(name)) {
                canvas.fire(
                    ['keypress', 'mouseup'].includes(e.type)
                        ? 'object:moved'
                        : 'object:moving',
                    e
                )
            }
            if (['width', 'height'].includes(name)) {
                canvas.fire(
                    ['keypress', 'mouseup'].includes(e.type)
                        ? 'object:scaled'
                        : 'object:scaling',
                    e
                )
            }
        },
        [canvas, rect]
    )

    const onChange = useCallback(
        (e) => {
            const target = e.target
            const value = target.value
            const name = target.name

            setSettings({
                rect: { ...rect, ...{ [name]: value } },
                multiple: {
                    ...multiple,
                    ...{ [name]: false }
                }
            })

            return { name, value }
        },
        [canvas, rect]
    )

    useEffect(() => {
        if (!canvas) {
            return
        }

        /*
        canvas.on('selection:updated', () => updateRect())
        canvas.on('selection:created', () => updateRect())
        canvas.on('selection:cleared', () => updateRect())
        canvas.on('object:moving', () => updateRect(0))
        canvas.on('object:scaling', () => updateRect(0))
        canvas.on('object:rotating', () => updateRect())
        canvas.on('object:moved', () => updateRect(0))
        canvas.on('object:scaled', () => updateRect(0))
        canvas.on('object:rotated', () => updateRect())
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
                    multiple={multiple.left}
                />
                <NumericField
                    name='top'
                    suffix='Y'
                    value={rect.top.toString()}
                    onUpdate={onUpdate}
                    onChange={onChange}
                    multiple={multiple.top}
                />
                <NumericField
                    name='angle'
                    suffix='º'
                    value={rect.angle.toString()}
                    onUpdate={onUpdate}
                    onChange={onChange}
                    multiple={multiple.angle}
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
                    multiple={multiple.width}
                />
                <NumericField
                    name='height'
                    abs
                    suffix='H'
                    min={0.5}
                    value={rect.height.toString()}
                    onUpdate={onUpdate}
                    onChange={onChange}
                    multiple={multiple.height}
                />
            </Block>
        </Section>
    )
}

export default RectProperties
