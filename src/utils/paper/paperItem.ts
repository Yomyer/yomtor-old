import { isEqual, isUndefined, remove } from 'lodash'
import paper from 'paper'
import { rotatePoint } from '../trigonometryUtils'
import { generateUID } from '../layerUtils'

type CornersNameType =
    | 'topLeft'
    | 'topCenter'
    | 'topRight'
    | 'leftCenter'
    | 'rightCenter'
    | 'bottomLeft'
    | 'bottomCenter'
    | 'bottomRight'
    | 'center'

// eslint-disable-next-line no-unused-vars
export type OpositeCorners = { [key in CornersNameType]: CornersNameType }

export const OpostieCornersName: OpositeCorners = {
    topLeft: 'bottomRight',
    topCenter: 'bottomCenter',
    topRight: 'bottomLeft',
    leftCenter: 'rightCenter',
    rightCenter: 'leftCenter',
    bottomLeft: 'topRight',
    bottomCenter: 'topCenter',
    bottomRight: 'topLeft',
    center: 'center'
}

declare global {
    export namespace paper {
        export interface Item {
            actived: boolean
            blocked: boolean
            guide: boolean
            angle: number
            selector: paper.Selector
            selectionCache: boolean
            uid: string
            scaleWithRotate: (
                factor: paper.Point,
                pivot?: paper.Point,
                center?: paper.Point,
                angle?: number
            ) => void
            superRotate: (angle: number, center: paper.Point) => void
            superExportJSON: (options?: any) => string
            sendToIndex: (index: number) => void
            _initialize: (props: any, point: paper.Point) => boolean
            superInitialize: (props: any, point: paper.Point) => boolean
            superClone: (options?: any) => paper.Item
            _rotate: any
        }
        export interface PaperScope {
            CornersName: CornersNameType
            OpostieCornersName: OpositeCorners
        }
        export type CornersName = CornersNameType
        export type OpostieCornersName = OpositeCorners
    }
}

paper.PaperScope.prototype.OpostieCornersName = OpostieCornersName

paper.Item.prototype.superRotate =
    paper.Item.prototype.superRotate || paper.Item.prototype.rotate

paper.Item.prototype.rotate = function (angle, center) {
    if (!this.angle) this.angle = 0
    this.data.angle += +angle
    paper.Item.prototype.superRotate.call(this, angle, center)
}

paper.Item.prototype.superExportJSON =
    paper.Item.prototype.superExportJSON || paper.Item.prototype.exportJSON

paper.Item.prototype.exportJSON = function (options?: object): string {
    const item = paper.Item.prototype.superExportJSON.call(this, {
        ...options,
        ...{ asString: false }
    }) as any

    item[1].data = {
        ...(item[1].data || {}),
        ...{
            actived: false,
            layer: this.layer.index,
            parent: this.parent.uid,
            index: this.index
        }
    }
    item[1].uid = this.uid

    return JSON.stringify(item)
}

paper.Item.prototype.superInitialize =
    paper.Item.prototype.superInitialize || paper.Item.prototype._initialize

paper.Item.prototype._initialize = function (
    props: any,
    point: paper.Point
): boolean {
    const item = paper.Item.prototype.superInitialize.call(this, props, point)

    if (!props || !props.uid) {
        this.uid = generateUID(16) + this.id
    }

    return item
}

paper.Item.prototype.superClone =
    paper.Item.prototype.superClone || paper.Item.prototype.clone

paper.Item.prototype.clone = function (options?: any): paper.Item {
    const cloned = paper.Item.prototype.superClone.call(this, options)

    if (!options || !options.keep) {
        cloned.uid = generateUID(16) + this.id
    } else {
        cloned.uid = this.uid
    }

    return cloned
}

paper.Item.prototype.sendToIndex = function (index: number) {
    this.layer.insertChild(index, this)
}

