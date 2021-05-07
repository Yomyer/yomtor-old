import { Color } from '../models'
import { mergeObjects } from './lodashUtils'

test('Merge multiple objects', () => {
    const a = new Color('#000')
    const b = new Color('#000')
    const c = new Color('#FFF')

    const result = mergeObjects({ colors: [a, b, c] })
    expect(result).toMatchObject({ colors: [a, c] })

    const result2 = mergeObjects({ colors: [a, b, c] }, { colors: [c, b] })
    expect(result2).toMatchObject({ colors: [a, c] })
})
