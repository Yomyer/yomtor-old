import { PaperScope, Artboard, ToolEvent, Path } from '@yomyer/paper'
import { round } from '../../utils/mathUtils'
import { YomtorTheme } from '../../styles/createTheme'
import { createObjectTool } from '../../utils/createObjectTool'

export default createObjectTool(
    (e: ToolEvent, canvas: PaperScope, theme: YomtorTheme) =>
        new Artboard({
            from: round(e.downPoint),
            to: round(e.point),
            strokeColor: theme.palette.path.default.border,
            strokeWidth: 1 / canvas.view.zoom,
            guide: true,
            parent: canvas.guidesLayer
        }),
    (e: ToolEvent) =>
        new Artboard({
            from: round(e.downPoint),
            to: round(e.point),
            fillColor: 'white',
            name: 'Artboard',
            actived: true,
            clipped: true,
            children: [
                new Path.Rectangle({
                    from: round(e.downPoint),
                    to: round(e.point),
                    fillColor: 'blue'
                })
            ]
        }),
    'Artboard',
    'a'
)
