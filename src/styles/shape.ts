export interface Shape {
    borderRadius: number | string
}

export type ShapeOptions = Partial<Shape>

const shape = {
    borderRadius: 3
}

export default shape
