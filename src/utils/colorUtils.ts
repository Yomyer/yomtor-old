import { Color } from '../models'

export const colorWord = (word: string): Color => {
    let hash = 0
    for (let i = 0; i < word.length; i++) {
        hash = word.charCodeAt(i) + ((hash << 5) - hash)
    }

    return new Color({ hue: hash % 360, saturation: 0.7, lightness: 0.5 })
}
