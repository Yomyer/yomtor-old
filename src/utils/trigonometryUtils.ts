import { Item, Point, Size } from '@yomyer/paper'
import { isUndefined } from 'lodash'
import { normalize, sign } from './mathUtils'

export const PiBy180 = Math.PI / 180
export const degreesToRadians = (degrees: number): number => {
    return degrees * PiBy180
}

export const radiansToDegrees = function (radians: number): number {
    return radians / PiBy180
}

export function findCornerQuadrant(
    cursor: { point?: Point; corner?: Item; angle: number },
    item: Item
) {
    const point = rotatePoint(
        cursor.point || cursor.corner.position,
        item.position,
        -cursor.angle || 0
    )
    const direction = sign(normalize(point.subtract(item.position)))

    const delta =
        radiansToDegrees(Math.atan2(direction.y, direction.x)) +
        360 +
        (item.angle || 0)

    return Math.round((delta % 360) / 45)
}

export const rotatePoint = (
    point: Point,
    center: Point,
    angle: number
): Point => {
    let radians = (angle * Math.PI) / 180
    const diff = point.subtract(center)
    const distance = Math.sqrt(diff.x * diff.x + diff.y * diff.y)

    radians += Math.atan2(diff.y, diff.x)

    return new paper.Point(
        center.x + distance * Math.cos(radians),
        center.y + distance * Math.sin(radians)
    )
}

export const getDirection = function (point: Point, center: Point, angle = 0) {
    point = rotatePoint(point, center, angle)
    const radius = Math.atan2(point.x - center.x, point.y - center.y)

    return new Point(Math.sin(radius), Math.cos(radius))
}

export const getItemSize = (corner: Point, center: Point, angle: number) => {
    corner = rotatePoint(corner, center, angle)
    return new Size((corner.x - center.x) * 2, (corner.y - center.y) * 2)
}

export const rotateDelta = (point: Point, corner: Point, angle: number) => {
    point = rotatePoint(point, corner, -angle)
    const distancePoint = Math.hypot(point.x - corner.x, point.y - corner.y)
    const anglePoint = Math.atan2(point.y - corner.y, point.x - corner.x)

    const horizontalPoint = rotatePoint(
        new Point(
            corner.x + Math.cos(anglePoint) * distancePoint,
            point.y - Math.sin(anglePoint) * distancePoint
        ),
        corner,
        angle
    )

    const verticalPoint = rotatePoint(
        new Point(
            point.x - Math.cos(anglePoint) * distancePoint,
            corner.y + Math.sin(anglePoint) * distancePoint
        ),
        corner,
        angle
    )

    const distance = new paper.Point(
        Math.hypot(horizontalPoint.x - corner.x, horizontalPoint.y - corner.y),
        Math.hypot(verticalPoint.x - corner.x, verticalPoint.y - corner.y)
    ).multiply(sign(getDirection(point, corner)) as any)

    return distance
}

export const scaleWithRotate = function (
    item: Item,
    factor: Point,
    pivot?: Point,
    center?: Point,
    angle?: number
) {
    center = center || item.bounds.center
    pivot = pivot || center
    angle = (isUndefined(angle) && item.angle) || 0

    if (item.angle !== angle) {
        item.angle = 0
    }

    pivot = rotatePoint(pivot, center, -angle)

    item.rotate(-angle, center)
    item.scale(factor.x, factor.y, pivot)
    item.rotate(angle, center)
}
