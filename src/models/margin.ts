import { isNumber, merge } from 'lodash'

export default class Margin {
    top?: number
    bottom?: number
    left?: number
    right?: number

    constructor()
    constructor(grid: Margin)
    constructor(all: Number)
    constructor(topBottom: number, leftRight: number)
    constructor(top: number, bottom: number, left: number, right: number)
    constructor(top?: any, bottom?: any, left?: any, right?: any) {
        if (isNumber(top)) {
            top = {
                top,
                bottom: (left && bottom) || top,
                left: left || bottom || top,
                right: right || bottom || top
            }
        }

        merge(
            this,
            {
                top: 15,
                bottom: 15,
                left: 15,
                right: 15
            },
            top
        )
    }
}
