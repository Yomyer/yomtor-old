import { Media } from './media'

test('Create a Size', () => {
    expect(new Media({ file: 'path_to_file' })).toMatchObject({
        file: 'path_to_file',
        opacity: 1,
        display: 'initial'
    })
})

test('Create a Size with params', () => {
    expect(new Media('path_to_file', 'cover', 0.8)).toMatchObject({
        file: 'path_to_file',
        opacity: 0.8,
        display: 'cover'
    })
})
