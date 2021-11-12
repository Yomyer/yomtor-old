import React from 'react'

import { Default } from './cursor/Default'
import { Remove } from './cursor/Remove'
import { Resize } from './cursor/Resize'
import { Clone } from './cursor/Clone'
import { Cross } from './cursor/Cross'
import { Rectangle } from './cursor/Rectangle'
import { Rotate } from './cursor/Rotate'
import { Buti } from './cursor/Buti'
import { Grab } from './cursor/Grab'
import { Grabbing } from './cursor/Grabbing'

type Props = {
    id: string
    d: string
    fill: string
    x: string
    y: string
    stroke: string
}

export type Cursor = React.ReactElement<Props>

export type CursorType =
    | 'default'
    | 'resize'
    | 'remove'
    | 'clone'
    | 'cross'
    | 'rectangle'
    | 'rotate'
    | 'buti'
    | 'grab'
    | 'grabbing'
    | null

// eslint-disable-next-line no-unused-vars
const Cursors: { [key in CursorType]: Cursor } = {
    default: Default,
    resize: Resize,
    remove: Remove,
    clone: Clone,
    cross: Cross,
    rectangle: Rectangle,
    rotate: Rotate,
    buti: Buti,
    grab: Grab,
    grabbing: Grabbing
}

export default Cursors
