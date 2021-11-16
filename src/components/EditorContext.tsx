import { PaperScope } from '@yomyer/paper'
import { createContext } from 'react'
import { YomtorTheme } from '../styles/createTheme'
import { Settings } from '../redux/settings/settings.model'
import Cursor from './icons/Cursor'

type EditorContextProps = {
    canvas: PaperScope | null
    initCanvas: (c: PaperScope) => void
    setCursor: (action: Cursor, rotate?: number, subAction?: Cursor) => void
    setGlobalCursor: (
        action: Cursor,
        rotate?: number,
        subAction?: Cursor
    ) => void
    clearCursor: (
        action: Cursor | Cursor[],
        rotate?: number,
        subAction?: Cursor
    ) => void
    clearGlobalCursor: (
        action: Cursor | Cursor[],
        rotate?: number,
        subAction?: Cursor
    ) => void
    settings: Settings
    theme: YomtorTheme
}
const EditorContext = createContext<EditorContextProps>({
    canvas: null,
    initCanvas: () => {},
    setCursor: () => {},
    setGlobalCursor: () => {},
    clearGlobalCursor: () => {},
    clearCursor: () => {},
    settings: {},
    theme: {}
})

export default EditorContext
