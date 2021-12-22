import {
    Artboard,
    ControlItem,
    Group,
    Item,
    KeyEvent,
    Path,
    Point,
    Rectangle,
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
import { setCursor, clearCursor } from '../../utils/cursorUtils'
import { useHotkeys, HotKeysEvent } from '../../uses/useHokeys'
import EditorContext from '../EditorContext'
import Clone from '../icons/cursor/Clone'
import Default from '../icons/cursor/Default'
import ControlsTool from './ControlsTool'
import { round } from '../../utils/mathUtils'

const SelectorTool: React.FC = (/* { children } */) => {
    const { canvas, theme } = useContext(EditorContext)
    const [tool, setTool] = useState<Tool>()
    const selector = useRef<Group>(null)
    const mode = useRef<string>('select')
    const activedItems = useRef<Item[]>([])
    const clonedItems = useRef<Item[]>([])
    const selectRect = useRef<Path>(null)
    const moved = useRef<boolean>(false)
    const selectItems = useRef<Item[]>(null)
    const mouseEvent = useRef<ToolEvent>(null)
    const beforePositions = useRef<{ [key: string]: Point }>({})
    const startInArtboard = useRef<boolean>(false)

    const compareToItemList = (a: Item[], b: Item[]): boolean => {
        return isEqual(
            (a || []).map((item) => item.uid).sort(),
            (b || []).map((item) => item.uid).sort()
        )
    }

    const isActiveItemsUpdated = (): boolean => {
        return compareToItemList(
            activedItems.current,
            canvas.project.activeItems
        )
    }
    const updateAtiveItems = () => {
        activedItems.current = [...canvas.project.activeItems]
    }

    const setBeforePositions = () => {
        beforePositions.current = canvas.project.activeItems.reduce(
            (positions, item) => {
                if (!positions[item.uid]) {
                    positions[item.uid] = item.position.clone()
                }

                return positions
            },
            beforePositions.current
        )
    }

    const cloneController = () => {
        if (mode.current === 'clone') {
            canvas.project.clearHighlightedItem()

            if (!clonedItems.current.length) {
                clonedItems.current = canvas.project.activeItems.map((item) => {
                    const cloned = item.clone()
                    beforePositions.current[cloned.uid] =
                        beforePositions.current[item.uid]
                    return cloned
                })

                canvas.project.deactivateAll()
                clonedItems.current.forEach((item) =>
                    item.set({ actived: true })
                )

                if (Object.keys(beforePositions.current).length) {
                    activedItems.current.forEach(
                        (item) =>
                            (item.position = beforePositions.current[item.uid])
                    )

                    canvas.fire('object:created', {
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

                canvas.fire('object:deleted', {
                    items: activedItems.current
                })
            }
        }
    }
    const hightlightController = (e?: ToolEvent) => {
        if (selectRect.current) return
        if (!e) e = mouseEvent.current
        if (!e) return

        const item = canvas.project.getItemByPoint(e.point, {
            legacy: e.modifiers.meta
        })

        if (item && !clonedItems.current.length) {
            item.highlighted = true
            canvas.fire('hightlight:created')
        } else {
            canvas.project.highlightedItem &&
                (canvas.project.highlightedItem.highlighted = false)
            canvas.fire('hightlight:cleared')
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

            selectRect.current.removeOn({
                up: true,
                drag: true
            })
        }

        if (selectRect.current) {
            const itemMatch = {
                class: canvas.Item,
                inside: e.modifiers.alt && selectRect.current.bounds,
                overlapping: !e.modifiers.alt && selectRect.current.bounds,
                match: (item: Item) => {
                    if (item.artboard && item.artboard.actived) {
                        return false
                    }

                    if (item.className === 'Group') {
                        const children = item.getItems({
                            class: canvas.Item,
                            overlapping: selectRect.current.bounds
                        })
                        return !!children.length
                    }

                    if (item.parent && item.parent.className === 'Group') {
                        return false
                    }

                    return !item.guide && !(item instanceof Artboard)
                }
            }
            const artboardMatch = {
                class: canvas.Artboard,
                inside: selectRect.current.bounds
            }

            if (selectRect.current.layer) {
                const items = canvas.project.activeLayer
                    .getItems(artboardMatch)
                    .concat(canvas.project.activeLayer.getItems(itemMatch))

                canvas.project.deactivateAll()

                const deactives = e.modifiers.shift
                    ? intersectionWith(
                          items,
                          activedItems.current,
                          (a: Item, b: Item) => a.uid === b.uid
                      )
                    : []

                const actives = e.modifiers.shift
                    ? differenceWith(
                          activedItems.current.concat(items),
                          deactives,
                          (a: Item, b: Item) => a.uid === b.uid
                      )
                    : activedItems.current.concat(items)

                if (!compareToItemList(actives, canvas.project.activeItems)) {
                    actives.forEach((item) => (item.actived = true))
                    deactives.forEach((item) => (item.actived = false))
                }

                if (e.modifiers.shift && selectItems.current === null) {
                    selectItems.current = [...canvas.project.activeItems]
                }

                if (
                    !compareToItemList(
                        selectItems.current,
                        canvas.project.activeItems
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
        (e: ToolEvent | HotKeysEvent) => {
            canvas.project.activeItems.forEach((item) => {
                let position = item.position.add(e.delta)

                if (e instanceof ToolEvent) {
                    if (beforePositions.current[item.uid]) {
                        position = beforePositions.current[item.uid].add(
                            round(e.point.subtract(e.downPoint))
                        )
                    }
                }

                item.position = position
            })

            if (e instanceof ToolEvent) {
                const artboard = canvas.project.hitTest(e.point, {
                    fill: true,
                    stroke: false,
                    legacy: true,
                    class: Artboard
                })
                let inserted = false

                canvas.project.activeItems.forEach((item) => {
                    if (!(item instanceof Artboard)) {
                        if (
                            (artboard && !item.artboard) ||
                            (artboard && artboard.item !== item.artboard)
                        ) {
                            artboard.item.insertChild(
                                artboard.item.children.length + 1,
                                item
                            )
                            inserted = item.actived = true
                        } else if (
                            !artboard &&
                            item.artboard &&
                            (startInArtboard.current ||
                                !item.intersects(item.artboard))
                        ) {
                            item.artboard.parent.insertChild(
                                item.artboard.parent.children.length + 1,
                                item
                            )
                            inserted = item.actived = true
                        }
                    }
                })

                if (inserted) {
                    canvas.fire('object:created')
                }
            }

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
                setBeforePositions()
                updateAtiveItems()
            }
            mode.current = ['move', 'clone'].includes(beforeMode)
                ? beforeMode
                : 'none'

            tool.paused = false
        }

        tool.onDeactivate = () => {
            beforePositions.current = {}
            beforeMode = mode.current
            mode.current = 'none'
            cloneController()
        }

        tool.onDoubleClick = (e: ToolEvent) => {
            if (e.item) {
                e.item = canvas.project.getItem({
                    overlapping: new Rectangle(e.point),
                    actived: true
                })

                if (e.item) {
                    canvas.fire('edit', e)
                }
            }
        }

        tool.onMouseDown = (e: ToolEvent) => {
            if (!tool.actived) return
            let action = null
            mode.current = 'select'

            // Todo aquí verificamos si hace click en un control :D
            if (selector.current) {
                action = selector.current.hitTest(e.downPoint, {
                    stroke: false,
                    fill: true
                })
                mode.current = 'action'
            }
            if (!action) {
                const item = canvas.project.getItemByPoint(e.downPoint, {
                    legacy: e.modifiers.meta
                })

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

                    mode.current = 'move'
                    if (e.modifiers.alt) {
                        mode.current = 'clone'
                    }

                    if (!isActiveItemsUpdated()) {
                        canvas.fire(`selection:${updated}`, e)
                    }

                    setBeforePositions()
                    updateAtiveItems()

                    startInArtboard.current = !!canvas.project.hitTest(
                        e.downPoint,
                        {
                            fill: true,
                            stroke: false,
                            legacy: true,
                            class: Artboard
                        }
                    )
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

            if (distance < 2 / canvas.view.zoom) {
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
            if (e.item instanceof ControlItem) return

            hightlightController(e)

            mouseEvent.current = e

            if (
                e.modifiers.alt &&
                mouseEvent.current &&
                mouseEvent.current.item
            ) {
                setCursor(Default, 0, Clone)
            } else {
                clearCursor(Default, 0, Clone)
            }
        }

        tool.onMouseUp = (e: ToolEvent) => {
            clonedItems.current = []
            beforePositions.current = {}
            selectItems.current = null
            selectRect.current = null

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
                let items = [...canvas.project.activeItems]

                items.forEach((item) => item.remove())
                canvas.fire('selection:cleared', { items })

                canvas.fire('object:deleted', {
                    items: items.map((item) => {
                        item.data.deleted = true
                        return item
                    })
                })

                items = null
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
    }, [tool])

    useHotkeys(
        'arrows,shift+arrows',
        (_, e: HotKeysEvent) => {
            arrowMove(e)
        },
        [tool]
    )

    useHotkeys(
        '*+cmd',
        () => hightlightController(),
        () => hightlightController(),
        [tool]
    )

    useHotkeys(
        '*+alt',
        () => {
            if (
                mouseEvent.current &&
                mouseEvent.current.item &&
                !selectRect.current
            ) {
                setCursor(Default, 0, Clone)
            }
        },
        () => {
            clearCursor(Default, 0, Clone)
        },
        [tool]
    )

    return <ControlsTool />
}

export default SelectorTool
