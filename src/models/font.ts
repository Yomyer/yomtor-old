import { isString, merge } from 'lodash'

export const FontStyleLabels = {
    '100': 'Extra Light',
    '100i': 'Extra Light Italic',
    '200': 'Light',
    '200i': 'Light Italic',
    '300': 'Book',
    '300i': 'Book Italic',
    '400': 'Regular',
    '400i': 'Italic',
    '500': 'Medium',
    '500i': 'Medium Italic',
    '600': 'Semibold',
    '600i': 'Semibold Italic',
    '700': 'Bold',
    '700i': 'Bold Italic',
    '800': 'Black',
    '800i': 'Black Italic',
    '900': 'Extra Black',
    '900i': 'Extra Black Italic'
}

export type FontStyles = keyof typeof FontStyleLabels

export class Font {
    name: string | undefined
    url: string | undefined
    styles: FontStyles[] | undefined

    constructor(font: Font)
    constructor(name: string, url: string, styles: FontStyles[])
    constructor(name: any, url?: any, styles?: any) {
        if (isString(name)) {
            name = { name, url, styles }
        }

        merge(this, name)
    }
}
