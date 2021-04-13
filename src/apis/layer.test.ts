import { generateID, generateMachine } from './layer'

test('Generate random ID', () => {
    const random1 = generateID()
    const random2 = generateID(16)

    expect(typeof random1).toBe('string')

    expect(random1.length).toEqual(64)

    expect(typeof random2).toBe('string')
    expect(random2.length).toEqual(32)

    expect(random1).not.toEqual(random2)
})

test('Generate machine', () => {
    expect(generateMachine('Hola mundo, ñòá!=·!')).toStrictEqual(
        'hola-mundo-noa'
    )
})
