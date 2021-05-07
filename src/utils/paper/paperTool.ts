import paper from 'paper'

declare global {
    export namespace paper {
        export interface Tool {
            name: string
            actived: boolean
            activateMain: () => void
            onActivate: (tool: paper.Tool) => void
            onDeactivate: (tool: paper.Tool) => void
            _scope: paper.PaperScope
        }
    }
}

paper.Tool.prototype.activateMain = function () {
    this._scope.mainTool.activate()
}

Object.defineProperty(paper.Tool.prototype, 'actived', {
    get: function () {
        return this._scope.tool === this
    },
    enumerable: false,
    configurable: true
})
