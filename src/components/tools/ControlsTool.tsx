import {
    ControlItem,
    Item,
    Matrix,
    MouseEvent,
    Point,
    Shape,
    Size,
    Tool,
    ToolEvent
} from '@yomyer/paper'
import React, { useEffect, useContext, useState, useRef } from 'react'
import EditorContext from '../EditorContext'

import {
    clearCursor,
    clearGlobalCursor,
    setCursor,
    setGlobalCursor
} from '../../utils/cursorUtils'
import { useHotkeys } from '../../uses/useHokeys'
import { sign, normalize, round, abs } from '../../utils/mathUtils'
import { rotateDelta, scaleWithRotate } from '../../utils/trigonometryUtils'
import Rotate from '../icons/cursor/Rotate'
import Resize from '../icons/cursor/Resize'

const ControlsTool: React.FC = ({ children }) => {
    const { canvas } = useContext(EditorContext)
    const [tool, setTool] = useState<Tool>()
    const mode = useRef<'resize' | 'rotate'>('resize')
    const cursor = useRef<{
        point?: Point
        angle: number
        corner?: Item
    }>(null)
    const activeItems = useRef<Item[]>([])
    const cursorAngle = useRef<number>(null)
    const data = useRef<{
        pivot: Point
        pivotOrigin: Point
        corner: Point
        handler: Point
        size: Size
        center: Point
        direction: Point
        angle: number
        delta?: Point
        point?: Point
    }>()
    const lastPoint = useRef<Point>(null)
    const corner = useRef<Item>(null)
    const activeHelpers = useRef<Item[]>([])

    const helperControl = () => {
        canvas.project.deactivateAll()

        if (activeHelpers.current.length) {
            activeHelpers.current.forEach((item) => item.remove())
        }

        activeHelpers.current = activeItems.current.map((item) => {
            const clone = item
                .set({
                    visible: false
                })
                .clone({ keep: true })
            clone.set({
                visible: true,
                actived: true
            })
            return clone
        })
    }

    const transform = (e: ToolEvent, helper = true) => {
        mode.current === 'rotate' ? rotate(e, helper) : resize(e, helper)
    }

    const resize = (e: ToolEvent, helper = true) => {
        const current = data.current

        if (helper && e) {
            helperControl()
        }

        current.delta = rotateDelta(
            current.point,
            current.handler,
            current.angle
        ).multiply(current.direction)

        let sizeModify = current.size
        if (e.modifiers.alt) {
            current.pivot = current.center
            sizeModify = current.size.multiply(0.5)
        } else {
            current.pivot = current.pivotOrigin
        }

        const size = round(sizeModify.add(current.delta as any))
        if (size.width === 0) {
            size.width = 0.5
        }
        if (size.height === 0) {
            size.height = 0.5
        }

        const factor = new canvas.Point(1.0, 1.0)
        if (Math.abs(sizeModify.width) > 0.0000001) {
            factor.x = size.width / sizeModify.width
        }
        if (Math.abs(sizeModify.height) > 0.0000001) {
            factor.y = size.height / sizeModify.height
        }

        if (e.modifiers.shift) {
            const signx = factor.x > 0 ? 1 : -1
            const signy = factor.y > 0 ? 1 : -1

            factor.x = factor.y = Math.max(
                Math.abs(factor.x * current.direction.x),
                Math.abs(factor.y * current.direction.y)
            )
            factor.x *= signx
            factor.y *= signy
        }

        canvas.project.activeItems.forEach((item) => {
            scaleWithRotate(
                item,
                factor,
                current.pivot,
                current.center,
                canvas.project.activeItems.length === 1
                    ? undefined
                    : current.angle
            )
        })

        canvas.project.controls.setInfo(
            `${abs(round(sizeModify.width * factor.x))} x ${abs(
                round(sizeModify.height * factor.y)
            )}`,
            current.point
        )

        if (helper) {
            canvas.fire('object:scaling', e)
        }
    }

    const rotate = (e: ToolEvent, helper = true) => {
        const current = data.current

        if (helper && e) {
            helperControl()
        }

        const origin = data.current.handler.subtract(current.center).angle % 360
        const rotate = data.current.point.subtract(current.center).angle % 360
        let delta = round(rotate - origin) % 360

        if (e.modifiers.shift) {
            delta = (Math.round((delta - data.current.angle) / 15) * 15) % 360
        }

        canvas.project.activeItems.forEach((item) => {
            item.rotate(delta, data.current.center)
        })

        canvas.project.controls.setInfo(`${delta % 181}º`, current.point)
        if (helper) {
            canvas.fire('object:rotating', e)
        }

        showCursor(true, canvas.project.activeItems.length > 1 && delta)
    }

    const showCursor = (global = false, angle = 0) => {
        if (!cursor.current) return

        angle =
            ((Math.round(
                (cursor.current.corner.position.subtract(
                    canvas.project.controls.position
                ).angle +
                    angle) /
                    5
            ) *
                5) %
                360) %
            181

        if (cursorAngle.current !== angle) {
            clearCursor([Rotate, Resize])
            clearGlobalCursor(Resize, cursorAngle.current)

            const cursorIcon = mode.current === 'rotate' ? Rotate : Resize

            global
                ? setGlobalCursor(cursorIcon, angle)
                : setCursor(cursorIcon, angle)

            clearGlobalCursor(Rotate, cursorAngle.current)
        }

        cursorAngle.current = angle
    }

    useEffect(() => {
        if (!canvas) return
        setTool(canvas.createTool('Transform'))
    }, [canvas])

    useEffect(() => {
        if (!tool) return

        const controls = canvas.project.controls
        const rotateHandler = new Shape.Rectangle({
            size: 10,
            fillColor: 'red',
            opacity: 0.000000001,
            insert: false
        })

        controls.addControl(
            new ControlItem('topLeft', -5, rotateHandler.clone()),
            'rotateTopLeft'
        )

        controls.addControl(
            new ControlItem('topRight', [5, -5], rotateHandler.clone()),
            'rotateTopRight'
        )

        controls.addControl(
            new ControlItem('bottomLeft', [-5, 5], rotateHandler.clone()),
            'rotateBottomLeft'
        )
        controls.addControl(
            new ControlItem('bottomRight', 5, rotateHandler.clone()),
            'rotateBottomRight'
        )

        tool.onMouseDrag = (e: ToolEvent) => {
            const delta = e.point.subtract(lastPoint.current)
            data.current.point = data.current.point.add(delta)

            transform(e)

            lastPoint.current = e.point
        }

        tool.onKeyDown = (e: ToolEvent) => {
            transform(e)
        }

        tool.onKeyUp = (e: ToolEvent) => {
            transform(e)
        }

        tool.onMouseUp = (e: ToolEvent) => {
            canvas.project.deactivateAll()
            activeHelpers.current.forEach((item) => item.remove())
            activeItems.current.forEach((item) =>
                item.set({ visible: true, actived: true })
            )

            transform(e, false)

            clearGlobalCursor([Rotate, Resize])
            tool.activeMain()

            if (e.item) {
                const hitResult = e.item.hitTest(e.point, {
                    stroke: false,
                    fill: true
                })
                if (hitResult && hitResult.item) {
                    const event: MouseEvent = e as any
                    event.target = hitResult.item
                    hitResult.item.emit('mouseenter', event)
                }
            }

            cursor.current = null

            controls.clearInfo()

            canvas.fire(
                mode.current === 'resize' ? 'object:resized' : 'object:rotated',
                e
            )
        }

        canvas.view.on(
            'mousemove',
            (e: MouseEvent & { target: ControlItem }) => {
                if (e.target && e.target.data && e.target.corner) {
                    corner.current = e.target || corner.current
                } else {
                    corner.current = null
                }

                if (!corner.current) {
                    clearCursor([Rotate, Resize])
                }
            }
        )

        controls.onMouseEnter = (e: MouseEvent & { target: ControlItem }) => {
            if (tool.actived && !tool.mainActived) return

            cursor.current = {
                angle: 0,
                point: e.target.position,
                corner: e.target
            }
            mode.current = e.modifiers.meta ? 'rotate' : 'resize'

            if (e.target.name.startsWith('rotate')) {
                mode.current = 'rotate'
            }

            cursorAngle.current = null

            showCursor()
        }

        controls.onMouseLeave = () => {
            if (!tool.actived) {
                cursor.current = null
            }
            clearCursor([Rotate, Resize])
        }

        controls.onMouseDown = (e: MouseEvent & { target: ControlItem }) => {
            if (!tool.mainActived) return

            tool.activate()

            const cornerName = e.target.corner
            const controls = canvas.project.controls
            activeItems.current = [...canvas.project.activeItems]

            const angle = controls.inheritedAngle

            const matrix = new Matrix().rotate(
                -controls.inheritedAngle,
                controls.center
            )
            const center = controls.center
            const corner: Point = controls[cornerName]
            const handler: Point = controls[cornerName]
            const pivot: Point = controls.getOposite(cornerName)
            const pivotOrigin = controls.getOposite(cornerName)
            const size = new Size(controls)
            const direction = sign(
                normalize(
                    matrix
                        .transformPoint(corner)
                        .subtract(matrix.transformPoint(pivot))
                )
            )

            data.current = {
                pivot,
                pivotOrigin,
                corner,
                handler,
                size,
                center,
                direction,
                angle,
                point: round(e.target.position)
            }

            cursor.current = {
                angle: controls.angle,
                point: e.target.position,
                corner: e.target
            }

            cursorAngle.current = null

            showCursor(true)

            lastPoint.current = e.point
        }
    }, [tool])

    useHotkeys(
        '*+cmd',
        () => {
            if (!tool.actived) {
                if (
                    canvas.project.controls &&
                    corner.current &&
                    mode.current !== 'rotate'
                ) {
                    mode.current = 'rotate'
                    cursor.current = {
                        point: corner.current.position,
                        corner: corner.current,
                        angle: canvas.project.controls.angle
                    }
                    showCursor()
                }
            }
        },
        () => {
            if (!tool.actived) {
                mode.current = 'resize'
                showCursor()
            }
        },
        [tool, canvas]
    )

    return <>{children}</>
}

export default ControlsTool
