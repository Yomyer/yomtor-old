import paper from 'paper'

type SelectorProps = {
    pathData: string
    angle: number
    points: paper.Rectangle
    bounds: paper.Rectangle
    position: paper.Point
    size: paper.Size
    item: paper.Item
    segments: paper.Segment[]
}

declare global {
    export namespace paper {
        export class Selector {
            pathData: string
            angle: number
            points: paper.Rectangle
            bounds: paper.Rectangle
            position: paper.Point
            size: paper.Size
            item: paper.Item
            segments: paper.Segment[]
        }
    }
    export interface PaperScope {
        Selector: SelectorProps
    }
}
