import { Font } from './font'

test('Create a Font', () => {
    expect(
        new Font(
            'Roboto',
            'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;1,100&display=swap',
            ['100', '100i']
        )
    ).toMatchObject({
        name: 'Roboto',
        url:
            'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;1,100&display=swap',
        styles: ['100', '100i']
    })

    expect(
        new Font({
            name: 'Roboto',
            url:
                'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;1,100&display=swap',
            styles: ['100', '100i']
        })
    ).toMatchObject({
        name: 'Roboto',
        url:
            'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;1,100&display=swap',
        styles: ['100', '100i']
    })
})
