function clamp(value: any, min = 0, max = 1) {
    return Math.min(Math.max(min, value), max)
}

export function hexToRgb(color: string): string {
    color = color.substr(1)

    const re = new RegExp(`.{1,${color.length >= 6 ? 2 : 1}}`, 'g')
    let colors = color.match(re)

    if (colors && colors[0].length === 1) {
        colors = colors.map((n: any) => n + n)
    }

    return colors
        ? `rgb${colors.length === 4 ? 'a' : ''}(${colors
              .map((n: any, index: number) => {
                  return index < 3
                      ? parseInt(n, 16)
                      : Math.round((parseInt(n, 16) / 255) * 1000) / 1000
              })
              .join(', ')})`
        : ''
}

function intToHex(int: number) {
    const hex = int.toString(16)
    return hex.length === 1 ? `0${hex}` : hex
}

export function rgbToHex(color: string): string {
    if (color.indexOf('#') === 0) {
        return color
    }

    const { values } = decomposeColor(color)
    return `#${values.map((n: number) => intToHex(n)).join('')}`
}

export function hslToRgb(color: any): string {
    color = decomposeColor(color)
    const { values } = color
    const h = values[0]
    const s = values[1] / 100
    const l = values[2] / 100
    const a = s * Math.min(l, 1 - l)
    const f = (n: number, k = (n + h / 30) % 12) =>
        l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)

    let type = 'rgb'
    const rgb = [
        Math.round(f(0) * 255),
        Math.round(f(8) * 255),
        Math.round(f(4) * 255)
    ]

    if (color.type === 'hsla') {
        type += 'a'
        rgb.push(values[3])
    }

    return recomposeColor({ type, values: rgb })
}

export type DecomposedColor = {
    type?: string
    values?: number[]
    colorSpace?: any
}

export function decomposeColor(color: DecomposedColor): DecomposedColor
export function decomposeColor(color: string): DecomposedColor
export function decomposeColor(color: any): DecomposedColor {
    if (color.type) {
        return color
    }

    if (color.charAt(0) === '#') {
        return decomposeColor(hexToRgb(color))
    }

    const marker = color.indexOf('(')
    const type = color.substring(0, marker)

    if (['rgb', 'rgba', 'hsl', 'hsla', 'color'].indexOf(type) === -1) {
        throw new Error(
            `Unsupported ${color} color. The following formats are supported: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla(), color().`
        )
    }

    let values = color.substring(marker + 1, color.length - 1)
    let colorSpace

    if (type === 'color') {
        values = values.split(' ')
        colorSpace = values.shift()
        if (values.length === 4 && values[3].charAt(0) === '/') {
            values[3] = values[3].substr(1)
        }
        if (
            [
                'srgb',
                'display-p3',
                'a98-rgb',
                'prophoto-rgb',
                'rec-2020'
            ].indexOf(colorSpace) === -1
        ) {
            throw new Error(
                `Material-UI: unsupported ${colorSpace} color space. The following color spaces are supported: srgb, display-p3, a98-rgb, prophoto-rgb, rec-2020.`
            )
        }
    } else {
        values = values.split(',')
    }
    values = values.map((value: string) => parseFloat(value))

    return { type, values, colorSpace }
}

export function recomposeColor(color: DecomposedColor): string
export function recomposeColor(color: any): string {
    const { type, colorSpace } = color
    let { values } = color

    if (type.indexOf('rgb') !== -1) {
        // Only convert the first 3 values to int (i.e. not alpha)
        values = values.map((n: string, i: number) =>
            i < 3 ? parseInt(n, 10) : n
        )
    } else if (type.indexOf('hsl') !== -1) {
        values[1] = `${values[1]}%`
        values[2] = `${values[2]}%`
    }
    if (type.indexOf('color') !== -1) {
        values = `${colorSpace} ${values.join(' ')}`
    } else {
        values = `${values.join(', ')}`
    }

    return `${type}(${values})`
}

export function getContrastRatio(
    foreground: string,
    background: string
): number {
    const lumA = getLuminance(foreground)
    const lumB = getLuminance(background)
    return (Math.max(lumA, lumB) + 0.05) / (Math.min(lumA, lumB) + 0.05)
}

export function getLuminance(color: string): number
export function getLuminance(color: DecomposedColor): number
export function getLuminance(color: any): number {
    color = decomposeColor(color)

    let rgb =
        color.type === 'hsl'
            ? decomposeColor(hslToRgb(color)).values
            : color.values
    rgb = rgb.map((val: number) => {
        if (color.type !== 'color') {
            val /= 255
        }
        return val <= 0.03928 ? val / 12.92 : ((val + 0.055) / 1.055) ** 2.4
    })

    return Number(
        (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]).toFixed(3)
    )
}

export function emphasize(color: string, coefficient = 0.15): string {
    return getLuminance(color) > 0.5
        ? darken(color, coefficient)
        : lighten(color, coefficient)
}

export function alpha(color: string, value: number): string
export function alpha(color: DecomposedColor, value: number): string
export function alpha(color: any, value: number): string {
    color = decomposeColor(color)
    value = clamp(value)

    if (color.type === 'rgb' || color.type === 'hsl') {
        color.type += 'a'
    }
    if (color.type === 'color') {
        color.values[3] = `/${value}`
    } else {
        color.values[3] = value
    }

    return recomposeColor(color)
}

let warnedOnce = false

export function fade(color: string, value: number): string {
    if (process.env.NODE_ENV !== 'production') {
        if (!warnedOnce) {
            warnedOnce = true
            console.error(
                [
                    'Material-UI: The `fade` color utility was renamed to `alpha` to better describe its functionality.',
                    '',
                    "You should use `import { alpha } from '@material-ui/core/styles'`"
                ].join('\n')
            )
        }
    }

    return alpha(color, value)
}

export function darken(color: string, coefficient: number): string
export function darken(color: DecomposedColor, coefficient: number): string
export function darken(color: any, coefficient: number): string {
    color = decomposeColor(color)
    coefficient = clamp(coefficient)

    if (color.type.indexOf('hsl') !== -1) {
        color.values[2] *= 1 - coefficient
    } else if (
        color.type.indexOf('rgb') !== -1 ||
        color.type.indexOf('color') !== -1
    ) {
        for (let i = 0; i < 3; i += 1) {
            color.values[i] *= 1 - coefficient
        }
    }
    return recomposeColor(color)
}

export function lighten(color: string, coefficient: number): string
export function lighten(color: DecomposedColor, coefficient: number): string
export function lighten(color: any, coefficient: number): string {
    color = decomposeColor(color)
    coefficient = clamp(coefficient)

    if (color.type.indexOf('hsl') !== -1) {
        color.values[2] += (100 - color.values[2]) * coefficient
    } else if (color.type.indexOf('rgb') !== -1) {
        for (let i = 0; i < 3; i += 1) {
            color.values[i] += (255 - color.values[i]) * coefficient
        }
    } else if (color.type.indexOf('color') !== -1) {
        for (let i = 0; i < 3; i += 1) {
            color.values[i] += (1 - color.values[i]) * coefficient
        }
    }

    return recomposeColor(color)
}
