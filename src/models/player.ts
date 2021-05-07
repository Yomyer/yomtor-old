import { Color, Point } from '.'

export class Player {
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
