import { isNumber, merge, isString } from 'lodash'
import { RGBAToHEX, HEXToRGBA, normalizeHEX } from '../apis/color'

export class Color {
    r?: number
    g?: number
    b?: number
    a?: number
    hex?: string

    constructor(color: Color)
    constructor(hex: string)
    constructor(r: number, g: number, b: number, a?: number)
    constructor(r: any, g?: any, b?: any, a?: any) {
        if (isString(r)) {
            const hex = normalizeHEX(r)
            r = { ...HEXToRGBA(hex), hex }
        }
        if (isNumber(r)) {
            r = { r, g, b, a }
        }

        merge(this, r)

        this.hex = this.hex || RGBAToHEX(this)
        this.a = isNumber(this.a) ? this.a : 1
    }
}
