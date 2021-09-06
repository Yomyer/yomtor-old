import { Point, Size } from '@yomyer/paper'

export function round(size: Size, toFix?: number): Size
export function round(point: Point, toFix?: number): Point
export function round(number: number, toFix?: number): number
export function round(value: any, toFix = 0): any {
    if (value instanceof Size) {
        return new Size(round(value.width, toFix), round(value.height, toFix))
    }
    if (value instanceof Point) {
        return new Point(round(value.x, toFix), round(value.y, toFix))
    }
    return Number((value || 0).toFixed(toFix))
}

export function sign(size: Size): Size
export function sign(point: Point): Point
export function sign(number: number): number
export function sign(value: any): any {
    if (value instanceof Size) {
        return new Size(sign(value.width), sign(value.height))
    }
    if (value instanceof Point) {
        return new Point(sign(value.x), sign(value.y))
    }
    return Math.sign(value)
}

export function abs(size: Size): Size
export function abs(point: Point): Point
export function abs(number: number): number
export function abs(value: any): any {
    if (value instanceof Size) {
        return new Size(abs(value.width), abs(value.height))
    }
    if (value instanceof Point) {
        return new Point(abs(value.x), abs(value.y))
    }
    return Math.abs(value)
}

export function normalize(size: Size): Size
export function normalize(point: Point): Point
export function normalize(number: number): number
export function normalize(value: any): any {
    if (value instanceof Size) {
        return new Size(normalize(value.width), normalize(value.height))
    }
    if (value instanceof Point) {
        return new Point(normalize(value.x), normalize(value.y))
    }
    if (Math.abs(value) < 0.00001) {
        return 0
    }
    return value
}
