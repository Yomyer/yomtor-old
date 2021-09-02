import { isEqual } from 'lodash'
import React, {
    forwardRef,
    MutableRefObject,
    useContext,
    useEffect,
    useRef,
    useState
} from 'react'

import { EditorContext } from '../../Yomtor'

const SelectorSelect = forwardRef<paper.Group, { children: React.ReactNode }>(
    ({ children }, ref) => {
        const { canvas, theme } = useContext(EditorContext)
        const [selector, setSelector] = useState<paper.Selector>(null)
        const [, updateState] = useState<any>()

        const group = useRef<paper.Group>(null)
        const activedRects = useRef<paper.Item[]>([])
        const rect = useRef<paper.Path.Rectangle>(null)
        const actives = useRef<paper.Item[]>([])
        const clone = useRef<paper.Group>(null)

        useEffect(() => {
            if (!canvas) return

            clone.current = new canvas.Group({
                guide: true
            })

            canvas.view.on('zoom', () => {
                updateState({})
            })

            canvas.view.on('frame', () => {
                if (
                    !isEqual(actives.current, canvas.project.activedItems) &&
                    canvas.mainTool.actived
                ) {
                    activedRects.current = []
                    group.current && group.current.remove()
                    group.current = null
                    actives.current = [...canvas.project.activedItems]
                    setSelector(null)
                }

                if (
                    canvas.project.activedItems.length &&
                    !canvas.project.insertMode
                ) {
                    const selectorStyle = {
                        strokeColor: theme.palette.canvas.selected.border,
                        strokeWidth: 0.5 / canvas.view.zoom,
                        guide: true
                    }

                    clone.current.addChildren(
                        canvas.project.activedItems.map((item) => {
                            return item.clone({ insert: false })
                        })
                    )
                    const selector = clone.current.selector

                    clone.current.removeChildren()

                    if (!group.current) {
                        rect.current = new canvas.Path.Rectangle(selector)
                        rect.current.set(selectorStyle)

                        if (
                            canvas.project.activedItems.length > 1 &&
                            canvas.project.activedItems.length < 200
                        ) {
                            activedRects.current = canvas.project.activedItems.map(
                                (item) => {
                                    const rect =
                                        (item instanceof canvas.Path &&
                                            new canvas.Path(
                                                (item as paper.Path).pathData
                                            )) ||
                                        new canvas.Path.Rectangle(item.bounds)

                                    rect.set({
                                        ...selectorStyle,
                                        ...{
                                            strokeColor:
                                                theme.palette.canvas.highlight
                                                    .border
                                        }
                                    })
                                    return rect
                                }
                            )
                        }
                        group.current = new canvas.Group([
                            rect.current,
                            ...activedRects.current
                        ]).set({
                            guide: true
                        })

                        group.current.bringToFront()
                    } else {
                        rect.current.angle = selector.angle
                        rect.current.pathData = selector.pathData
                        rect.current.strokeWidth = 0.5 / canvas.view.zoom

                        if (
                            canvas.project.activedItems.length > 1 &&
                            canvas.project.activedItems.length < 200
                        ) {
                            canvas.project.activedItems.map((item, index) => {
                                if (activedRects.current[index]) {
                                    if (
                                        activedRects.current[index] instanceof
                                            canvas.Path &&
                                        item instanceof canvas.Path
                                    ) {
                                        ;(activedRects.current[
                                            index
                                        ] as paper.Path).pathData =
                                            item.pathData
                                    } else {
                                        activedRects.current[index].bounds =
                                            item.bounds
                                    }

                                    activedRects.current[index].strokeWidth =
                                        0.5 / canvas.view.zoom
                                }
                            })
                        }
                        group.current.bringToFront()
                    }

                    setSelector(selector)
                }
                canvas.project.selectorItem = rect.current
                ;(ref as MutableRefObject<paper.Group>).current = group.current
            })
        }, [canvas])

        return (
            <>
                {React.Children.map(children, (child: any) =>
                    React.cloneElement(child, {
                        group,
                        selector
                    })
                )}
            </>
        )
    }
)

export default SelectorSelect