paper.Item.prototype.scaleWithRotate = function (
    factor: paper.Point,
    pivot?: paper.Point,
    center?: paper.Point,
    angle?: number
) {
    center = center || this.bounds.center
    pivot = pivot || center
    angle = (isUndefined(angle) && this.angle) || 0

    if (this.angle !== angle) {
        this.angle = 0
    }

    pivot = rotatePoint(pivot, center, -angle)

    this.rotate(-angle, center)
    this.scale(factor.x, factor.y, pivot)
    this.rotate(angle, center)
}

Object.defineProperty(paper.Item.prototype, 'selectionCache', {
    get: function () {
        return this.data.selectionCache === 'undefined'
            ? this.data.selectionCache
            : true
    },
    set: function (selectionCache: number) {
        this.data.selectionCache = selectionCache
    },
    enumerable: false,
    configurable: true
})

Object.defineProperty(paper.Item.prototype, 'angle', {
    get: function () {
        return this.data.angle
    },
    set: function (angle: number) {
        this.data.angle = angle
    },
    enumerable: false,
    configurable: true
})

Object.defineProperty(paper.Item.prototype, 'actived', {
    get: function () {
        return this.data.actived
    },
    set: function (status: boolean) {
        ;(!status && remove(this.project.activedItems, this)) ||
            (!this.project.activedItems.includes(this) &&
                this.project.activedItems.push(this))
        this.data.actived = status
    },
    enumerable: false,
    configurable: true
})

Object.defineProperty(paper.Item.prototype, 'guide', {
    get: function () {
        return this._guide
    },
    set: function (status: boolean) {
        this.project.guides.addChild(this)
        this._guide = status
    },
    enumerable: false,
    configurable: true
})

Object.defineProperty(paper.Item.prototype, 'selector', {
    get: function () {
        const cache = {
            area: this.bounds.area,
            centerX: this.bounds.centerX,
            centerY: this.bounds.centerY,
            topLeft: this.bounds.topLeft
        }

        if (this._selector && isEqual(cache, this._cacheBounds)) {
            return this._selector
        }

        this._cacheBounds = cache

        let item = this
        if (this.children && this.children.length === 1) {
            item = this.firstChild
        }

        const scope = item.project._scope
        const angle = item.angle || 0

        item.set({ rotation: -angle })
        const rectangle = new paper.Rectangle(item.bounds)
        const path: paper.Path = new paper.Path.Rectangle(rectangle)

        const center = path.bounds.center
        const topLeft = rotatePoint(path.bounds.topLeft, center, angle)
        const topCenter = rotatePoint(
            path.bounds.topLeft.add(new paper.Point(path.bounds.width / 2, 0)),
            center,
            angle
        )
        const topRight = rotatePoint(path.bounds.topRight, center, angle)
        const leftCenter = rotatePoint(
            path.bounds.topLeft.add(new paper.Point(0, path.bounds.height / 2)),
            center,
            angle
        )
        const rightCenter = rotatePoint(
            path.bounds.topRight.add(
                new paper.Point(0, path.bounds.height / 2)
            ),
            center,
            angle
        )
        const bottomLeft = rotatePoint(path.bounds.bottomLeft, center, angle)
        const bottomCenter = rotatePoint(
            path.bounds.bottomLeft.add(
                new paper.Point(path.bounds.width / 2, 0)
            ),
            center,
            angle
        )
        const bottomRight = rotatePoint(path.bounds.bottomRight, center, angle)

        path.set({ rotation: angle, visible: false })
        item.set({ rotation: angle })

        const pathData = path.pathData
        const segments = path.segments
        this._selector = {
            points: {
                topLeft,
                topCenter,
                topRight,
                leftCenter,
                rightCenter,
                bottomLeft,
                bottomCenter,
                bottomRight,
                center: center
            },
            position: path.position,
            pathData,
            segments,
            angle,
            bounds: path.bounds,
            item,
            size: new scope.Size(rectangle.width, rectangle.height)
        }

        path.remove()

        return this._selector
    },
    enumerable: false,
    configurable: true
})
