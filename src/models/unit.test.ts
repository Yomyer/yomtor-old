import Unit from './unit'

test('Create a Size', () => {
    expect(new Unit({ name: 'Pixel', code: 'px' })).toMatchObject({
        name: 'Pixel',
        code: 'px',
        factor: 1
    })
})

test('Create a Size with params', () => {
    expect(new Unit('Pixel', 'px', 0.8)).toMatchObject({
        name: 'Pixel',
        code: 'px',
        factor: 0.8
    })
})
