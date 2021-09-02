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
    const [tool, setTool] = useState<paper.Tool>()
    const hightlight = useRef<paper.Item>(null)
    const selector = useRef<paper.Group>(null)
    const mode = useRef<string>('select')
    const activedItems = useRef<paper.Item[]>([])
    const clonedItems = useRef<paper.Item[]>([])
    const selectRect = useRef<paper.Path.Rectangle>(null)
    const beforePositions = useRef<paper.Point[]>([])

    const isActiveItemsUpdated = (): boolean => {
        return isEqual(
            activedItems.current.map((item) => item.uid),
            canvas.project.activedItems.map((item) => item.uid)
        )
    }
    const updateAtiveItems = () => {
        activedItems.current = [...canvas.project.activedItems]
    }

    const setBeforePositions = () => {
        if (!beforePositions.current.length) {
            beforePositions.current = canvas.project.activedItems.map(
                (item) => item.position
            )
        }
    }

    const cloneController = () => {
        if (mode.current === 'clone') {
            if (!clonedItems.current.length) {
                activedItems.current = [...canvas.project.activedItems]
                clonedItems.current = canvas.project.activedItems.map((item) =>
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

    const rectSelectorController = (e: paper.KeyEvent | paper.ToolEvent) => {
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
                match: (item: paper.Item) => {
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
            }
        }
    }
    const move = useCallback(
        (e: any) => {
            canvas.project.activedItems.forEach((item) => {
                item.position = item.position.add(e.delta)
            })

            if (mode.current === 'move') {
                canvas.fire('object:moving', e)
            }
        },
        [canvas]
    )

    const arrowMove = useCallback(
        (e: HotKeysEvent) => {
            if (
                tool &&
                tool.activatedMain &&
                canvas.project.activedItems.length &&
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
                    ...{ items: canvas.project.activedItems }
                })
                updateAtiveItems()
            }
            mode.current = ['move', 'clone'].includes(beforeMode)
                ? beforeMode
                : 'none'
        }

        tool.onDeactivate = () => {
            beforeMode = mode.current
            mode.current = 'none'
            cloneController()

            updateAtiveItems()
        }

        tool.onMouseDown = (e: paper.ToolEvent) => {
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

                const updated = canvas.project.activedItems.length
                    ? 'updated'
                    : 'created'

                if (!e.modifiers.shift && (!item || (item && !item.actived))) {
                    canvas.project.deactivateAll()
                }

                if (item) {
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

                console.log(item)
            }
        }

        tool.onMouseDrag = (e: paper.ToolEvent) => {
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

        tool.onMouseMove = (e: paper.ToolEvent) => {
            if (hightlight.current) hightlight.current.remove()

            const item = canvas.project.getItemByPoint(e.point)

            if (item && !item.actived) {
                hightlight.current =
                    ((item as paper.Path).pathData &&
                        new canvas.Path((item as paper.Path).pathData)) ||
                    new canvas.Path.Rectangle(item.bounds)

                hightlight.current.set({
                    strokeColor: theme.palette.canvas.highlight.border,
                    strokeWidth: 2 / canvas.view.zoom,
                    guide: true
                })
            }
        }

        tool.onMouseUp = (e: paper.ToolEvent) => {
            clonedItems.current = []
            beforePositions.current = []

            canvas.fire('selection:modified', e)
            canvas.fire('object:moved', e)

            mode.current = 'select'

            updateAtiveItems()
        }

        tool.onKeyDown = (e: paper.KeyEvent) => {
            if (e.modifiers.alt && mode.current === 'move') {
                mode.current = 'clone'
                cloneController()
            }

            if (e.modifiers.alt && mode.current === 'select') {
                rectSelectorController(e)
            }

            if (['delete', 'backspace'].includes(e.key)) {
                canvas.fire('object:deleted', {
                    items: canvas.project.activedItems.map((item) => {
                        item.data.deleted = true
                        return item
                    })
                })

                canvas.project.activedItems.forEach((item) => item.remove())
                canvas.project.deactivateAll()
            }
        }

        tool.onKeyUp = (e: paper.KeyEvent) => {
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
