import { fabric } from 'fabric'

export const YomtorRectangle = fabric.util.createClass(fabric.Rect, {
    type: 'rectangle',
    top: 0,
    left: 0,
    width: 100,
    height: 100,
    fill: '#D8D8D8',
    stroke: '#979797',
    strokeWidth: 1,
    objectCaching: false,
    strokeUniform: true
})
