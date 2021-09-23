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
    rotateDelta,
    scaleWithRotate
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
import { normalize, round, sign, abs } from '../../../../utils/mathUtils'
import { RotateS } from '../../../icons/cursor/RotateS'
import { RotateSW } from '../../../icons/cursor/RotateSW'
import { RotateW } from '../../../icons/cursor/RotateW'
import { RotateNW } from '../../../icons/cursor/RotateNW'
import { HotKeysEvent, useHotkeys } from '../../../../uses/useHokeys'
import {
    Group,
    Item,
    Point,
    Selector,
    Size,
    Tool,
    ToolEvent,
    MouseEvent,
    PaperScope
} from '@yomyer/paper'

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
    group?: RefObject<Group>
    selector?: Selector
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
    const [tool, setTool] = useState<Tool>()
    const { canvas } = useContext(EditorContext)
    const props: CustomControlProps = { group, selector }
    const mode = useRef<'resize' | 'rotate'>('resize')
    const cursor = useRef<{
        point?: Point
        angle: number
        corner?: Item
    }>(null)
    const activeItems = useRef<Item[]>([])
    const activeHelpers = useRef<Item[]>([])

    const corner = useRef<Item>(null)

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

        canvas.setInfo(
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
            item.rotate(delta)
        })

        canvas.setInfo(
            `${canvas.project.itemSelector.angle % 181}º`,
            current.point
        )
        if (helper) {
            canvas.fire('object:rotating', e)
        }

        showCursor(true)
    }

    const showCursor = (global = false) => {
        clearCursor()
        clearGlobalCursor()

        if (!cursor.current) return

        const index = findCornerQuadrant(
            cursor.current,
            canvas.project.itemSelector
        )

        let cursors = resizeCursors
        if (mode.current === 'rotate') {
            cursors = rotateCursors
        }

        global ? setGlobalCursor(cursors[index]) : setCursor(cursors[index])
    }

    const arrowTransform = useCallback(
        (e: HotKeysEvent) => {
            if (tool && tool.mainActived && canvas.project.activeItems.length) {
                const point = e.delta
                    .multiply((e.isPressed('shift') && 10) || 1)
                    .multiply(-1)

                const actives = canvas.project.activeItems.map((item) => {
                    return item.selector
                })

                actives.forEach((selector: Selector) => {
                    const size = new canvas.Point(selector.size)
                    const newSize = size.add(point)

                    const factor = size.divide(newSize)

                    scaleWithRotate(
                        selector.item,
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

        tool.onMouseDrag = (e: ToolEvent) => {
            data.current.point = round(e.point)

            transform(e)
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

            clearGlobalCursor()
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

            canvas.clearInfo()

            canvas.fire(
                mode.current === 'resize' ? 'object:scaled' : 'object:rotated',
                e
            )
        }

        canvas.view.on('mousemove', (e: MouseEvent) => {
            if (e.target && e.target.data && e.target.data.isControl) {
                corner.current = e.target || corner.current
            } else {
                corner.current = null
            }

            if (!corner.current) {
                clearCursor()
            }
        })
    }, [tool])

    props.onMouseEnter = (e: MouseEvent) => {
        if (!tool.actived && tool.mainActived) {
            cursor.current = {
                angle: canvas.project.itemSelector.selector.angle,
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

    props.onMouseDown = (e: MouseEvent) => {
        if (!tool.mainActived) return

        const cornerName = e.target.data.corner
        const rect = canvas.project.itemSelector
        activeItems.current = [...canvas.project.activeItems]

        const angle = rect.selector.angle

        const center = rect.selector.bounds.center
        const corner: Point = rect.selector.bounds[cornerName]
        const handler: Point = rect.selector.points[cornerName]
        const pivot: Point =
            rect.selector.bounds[PaperScope.OpostieCornersName[cornerName]]
        const pivotOrigin =
            rect.selector.points[PaperScope.OpostieCornersName[cornerName]]
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
            point: round(e.point)
        }

        cursor.current = {
            angle: canvas.project.itemSelector.selector.angle,
            point: e.target.position,
            corner: e.target
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
                    canvas.project.itemSelector &&
                    corner.current &&
                    mode.current !== 'rotate'
                ) {
                    mode.current = 'rotate'
                    cursor.current = {
                        point: corner.current.position,
                        corner: corner.current,
                        angle: canvas.project.itemSelector.selector.angle
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
