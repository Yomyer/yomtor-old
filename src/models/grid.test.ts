import Grid from './grid'

test('Create a default Grid', () => {
    expect(new Grid()).toMatchObject({ columns: 12, gap: 30 })
})

test('Create a Grid only columns', () => {
    expect(new Grid(11)).toMatchObject({ columns: 11, gap: 30 })
})

test('Create a Grid only gap', () => {
    expect(new Grid({ gap: 20 })).toMatchObject({ columns: 12, gap: 20 })
})

test('Create a Grid all data', () => {
    expect(new Grid(20, 20)).toMatchObject({ columns: 20, gap: 20 })
})
