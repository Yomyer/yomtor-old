import { Layer } from './layer'
import { Size } from './size'
import { Point } from './point'

test('Create a Layer', () => {
    expect({
        ...new Layer('Pro layer', { x: 0, y: 10 }, new Size(100, 100))
    }).toMatchObject({
        name: 'Pro layer',
        position: { x: 0, y: 10 },
        size: { width: 100, height: 100 },
        machine: 'pro-layer',
        visible: true,
        type: 'layer',
        lock: false,
        rotate: 0,
        params: {},
        temps: {}
    })
})

test('Create a Layer with params', () => {
    const layer = new Layer({
        name: 'With params',
        position: { x: 10, y: 10 },
        size: { width: 100, height: 100 },
        rotate: 100,
        params: { param1: 'test' }
    })

    expect(layer).toMatchObject({
        name: 'With params',
        position: { x: 10, y: 10 },
        size: { width: 100, height: 100 },
        machine: 'with-params',
        visible: true,
        type: 'layer',
        lock: false,
        rotate: 100,
        params: {},
        temps: {}
    })

    expect(layer.size).toBeInstanceOf(Size)

    expect(layer.position).toBeInstanceOf(Point)

    expect(layer.offset).toBeInstanceOf(Point)

    expect(layer.params).toMatchObject({ param1: 'test' })
})
