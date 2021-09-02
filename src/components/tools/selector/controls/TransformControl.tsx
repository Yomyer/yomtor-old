import React, {
    RefObject,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState
} from 'react'
import { createCustomControl, CustomControlProps } from '../../../../utils'
import {
    findCornerQuadrant,
    rotateDelta
} from '../../../../utils/trigonometryUtils'
import {
    clearCursor,
    clearGlobalCursor,
    setCursor,
    setGlobalCursor
} from '../../../../utils/cursorUtils'

import {
    ResizeNESW,
    ResizeNWSE,
    ResizeNS,
    ResizeEW,
    RotateE,
    RotateSE,
    RotateN,
    RotateNE
} from '../../../icons/cursor'
import { EditorContext } from '../../../Yomtor'
import { normalize, round, sign } from '../../../../utils/mathUtils'
import { RotateS } from '../../../icons/cursor/RotateS'
import { RotateSW } from '../../../icons/cursor/RotateSW'
import { RotateW } from '../../../icons/cursor/RotateW'
import { RotateNW } from '../../../icons/cursor/RotateNW'
import { HotKeysEvent, useHotkeys } from '../../../../uses/useHokeys'

export const TransformControlTopLeft = createCustomControl({})
export const TransformControlTopCenter = createCustomControl({
    corner: 'topCenter'
})
export const TransformControlTopRight = createCustomControl({
    corner: 'topRight'
})
export const TransformControlLeftCenter = createCustomControl({
    corner: 'leftCenter'
})
export const TransformControlRightCenter = createCustomControl({
    corner: 'rightCenter'
})
export const TransformControlBottomLeft = createCustomControl({
    corner: 'bottomLeft'
})
export const TransformControlBottomCenter = createCustomControl({
    corner: 'bottomCenter'
})
export const TransformControlBottomRight = createCustomControl({
    corner: 'bottomRight'
})

type OptionalCustomControlPorps = {
    group?: RefObject<paper.Group>
    selector?: paper.Selector
}

const resizeCursors = [
    ResizeEW,
    ResizeNWSE,
    ResizeNS,
    ResizeNESW,
    ResizeEW,
    ResizeNWSE,
    ResizeNS,
    ResizeNESW,
    ResizeEW
]
const rotateCursors = [
    RotateE,
    RotateSE,
    RotateS,
    RotateSW,
    RotateW,
    RotateNW,
    RotateN,
    RotateNE,
    RotateE
]

