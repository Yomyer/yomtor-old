import paper from 'paper'

export function round(size: paper.Size, toFix?: number): paper.Size
export function round(point: paper.Point, toFix?: number): paper.Point
export function round(number: number, toFix?: number): number
export function round(value: any, toFix = 0): any {
    if (value instanceof paper.Size) {
        return new paper.Size(
            round(value.width, toFix),
            round(value.height, toFix)
        )
    }
    if (value instanceof paper.Point) {
        return new paper.Point(round(value.x, toFix), round(value.y, toFix))
    }
    return Number((value || 0).toFixed(toFix))
}

export function sign(size: paper.Size): paper.Size
export function sign(point: paper.Point): paper.Point
export function sign(number: number): number
export function sign(value: any): any {
    if (value instanceof paper.Size) {
        return new paper.Size(sign(value.width), sign(value.height))
    }
    if (value instanceof paper.Point) {
        return new paper.Point(sign(value.x), sign(value.y))
    }
    return Math.sign(value)
}

export function abs(size: paper.Size): paper.Size
export function abs(point: paper.Point): paper.Point
export function abs(number: number): number
export function abs(value: any): any {
    if (value instanceof paper.Size) {
        return new paper.Size(abs(value.width), abs(value.height))
    }
    if (value instanceof paper.Point) {
        return new paper.Point(abs(value.x), abs(value.y))
    }
    return Math.abs(value)
}

export function normalize(size: paper.Size): paper.Size
export function normalize(point: paper.Point): paper.Point
export function normalize(number: number): number
export function normalize(value: any): any {
    if (value instanceof paper.Size) {
        return new paper.Size(normalize(value.width), normalize(value.height))
    }
    if (value instanceof paper.Point) {
        return new paper.Point(normalize(value.x), normalize(value.y))
    }
    if (Math.abs(value) < 0.00001) {
        return 0
    }
    return value
}
