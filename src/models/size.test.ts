import Size from './size'

test('Create a Size', () => {
    expect(new Size({ width: 200, height: 100 })).toMatchObject({
        width: 200,
        height: 100
    })
})

test('Create a Size with params', () => {
    expect(new Size(200, 100)).toMatchObject({ width: 200, height: 100 })
})
