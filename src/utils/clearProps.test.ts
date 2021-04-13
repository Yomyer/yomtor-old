import { clearProps } from './clearProps'

test('Remove Bad Props in dev Mode', () => {
    const props = {
        multiple: true,
        labelPosition: 'above',
        labelAlign: 'start',
        value: 'value',
        placeholder: 'placeholder',
        style: 'style',
        id: 'id'
    }

    const clear = clearProps(props)
    expect(clear).toStrictEqual({
        id: 'id',
        style: 'style',
        value: 'value',
        placeholder: 'placeholder',
        multiple: true
    })
})
