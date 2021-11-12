import { PaperScope } from '@yomyer/paper'
import { createContext } from 'react'
import { YomtorTheme } from '../styles/createTheme'
import { Settings } from '../redux/settings/settings.model'
import { CursorType } from './icons/Cursors'

type EditorContextProps = {
    canvas: PaperScope | null
    initCanvas: (c: PaperScope) => void
    setCursor: (
        action: CursorType,
        rotate?: number,
        subAction?: CursorType
    ) => void
    setGlobalCursor: (
        action: CursorType,
        rotate?: number,
        subAction?: CursorType
    ) => void
    clearCursor: (
        action: CursorType,
        rotate?: number,
        subAction?: CursorType
    ) => void
    clearGlobalCursor: (
        action: CursorType,
        rotate?: number,
        subAction?: CursorType
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