const TransformControl: React.FC<OptionalCustomControlPorps> = ({
    group,
    selector
}) => {
    const [tool, setTool] = useState<paper.Tool>()
    const { canvas } = useContext(EditorContext)
    const props: CustomControlProps = { group, selector }
    const mode = useRef<'resize' | 'rotate'>('resize')
    const cursor = useRef<{
        point?: paper.Point
        angle: number
        corner?: paper.Item
    }>(null)
    const activeItems = useRef<paper.Item[]>([])
    const activeHelpers = useRef<paper.Item[]>([])

    const corner = useRef<paper.Item>(null)

    const data = useRef<{
        pivot: paper.Point
        pivotOrigin: paper.Point
        corner: paper.Point
        handler: paper.Point
        size: paper.Size
        center: paper.Point
        direction: paper.Point
        angle: number
        delta?: paper.Point
        point?: paper.Point
    }>()

    const helperControl = () => {
        canvas.project.deactivateAll()

        if (activeHelpers.current.length) {
            activeHelpers.current.forEach((item) => {
                item.remove()
            })
        }

        activeHelpers.current = activeItems.current.map((item) => {
            const clone = item
                .set({
                    visible: false
                })
                .clone({ keep: true })
            clone.set({
                visible: true,
                actived: true,
                guide: true
            })

            return clone
        })
    }

    const transform = (e: paper.ToolEvent, helper = true) => {
        mode.current === 'rotate' ? rotate(e, helper) : resize(e, helper)
    }

    const resize = (e: paper.ToolEvent, helper = true) => {
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

        const size = sizeModify.add(current.delta as any)

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

        canvas.project.activedItems.forEach((item) => {
            item.scaleWithRotate(
                factor,
                current.pivot,
                current.center,
                canvas.project.activedItems.length === 1
                    ? undefined
                    : current.angle
            )
        })

        canvas.setInfo(
            `${round(sizeModify.width * factor.x)} x ${round(
                sizeModify.height * factor.y
            )}`,
            current.point
        )

        canvas.fire('object:scaling', e)
    }

    const rotate = (e: paper.ToolEvent, helper = true) => {
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

        canvas.project.activedItems.forEach((item) => {
            item.rotate(delta)
        })

        canvas.setInfo(
            `${canvas.project.selectorItem.angle % 181}º`,
            current.point
        )

        canvas.fire('object:rotating', e)

        showCursor(true)
    }

    const showCursor = (global = false) => {
        clearCursor()
        clearGlobalCursor()

        if (!cursor.current) return

        const index = findCornerQuadrant(
            cursor.current,
            canvas.project.selectorItem
        )

        let cursors = resizeCursors
        if (mode.current === 'rotate') {
            cursors = rotateCursors
        }

        global ? setGlobalCursor(cursors[index]) : setCursor(cursors[index])
    }

    const arrowTransform = useCallback(
        (e: HotKeysEvent) => {
            if (
                tool &&
                tool.activatedMain &&
                canvas.project.activedItems.length
            ) {
                const point = e.delta
                    .multiply((e.isPressed('shift') && 10) || 1)
                    .multiply(-1)

                const actives = canvas.project.activedItems.map((item) => {
                    return item.selector
                })

                actives.forEach((selector: paper.Selector) => {
                    const size = new canvas.Point(selector.size)
                    const newSize = size.add(point)

                    const factor = size.divide(newSize)

                    selector.item.scaleWithRotate(
                        factor,
                        selector.points.topLeft
                    )
                })

                canvas.fire('object:scaling', e)
            }
        },
        [tool]
    )

    useEffect(() => {
        if (!canvas) return
        setTool(canvas.createTool('Transform'))
    }, [canvas])

    useEffect(() => {
        if (!tool) return

        tool.onMouseDrag = (e: paper.ToolEvent) => {
            data.current.point = e.point

            transform(e)
        }

        tool.onKeyDown = (e: paper.ToolEvent) => {
            transform(e)
        }

        tool.onKeyUp = (e: paper.ToolEvent) => {
            transform(e)
        }

        tool.onMouseUp = (e: paper.ToolEvent) => {
            canvas.project.deactivateAll()
            activeHelpers.current.forEach((item) => item.remove())
            activeItems.current.forEach((item) =>
                item.set({ visible: true, actived: true })
            )

            transform(e, false)

            clearGlobalCursor()
            tool.activateMain()

            if (e.item) {
                const hitResult = e.item.hitTest(e.point, {
                    stroke: false,
                    fill: true
                })
                if (hitResult && hitResult.item) {
                    const event: paper.MouseEvent = e as any
                    event.target = hitResult.item
                    hitResult.item.emit('mouseenter', event)
                }
            }

            cursor.current = null

            canvas.clearInfo()

            canvas.fire(
                mode.current === 'resize' ? 'object:scaled' : 'object:rotated',
                e
            )
        }

        canvas.view.on('mousemove', (e: paper.MouseEvent) => {
            corner.current = null

            if (e.target && e.target.data && e.target.data.isControl) {
                corner.current = e.target
            }

            if (!cursor.current) {
                clearCursor()
            }
        })
    }, [tool])

    props.onMouseEnter = (e: paper.MouseEvent) => {
        if (!tool.actived && tool.activatedMain) {
            cursor.current = {
                angle: canvas.project.selectorItem.selector.angle,
                point: e.target.position,
                corner: e.target
            }
            mode.current = e.modifiers.meta ? 'rotate' : 'resize'
            showCursor()
        }
    }

    props.onMouseLeave = () => {
        if (!tool.actived) {
            cursor.current = null
        }
        clearCursor()
    }

    props.onMouseDown = (e: paper.MouseEvent) => {
        if (!tool.activatedMain) return

        const cornerName = e.target.data.corner
        const rect = canvas.project.selectorItem
        activeItems.current = [...canvas.project.activedItems]

        const angle = rect.selector.angle

        const center = rect.selector.bounds.center
        const corner: paper.Point = rect.selector.bounds[cornerName]
        const handler: paper.Point = rect.selector.points[cornerName]
        const pivot: paper.Point =
            rect.selector.bounds[canvas.OpostieCornersName[cornerName]]
        const pivotOrigin =
            rect.selector.points[canvas.OpostieCornersName[cornerName]]
        const size = rect.selector.size
        const direction = sign(normalize(corner.subtract(pivot)))

        data.current = {
            pivot,
            pivotOrigin,
            corner,
            handler,
            size,
            center,
            direction,
            angle,
            point: e.point
        }

        mode.current = e.modifiers.meta ? 'rotate' : 'resize'
        showCursor(true)

        tool.activate()
    }

    useHotkeys(
        '*+cmd',
        () => {
            if (!tool.actived) {
                if (
                    canvas.project.selectorItem &&
                    corner.current &&
                    mode.current !== 'rotate'
                ) {
                    console.log('xD')
                    mode.current = 'rotate'
                    cursor.current = {
                        point: corner.current.position,
                        corner: corner.current,
                        angle: canvas.project.selectorItem.selector.angle
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

    useHotkeys(
        'cmd+arrows,cmd+shift+arrows',
        (_, e: HotKeysEvent) => {
            arrowTransform(e)
        },
        [tool]
    )

    return (
        <>
            <TransformControlTopLeft {...props} />
            <TransformControlTopCenter {...props} />
            <TransformControlTopRight {...props} />
            <TransformControlLeftCenter {...props} />
            <TransformControlRightCenter {...props} />
            <TransformControlBottomLeft {...props} />
            <TransformControlBottomCenter {...props} />
            <TransformControlBottomRight {...props} />
        </>
    )
}

export default TransformControl
