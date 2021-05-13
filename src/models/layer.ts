import { isString, merge } from 'lodash'
import { generateUID, generateMachine } from '../utils/layerUtils'
import { Point } from './point'
import { Size } from './size'

export const LayerTypeLabels = {
    layer: 'Layer',
    artboard: 'Artboard',
    cover: 'Cover',
    page: 'Page',
    group: 'Group'
}

export type LayerTypes = keyof typeof LayerTypeLabels

export class Layer {
    id?: any
    type?: LayerTypes
    name: string | undefined
    machine?: string
    parent?: any
    position?: Point
    size?: Size
    offset?: Point
    rotate?: number
    params?: { [key: string]: any }
    temps?: { [key: string]: any }
    visible?: boolean
    lock?: boolean

    constructor(layer: Layer)
    constructor(name: string, position: Point, size: Size, type?: LayerTypes)
    constructor(name: any, position?: any, size?: any, type?: any) {
        if (isString(name)) {
            name = { name, position, size, type }
        }
        merge(
            this,
            {
                id: generateUID(),
                type: 'layer',
                machine: generateMachine(name.name),
                visible: true,
                lock: false,
                rotate: 0,
                params: {},
                temps: {},
                offset: { x: 0, y: 0 }
            },
            name
        )

        this.position =
            (this.position instanceof Point && this.position) ||
            (this.position && new Point(this.position))
        this.offset =
            (this.offset instanceof Point && this.offset) ||
            new Point((this.offset && this.offset) || { x: 0, y: 0 })
        this.size =
            (this.size instanceof Size && this.size) ||
            (this.size && new Size(this.size))
    }
}
