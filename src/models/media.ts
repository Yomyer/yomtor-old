import { isString, merge } from 'lodash'

export const MediaDisplayLabels = {
    initial: 'Stretch',
    cover: 'Fill',
    cibtaub: 'Fit'
}

export type MediaDisplayes = keyof typeof MediaDisplayLabels

export default class Media {
    file: string | undefined
    display?: MediaDisplayes
    opacity?: string

    constructor(media: Media)
    constructor(file: string, display?: MediaDisplayes, opacity?: number)
    constructor(file: any, display?: any, opacity?: any) {
        if (isString(file)) {
            file = { file, display, opacity }
        }
        merge(
            this,
            {
                display: 'initial',
                opacity: 1
            },
            file
        )
    }
}
