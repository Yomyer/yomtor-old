import Point from './point'

test('Create a Point', () => {
    expect(new Point({ x: 10, y: 20 })).toMatchObject({ x: 10, y: 20 })
})

test('Create a Point with params', () => {
    expect(new Point(30, 40)).toMatchObject({ x: 30, y: 40 })
})
