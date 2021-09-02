import paper from 'paper'
import { normalize, sign } from './mathUtils'

export const PiBy180 = Math.PI / 180
export const degreesToRadians = (degrees: number): number => {
    return degrees * PiBy180
}

export const radiansToDegrees = function (radians: number): number {
    return radians / PiBy180
}

export function findCornerQuadrant(
    cursor: { point?: paper.Point; corner?: paper.Item; angle: number },
    item: paper.Item
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
    point: paper.Point,
    center: paper.Point,
    angle: number
): paper.Point => {
    let radians = (angle * Math.PI) / 180
    const diff = point.subtract(center)
    const distance = Math.sqrt(diff.x * diff.x + diff.y * diff.y)

    radians += Math.atan2(diff.y, diff.x)

    return new paper.Point(
        center.x + distance * Math.cos(radians),
        center.y + distance * Math.sin(radians)
    )
}

export const getDirection = function (
    point: paper.Point,
    center: paper.Point,
    angle = 0
) {
    point = rotatePoint(point, center, angle)
    const radius = Math.atan2(point.x - center.x, point.y - center.y)

    return new paper.Point(Math.sin(radius), Math.cos(radius))
}

export const getItemSize = (
    corner: paper.Point,
    center: paper.Point,
    angle: number
) => {
    corner = rotatePoint(corner, center, angle)
    return new paper.Size((corner.x - center.x) * 2, (corner.y - center.y) * 2)
}

export const rotateDelta = (
    point: paper.Point,
    corner: paper.Point,
    angle: number
) => {
    point = rotatePoint(point, corner, -angle)
    const distancePoint = Math.hypot(point.x - corner.x, point.y - corner.y)
    const anglePoint = Math.atan2(point.y - corner.y, point.x - corner.x)

    const horizontalPoint = rotatePoint(
        new paper.Point(
            corner.x + Math.cos(anglePoint) * distancePoint,
            point.y - Math.sin(anglePoint) * distancePoint
        ),
        corner,
        angle
    )

    const verticalPoint = rotatePoint(
        new paper.Point(
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
