import { PaperScope, Path, ToolEvent } from '@yomyer/paper'
import { round } from '../../utils/mathUtils'
import { YomtorTheme } from '../../styles/createTheme'
import { createObjectTool } from '../../utils/createObjectTool'

export default createObjectTool(
    (e: ToolEvent, canvas: PaperScope, theme: YomtorTheme) =>
        new Path.Ellipse({
            from: round(e.downPoint),
            to: round(e.point),
            strokeColor: theme.palette.path.default.border,
            strokeWidth: 1 / canvas.view.zoom,
            guide: true,
            parent: canvas.guidesLayer
        }),
    (e: ToolEvent, _canvas: PaperScope, theme: YomtorTheme) =>
        new Path.Ellipse({
            from: round(e.downPoint),
            to: round(e.point),
            strokeColor: theme.palette.path.default.border,
            fillColor: theme.palette.path.default.background,
            name: 'Oval'
        }),
    'Oval',
    'o'
)
