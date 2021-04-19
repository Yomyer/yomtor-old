import { remove } from 'lodash'
import paper from 'paper'

declare global {
    export namespace paper {
        export interface Item {
            actived: boolean
            guide: boolean
        }
    }
}

Object.defineProperty(paper.Item.prototype, 'actived', {
    get: function () {
        return this._actived
    },
    set: function (status: boolean) {
        ;(!status && remove(this.project.activedItems, this)) ||
            this.project.activedItems.push(this)
        this._actived = status
    },
    enumerable: false,
    configurable: true
})

Object.defineProperty(paper.Item.prototype, 'guide', {
    get: function () {
        return this._guide
    },
    set: function (status: boolean) {
        this.project.guides.addChild(this)
        this._guide = status
    },
    enumerable: false,
    configurable: true
})
