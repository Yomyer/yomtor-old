import { HEXToRGBA, normalizeHEX, RGBAToHEX } from './color'

it('Normalice HEX', () => {
    expect(normalizeHEX('#000')).toStrictEqual('000000')
    expect(normalizeHEX('#FFF')).toStrictEqual('ffffff')
    expect(normalizeHEX('#FFF0')).toStrictEqual('ffffff00')
})

test('HEX to RGBA', () => {
    expect(HEXToRGBA('#0000FFe6')).toStrictEqual({ r: 0, g: 0, b: 255, a: 0.9 })
    expect(HEXToRGBA('#FF0000')).toStrictEqual({ r: 255, g: 0, b: 0, a: 1 })
})

test('RGBA to HEX', () => {
    expect(RGBAToHEX({ r: 0, g: 0, b: 255, a: 0.9 })).toStrictEqual('0000ffe6')
    expect(RGBAToHEX({ r: 0, g: 0, b: 255 })).toStrictEqual('0000ff')
})
