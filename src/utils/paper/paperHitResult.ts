import paper from 'paper'

declare global {
    export namespace paper {
        export interface HitResult {
            initialize: {
                getOptions: (args: any[]) => any[]
            }
        }
    }
}

paper.HitResult.prototype.initialize.getOptions = function (
    args: any[]
): any[] {
    const options = args && args[1]

    return {
        ...{
            type: null,
            tolerance: paper.settings.hitTolerance,
            fill: !options,
            stroke: !options,
            segments: !options,
            handles: false,
            ends: false,
            position: false,
            center: false,
            bounds: false,
            guides: true,
            selected: false
        },
        ...options
    }
}
