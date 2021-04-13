import { Color } from './color'

test('Create a Color with HEX', () => {
    expect(new Color('#0000FFe6')).toMatchObject({
        r: 0,
        g: 0,
        b: 255,
        a: 0.9,
        hex: '0000ffe6'
    })
})

test('Create a Color with small HEX', () => {
    expect(new Color('#fff0')).toMatchObject({
        r: 255,
        g: 255,
        b: 255,
        a: 0,
        hex: 'ffffff00'
    })
})

test('Create a Color with small HEX', () => {
    expect(new Color('#fff')).toMatchObject({
        r: 255,
        g: 255,
        b: 255,
        a: 1,
        hex: 'ffffff'
    })
})

test('Create a Color with RGBA', () => {
    expect(new Color(0, 0, 255)).toMatchObject({
        r: 0,
        g: 0,
        b: 255,
        a: 1,
        hex: '0000ff'
    })
})

test('Create a Color with COLOR', () => {
    expect(new Color({ r: 0, g: 0, b: 255 })).toMatchObject({
        r: 0,
        g: 0,
        b: 255,
        a: 1,
        hex: '0000ff'
    })
})
