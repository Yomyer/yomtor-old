import {
    Group,
    Item,
    KeyEvent,
    Path,
    Point,
    Tool,
    ToolEvent
} from '@yomyer/paper'
import { differenceWith, intersectionWith, isEqual } from 'lodash'
import React, {
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState
} from 'react'
import { useHotkeys, HotKeysEvent } from '../../uses/useHokeys'
import { EditorContext } from '../Yomtor'
import SelectorSelect from './selector/SelectorSelect'

const SelectorTool: React.FC = ({ children }) => {
    const { canvas, theme } = useContext(EditorContext)
    const [tool, setTool] = useState<Tool>()
    const hightlight = useRef<Item>(null)
    const selector = useRef<Group>(null)
    const mode = useRef<string>('select')
    const activedItems = useRef<Item[]>([])
    const clonedItems = useRef<Item[]>([])
    const selectRect = useRef<Path>(null)
    const beforePositions = useRef<Point[]>([])
    const moved = useRef<boolean>(false)
    const selectItems = useRef<Item[]>(null)

    const isActiveItemsUpdated = (): boolean => {
        return isEqual(
            activedItems.current.map((item) => item.uid),
            canvas.project.activeItems.map((item) => item.uid)
        )
    }
    const updateAtiveItems = () => {
        activedItems.current = [...canvas.project.activeItems]
    }

    const setBeforePositions = () => {
        if (!beforePositions.current.length) {
            beforePositions.current = canvas.project.activeItems.map(
                (item) => item.position
            )
        }
    }

    const cloneController = () => {
        if (mode.current === 'clone') {
            if (!clonedItems.current.length) {
                updateAtiveItems()
                clonedItems.current = canvas.project.activeItems.map((item) =>
                    item.clone()
                )
                canvas.project.deactivateAll()
                clonedItems.current.forEach((item) =>
                    item.set({ actived: true })
                )

                if (beforePositions.current.length) {
                    activedItems.current.forEach(
                        (item, index) =>
                            (item.position = beforePositions.current[index])
                    )

                    canvas.fire('object:modified', {
                        items: activedItems.current
                    })
                }
            }
        } else {
            if (clonedItems.current.length) {
                canvas.project.deactivateAll()

                clonedItems.current.map((item, index) => {
                    if (activedItems.current.length) {
                        activedItems.current[index].actived = true
                        activedItems.current[index].position = item.position
                    }

                    item.remove()
                })
                clonedItems.current = []

                canvas.fire('object:modified', {
                    items: activedItems.current
                })
            }
        }
    }

    const rectSelectorController = (e: KeyEvent | ToolEvent) => {
        if (e instanceof canvas.ToolEvent) {
            selectRect.current = new canvas.Path.Rectangle({
                from: e.downPoint,
                to: e.point,
                strokeColor: theme.palette.canvas.selector.border,
                fillColor: theme.palette.canvas.selector.background,
                strokeWidth: 1 / canvas.view.zoom,
                guide: true
            })
        }

        if (selectRect.current) {
            const match = {
                class: canvas.Item,
                match: (item: Item) => {
                    return !item.guide && !['Layer'].includes(item.className)
                }
            }

            if (selectRect.current.layer) {
                match[e.modifiers.alt ? 'inside' : 'overlapping'] =
                    selectRect.current.bounds

                const items = canvas.project.getItems(match)
                canvas.project.deactivateAll()

                const deactives = intersectionWith(
                    items,
                    activedItems.current,
                    isEqual
                )

                const actives = differenceWith(
                    activedItems.current.concat(items),
                    deactives,
                    isEqual
                )

                deactives.forEach((item) => (item.actived = false))
                actives.forEach((item) => (item.actived = true))

                selectRect.current.removeOn({
                    up: true,
                    drag: true
                })

                if (e.modifiers.shift && selectItems.current === null) {
                    selectItems.current = [...canvas.project.activeItems]
                }

                if (
                    !isEqual(
                        (selectItems.current || []).map((item) => item.uid),
                        canvas.project.activeItems.map((item) => item.uid)
                    )
                ) {
                    let action = 'updated'

                    if (!canvas.project.activeItems.length) {
                        action = 'cleared'
                    }

                    if (
                        !(selectItems.current || []).length &&
                        !deactives.length
                    ) {
                        action = 'created'
                    }

                    canvas.fire(`selection:${action}`, {
                        ...{ items: actives }
                    })
                }
                selectItems.current = [...canvas.project.activeItems]
            }
        }
    }
    const move = useCallback(
        (e: any) => {
            canvas.project.activeItems.forEach((item) => {
                item.position = item.position.add(e.delta)
            })

            if (mode.current === 'move') {
                canvas.fire('object:moving', e)
                moved.current = true
            }
        },
        [canvas]
    )

    const arrowMove = useCallback(
        (e: HotKeysEvent) => {
            if (
                tool &&
                tool.mainActived &&
                canvas.project.activeItems.length &&
                !e.isPressed('cmd')
            ) {
                mode.current = 'move'

                e.delta = e.delta.multiply((e.isPressed('shift') && 10) || 1)
                move(e)

                mode.current = 'select'
            }
        },
        [tool]
    )

    useEffect(() => {
        if (!canvas) return
        setTool(canvas.createTool('Selector', true))
    }, [canvas])

    useEffect(() => {
        if (!tool) return

        let beforeMode = 'mode'

        tool.onActivate = () => {
            if (!isActiveItemsUpdated()) {
                canvas.fire('selection:created', {
                    ...{ items: canvas.project.activeItems }
                })
                updateAtiveItems()
            }
            mode.current = ['move', 'clone'].includes(beforeMode)
                ? beforeMode
                : 'none'

            tool.paused = false
        }

        tool.onDeactivate = () => {
            beforeMode = mode.current
            mode.current = 'none'
            cloneController()

            if (hightlight.current) {
                hightlight.current.remove()
            }
        }

        tool.onMouseDown = (e: ToolEvent) => {
            let action = null
            mode.current = 'select'

            if (selector.current) {
                action = selector.current.hitTest(e.downPoint, {
                    stroke: false,
                    fill: true
                })
                mode.current = 'action'
            }

            if (!action) {
                if (hightlight.current) {
                    hightlight.current.remove()
                }

                const item = canvas.project.getItemByPoint(e.downPoint)
                const updated = canvas.project.activeItems.length
                    ? 'updated'
                    : 'created'

                if (!e.modifiers.shift && (!item || (item && !item.actived))) {
                    canvas.project.deactivateAll()
                }

                if (item) {
                    tool.paused = true

                    if (!item.actived) {
                        item.actived = true
                    } else if (e.modifiers.shift) {
                        item.actived = false
                    }

                    setBeforePositions()

                    mode.current = 'move'
                    if (e.modifiers.alt) {
                        mode.current = 'clone'
                    }

                    if (!isActiveItemsUpdated()) {
                        canvas.fire(`selection:${updated}`, e)
                    }

                    updateAtiveItems()
                } else if (activedItems.current.length && !e.modifiers.shift) {
                    canvas.fire(`selection:cleared`, e)
                    activedItems.current = []
                }

                if (!item) {
                    mode.current = 'select'
                }
            }
        }

        tool.onMouseDrag = (e: ToolEvent) => {
            if (!e.downPoint || !e.point) {
                return
            }

            const distance = Math.hypot(
                e.downPoint.x - e.point.x,
                e.downPoint.y - e.point.y
            )

            if (distance < 2) {
                return
            }

            cloneController()

            if (['move', 'clone'].includes(mode.current)) {
                move(e)
            }
            if (mode.current === 'select') {
                rectSelectorController(e)
            }
        }

        tool.onMouseMove = (e: ToolEvent) => {
            if (hightlight.current) hightlight.current.remove()

            const item = canvas.project.getItemByPoint(e.point)

            if (item && !item.actived) {
                hightlight.current =
                    ((item as Path).pathData &&
                        new canvas.Path((item as Path).pathData)) ||
                    new canvas.Path.Rectangle(item.bounds)

                hightlight.current.set({
                    strokeColor: theme.palette.canvas.highlight.border,
                    strokeWidth: 2 / canvas.view.zoom,
                    guide: true
                })
            }
        }

        tool.onMouseUp = (e: ToolEvent) => {
            clonedItems.current = []
            beforePositions.current = []
            selectItems.current = null

            if (moved.current) {
                canvas.fire('object:moved', e)
                moved.current = false
            }

            mode.current = 'select'

            updateAtiveItems()

            tool.paused = false
        }

        tool.onKeyDown = (e: KeyEvent) => {
            if (e.modifiers.alt && mode.current === 'move') {
                mode.current = 'clone'
                cloneController()
            }

            if (e.modifiers.alt && mode.current === 'select') {
                rectSelectorController(e)
            }

            if (['delete', 'backspace'].includes(e.key)) {
                canvas.fire('object:deleted', {
                    items: canvas.project.activeItems.map((item) => {
                        item.data.deleted = true
                        return item
                    })
                })

                canvas.project.activeItems.forEach((item) => item.remove())
                canvas.project.deactivateAll()
            }
        }

        tool.onKeyUp = (e: KeyEvent) => {
            if (!e.modifiers.alt && mode.current === 'clone') {
                mode.current = 'move'
                cloneController()
            } else if (mode.current !== 'move') {
                mode.current = 'select'
            }

            if (mode.current === 'select') {
                rectSelectorController(e)
            }
        }

        canvas.view.on('zoom', () => {
            if (!hightlight.current) return

            hightlight.current.strokeWidth = 2 / canvas.view.zoom
        })
    }, [tool])

    useHotkeys(
        'arrows,shift+arrows',
        (_, e: HotKeysEvent) => {
            arrowMove(e)
        },
        [tool]
    )

    return <SelectorSelect ref={selector}>{children}</SelectorSelect>
}

export default SelectorTool
