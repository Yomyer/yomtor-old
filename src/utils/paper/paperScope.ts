import paper from 'paper'
import SelectorItem from './items/Selector'

declare global {
    export namespace paper {
        export interface PaperScope {
            guides: paper.Layer
            mainTool: paper.Tool
            createTool: (name?: string, main?: boolean) => paper.Tool
            getTool(name: string): paper.Tool
            Selector: typeof SelectorItem
        }
        export interface Selector extends SelectorItem {}
    }
}

paper.Selector = SelectorItem
paper.PaperScope.prototype.Selector = SelectorItem

paper.PaperScope.prototype.createTool = function (
    name?: string,
    main?: boolean
) {
    const tool = new this.Tool()

    if (name) {
        tool.name = name
        this.tools[name] = tool
    }
    if (main) {
        this.mainTool = tool
    }

    if (this.mainTool) {
        this.mainTool.activateMain()
    }

    return tool
}

paper.PaperScope.prototype.getTool = function (name: string): paper.Tool {
    return this.tools[name] || {}
}

Object.defineProperty(paper.PaperScope.prototype, 'guides', {
    get: function () {
        return this.project.guides
    },
    enumerable: false,
    configurable: true
})

Object.defineProperty(paper.PaperScope.prototype, 'mainTool', {
    get: function () {
        return this._mainTool
    },
    set: function (tool: paper.Tool) {
        this._mainTool = tool
    },
    enumerable: false,
    configurable: true
})
