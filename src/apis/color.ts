import { isString } from 'lodash'

type RGBA = {
    r?: number
    g?: number
    b?: number
    a?: number
}

export const componentToHex = (c?: number): string => {
    if (c !== null && c !== undefined) {
        const hex = c.toString(16)
        return hex.length === 1 ? '0' + hex : hex
    }

    return ''
}

export const normalizeHEX = (hex: string): string => {
    hex = hex.replace('#', '').toLocaleLowerCase()

    if ([3, 4].includes(hex.length)) {
        return hex
            .split('')
            .map(function (h) {
                return h + h
            })
            .join('')
    }

    return hex
}

export const RGBAToHEX = (rgba: RGBA): string => {
    return (
        componentToHex(rgba.r) +
        componentToHex(rgba.g) +
        componentToHex(rgba.b) +
        componentToHex((rgba.a && +(rgba.a * 255).toFixed(0)) || undefined)
    )
}

export const HEXToRGBA = (hex: string): RGBA => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(
        hex
    )

    const rgba: RGBA = {}

    if (result) {
        rgba.r = parseInt(result[1], 16)
        rgba.g = parseInt(result[2], 16)
        rgba.b = parseInt(result[3], 16)
        rgba.a = isString(result[4])
            ? parseFloat((parseInt(result[4], 16) / 255).toFixed(2))
            : 1
    }

    return rgba
}
