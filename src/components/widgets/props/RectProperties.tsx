import { uniq } from 'lodash'
import React, { useContext, useEffect, useCallback, useState } from 'react'
import { round } from '../../../utils/mathUtils'
import { Block, Section } from '../../containers'
import { NumericField } from '../../fields'
import { EditorContext } from '../../Yomtor'
import { Selector, Tool } from '@yomyer/paper'
import { scaleWithRotate } from '../../../utils/trigonometryUtils'

type Rect = {
    width: any
    height: any
    left: any
    top: any
    angle: any
}

const RectProperties: React.FC = () => {
    const defaults = {
        multiple: {
            width: false,
            height: false,
            left: false,
            top: false,
            angle: false
        },
        rect: {
            width: '',
            height: '',
            left: '',
            top: '',
            angle: ''
        }
    }
    const { canvas } = useContext(EditorContext)
    const [tool, setTool] = useState<Tool>()
    const [actived, setActived] = useState<boolean>(false)

    const [{ multiple, rect }, setSettings] = useState<{
        multiple?: Rect
        rect?: Rect
    }>(defaults)

    const updateRect = useCallback(
        (toFix = 2) => {
            const rects: Rect[] = canvas.project.activeItems.map((item) => {
                const selector = item.selector

                return {
                    width: round(selector.size.width || 0, 2) || 0.5,
                    height: round(selector.size.height || 0, 2) || 0.5,
                    left: round(selector.bounds.topLeft.x || 0, toFix) || 0,
                    top: round(selector.bounds.topLeft.y || 0, toFix) || 0,
                    angle: round(selector.angle || 0, 0) || 0
                }
            })
            const rect = rects[0]

            setActived(!!rects.length)

            if (rect) {
                setSettings({
                    multiple: {
                        width:
                            uniq(rects.map((rect) => rect.width)).length !== 1,
                        height:
                            uniq(rects.map((rect) => rect.height)).length !== 1,
                        left: uniq(rects.map((rect) => rect.left)).length !== 1,
                        top: uniq(rects.map((rect) => rect.top)).length !== 1,
                        angle:
                            uniq(rects.map((rect) => rect.angle)).length !== 1
                    },
                    rect
                })
            } else {
                setSettings(defaults)
            }
        },
        [canvas]
    )

    const onUpdate = useCallback(
        (e) => {
            const target = e.target
            const value = target.value
            const name = target.name

            const actives = canvas.project.activeItems.map((item) => {
                return item.selector
            })
            actives.forEach((selector: Selector) => {
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

                            scaleWithRotate(
                                selector.item,
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
                                if (multiple.left && name === 'left') {
                                    alter += selector.bounds.topLeft.x
                                }
                                if (multiple.top && name === 'top') {
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

        canvas.on('selection:updated', () => updateRect())
        canvas.on('selection:created', () => updateRect())
        canvas.on('selection:cleared', () => updateRect())
        canvas.on('object:moved', () => updateRect(0))
        canvas.on('object:scaled', () => updateRect(0))
        canvas.on('object:rotated', () => updateRect())

        /*
        canvas.on('object:moving', () => updateRect(0))
        canvas.on('object:scaling', () => updateRect(0))
        canvas.on('object:rotating', () => updateRect())
        */

        setTool(canvas.createTool('RectProperties'))
        /*
        canvas.on('selection:updated', () => console.log('selection:updated'))
        canvas.on('selection:created', () => console.log('selection:created'))
        canvas.on('selection:cleared', () => console.log('selection:cleared'))
        canvas.on('object:moving', () => console.log('object:moving'))
        canvas.on('object:scaling', () => console.log('object:scaling'))
        canvas.on('object:rotating', () => console.log('object:rotating'))
        canvas.on('object:moved', () => console.log('object:moved'))
        canvas.on('object:moving', () => console.log('object:moving'))
        */
    }, [canvas])

    const props = {
        onKeyDown: () => tool.activate(),
        onKeyUp: () => tool.activeMain(),
        onUpdate: onUpdate,
        onChange: onChange
    }

    return (
        <Section actived={actived}>
            <Block>
                <NumericField
                    name='left'
                    suffix='X'
                    value={rect.left.toString()}
                    multiple={multiple.left}
                    {...props}
                />
                <NumericField
                    name='top'
                    suffix='Y'
                    value={rect.top.toString()}
                    multiple={multiple.top}
                    {...props}
                />
                <NumericField
                    name='angle'
                    suffix='º'
                    value={rect.angle.toString()}
                    multiple={multiple.angle}
                    {...props}
                />
            </Block>
            <Block>
                <NumericField
                    name='width'
                    abs
                    suffix='W'
                    min={0.5}
                    value={rect.width.toString()}
                    multiple={multiple.width}
                    {...props}
                />
                <NumericField
                    name='height'
                    abs
                    suffix='H'
                    min={0.5}
                    value={rect.height.toString()}
                    multiple={multiple.height}
                    {...props}
                />
            </Block>
        </Section>
    )
}

export default RectProperties
