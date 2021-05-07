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
        const { canvas } = useContext(EditorContext)
        const group = useRef<paper.Group>(null)
        const activedRects = useRef<paper.Item[]>([])
        const rect = useRef<paper.Path.Rectangle>(null)
        const actives = useRef<paper.Item[]>([])
        const [selector, setSelector] = useState<paper.Selector>(null)
        const clone = useRef<paper.Group>(null)

        useEffect(() => {
            if (!canvas) return

            clone.current = new canvas.Group({
                guide: true
            })

            canvas.view.on('frame', () => {
                if (!isEqual(actives.current, canvas.project.activedItems)) {
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
                        // strokeColor: 'rgba(128, 128, 128, 0.5)',
                        strokeColor: 'red',
                        strokeWidth: 0.5,
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

                        if (canvas.project.activedItems.length > 1) {
                            activedRects.current = canvas.project.activedItems.map(
                                (item) => {
                                    const rect = new canvas.Path.Rectangle(
                                        item.bounds
                                    )
                                    rect.set(selectorStyle)
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

                        group.current.sendToIndex(2)
                    } else {
                        rect.current.angle = selector.angle
                        rect.current.pathData = selector.pathData

                        if (canvas.project.activedItems.length > 1) {
                            canvas.project.activedItems.map((item, index) => {
                                activedRects.current[index] &&
                                    (activedRects.current[index].bounds =
                                        item.bounds)
                            })
                        }
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
