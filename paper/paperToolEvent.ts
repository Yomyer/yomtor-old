import paper from 'paper'

declare global {
    export namespace paper {
        export interface ToolEvent {
            event: MouseEvent | KeyboardEvent
        }
    }
}
