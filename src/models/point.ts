import { isNumber, merge } from 'lodash'

export class Point {
    x: number | undefined
    y: number | undefined

    constructor(point: Point)
    constructor(x: number, y: number)
    constructor(x: any, y?: any) {
        if (isNumber(x)) {
            x = { x, y }
        }
        merge(this, x)
    }
}
