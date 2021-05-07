import paper from 'paper'

declare global {
    export namespace paper {
        export interface Project {
            insertMode: boolean
            activedItems: paper.Item[]
            deactivateAll: () => void
            guides: paper.Layer[]
            getItemByPoint: (
                point: paper.Point,
                options?: { [key: string]: any }
            ) => paper.Item
            selectorItem: paper.Item
        }
    }
}

paper.Project.prototype.activedItems = []
paper.Project.prototype.deactivateAll = function () {
    this.activedItems.slice().forEach((item) => (item.actived = false))
    this.activedItems = []
}

paper.Project.prototype.getItemByPoint = function (
    point: paper.Point,
    options: { [key: string]: any } = {}
    // ingoreDepth: boolean = false
) {
    const args = {
        class: paper.Path,
        segments: true,
        stroke: true,
        curves: true,
        fill: true,
        guides: false,
        tolerance: 8 / this.view.zoom,
        match: (hit: paper.HitResult) => {
            return (
                !hit.item.hasFill() &&
                !hit.item.blocked &&
                (options.filter ? options.filter(hit.item) : true)
            )
        }
    }

    const items = this.hitTestAll(point, { ...args, ...options }).concat(
        this.hitTestAll(point, {
            ...args,
            ...{
                tolerance: 0,
                match: (hit: paper.HitResult) =>
                    !hit.item.blocked &&
                    (options.filter ? options.filter(hit.item) : true)
            },
            ...options
        })
    )

    if (!items.length) return null

    return items[0].item
}

Object.defineProperty(paper.Project.prototype, 'guides', {
    get: function (): paper.Layer {
        if (!this.layers.Guides) {
            const current = this.activeLayer
            this.addLayer(new paper.Layer({ name: 'Guides' }))
            current.activate()
        }

        return this.layers.Guides
    },
    enumerable: false,
    configurable: true
})
