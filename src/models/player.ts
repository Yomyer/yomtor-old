import Color from './color'
import Point from './point'

export default class Player {
    id?: string | undefined
    color?: Color | undefined
    name?: string | undefined
    surname?: string | undefined
    point?: Point | undefined
    selectedItems?: number[]
    changes: []

    constructor(object: Player = { changes: [] }) {
        Object.assign(this, object)
    }
}
