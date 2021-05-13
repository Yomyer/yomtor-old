import paper from 'paper'

declare global {
    export namespace paper {
        export interface PaperScope {
            _eventListeners: { [eventName: string]: ((event: any) => void)[] }
            _removeEventListener(
                eventName: string,
                handler?: (event: any) => void
            ): void
            guides: paper.Layer
            mainTool: paper.Tool
            createTool: (name?: string, main?: boolean) => paper.Tool
            getTool: (name: string) => paper.Tool
            setInfo: (label: string, point: paper.Point) => void
            clearInfo: () => void
            fire: (eventName: string, options: any) => paper.PaperScope
            on: (
                eventName: string | { [prop: string]: (event: any) => void },
                handler?: (event: any) => void
            ) => paper.PaperScope
            off: (
                eventName?: string | { [prop: string]: (event: any) => void },
                handler?: any
            ) => paper.PaperScope
        }
    }
}

paper.PaperScope.prototype._removeEventListener = function (
    eventName: string,
    handler?: (event: any) => void
): void {
    if (!this._eventListeners[eventName]) {
        return
    }
    if (handler) {
        const index = this._eventListeners[eventName].findIndex(
            (event) => event === handler
        )
        this._eventListeners[eventName] = this._eventListeners[
            eventName
        ].filter((_, key) => key !== index)
    } else {
        this._eventListeners[eventName] = []
    }
}

paper.PaperScope.prototype.on = function (
    eventName: string | { [prop: string]: (event: any) => void },
    handler?: (event: any) => void
): paper.PaperScope {
    if (!this._eventListeners) {
        this._eventListeners = {}
    }
    if (eventName instanceof Object) {
        for (const prop in eventName) {
            this.on(prop, eventName[prop])
        }
    } else {
        if (!this._eventListeners[eventName]) {
            this._eventListeners[eventName] = []
        }
        this._eventListeners[eventName].push(handler)
    }
    return this
}

paper.PaperScope.prototype.off = function (
    eventName?: string | { [prop: string]: (event: any) => void },
    handler?: any
): paper.PaperScope {
    if (!this._eventListeners) {
        return this
    }
    if (arguments.length === 0) {
        for (eventName in this._eventListeners) {
            this._removeEventListener(eventName)
        }
    } else if (eventName instanceof Object) {
        for (const prop in eventName) {
            this._removeEventListener(prop, eventName[prop])
        }
    } else {
        this._removeEventListener(eventName, handler)
    }
    return this
}

paper.PaperScope.prototype.fire = function (eventName: string, options?: any) {
    if (!this._eventListeners) return this

    if (options && !options.items) {
        options.items = this.project.activedItems
    }

    const listenersForEvent = this._eventListeners[eventName]
    if (listenersForEvent) {
        listenersForEvent.forEach((event) => event.call(this, options || null))

        this._eventListeners[eventName] = listenersForEvent.filter((value) => {
            return value
        })
    }

    if (eventName.startsWith('object:') && eventName.endsWith('ing')) {
        const listenersForObjectModified = this._eventListeners[
            'object:modifing'
        ]

        if (listenersForObjectModified) {
            listenersForObjectModified.forEach((event) =>
                event.call(this, options || null)
            )
        }
    }

    if (eventName.startsWith('object:') && eventName.endsWith('ed')) {
        const listenersForObjectModified = this._eventListeners[
            'object:modified'
        ]

        if (listenersForObjectModified) {
            listenersForObjectModified.forEach((event) =>
                event.call(this, options || null)
            )
        }
    }

    if (eventName.startsWith('selection:')) {
        const listenersForObjectModified = this._eventListeners[
            'selection:modified'
        ]

        if (listenersForObjectModified) {
            listenersForObjectModified.forEach((event) =>
                event.call(this, options || null)
            )
        }
    }

    return this
}

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

paper.PaperScope.prototype.setInfo = function (
    label: string,
    point: paper.Point
): void {
    this.fire('info:updated', { label, point })
}

paper.PaperScope.prototype.clearInfo = function (): void {
    this.fire('info:updated', null)
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
