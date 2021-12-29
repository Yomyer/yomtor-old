import { PaperScope } from '@yomyer/paper'
import { createContext } from 'react'
import { YomtorTheme } from '../styles/createTheme'
import Settings from '../models/settings'

type EditorContextProps = {
    canvas: PaperScope | null
    initCanvas: (c: PaperScope) => void
    settings: Settings
    theme: YomtorTheme
}
const EditorContext = createContext<EditorContextProps>({
    canvas: null,
    initCanvas: () => {},
    settings: {},
    theme: {}
})

export default EditorContext
