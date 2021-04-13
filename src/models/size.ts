import { isNumber, merge } from 'lodash'

export class Size {
    width: number | undefined
    height: number | undefined

    constructor(size: Size)
    constructor(width: number, height: number)
    constructor(width: any, height?: any) {
        if (isNumber(width)) {
            width = { width, height }
        }
        merge(this, width)
    }
}
