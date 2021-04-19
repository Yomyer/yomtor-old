import paper from 'paper'

interface Selector extends paper.Path.Rectangle {
    _class: string
}

const addActionRect = function (point: paper.Point) {
    const rect = new paper.Path.Rectangle({
        size: 7,
        point: point.subtract(3.5),
        fillColor: 'white',
        strokeColor: 'rgba(0, 0, 0, 0.7)',
        strokeWidth: 0.2,
        shadowColor: 'rgba(0, 0, 0, 0.3)',
        shadowBlur: 2,
        shadowOffset: 1,
        guide: true
    })

    return rect
}

const Selector = (function ({ ...args }) {
    const rect = new paper.Path.Rectangle({ ...args }) as Selector
    rect._class = 'Selector'

    rect.set({
        strokeColor: 'rgba(128, 128, 128, 0.5)',
        strokeWidth: 0.5,
        fillColor: 'transparent',
        guide: true
    })

    const tl = addActionRect(rect.bounds.topLeft)
    const tc = addActionRect(rect.bounds.topCenter)
    const tr = addActionRect(rect.bounds.topRight)
    const lc = addActionRect(rect.bounds.leftCenter)
    const rc = addActionRect(rect.bounds.rightCenter)
    const bl = addActionRect(rect.bounds.bottomLeft)
    const bc = addActionRect(rect.bounds.bottomCenter)
    const br = addActionRect(rect.bounds.bottomRight)

    const group = new paper.Group([rect, tl, tc, tr, lc, rc, bl, bc, br])
    group.guide = true

    return group
} as any) as { new (...args: any): Selector }

export default Selector
