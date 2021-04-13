import { Margin } from './margin'

test('Create a default Margin', () => {
    expect(new Margin()).toMatchObject({
        top: 15,
        bottom: 15,
        left: 15,
        right: 15
    })
})

test('Create a all 30 Margin', () => {
    expect(new Margin(30)).toMatchObject({
        top: 30,
        bottom: 30,
        left: 30,
        right: 30
    })
})

test('Create a 15 30 Margin', () => {
    expect(new Margin(15, 30)).toMatchObject({
        top: 15,
        bottom: 15,
        left: 30,
        right: 30
    })
})

test('Create a single Margin', () => {
    expect(new Margin(15, 30, 20, 40)).toMatchObject({
        top: 15,
        bottom: 30,
        left: 20,
        right: 40
    })
})
