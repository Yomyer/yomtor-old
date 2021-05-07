import createPalette, { Palette } from './createPalete'
import { mergeObjects } from '../utils/lodashUtils'
import createBreakpoints, { BreakpointsOptions } from './createBreakpoints'
import shadows from './shadows'
import shape, { ShapeOptions } from './shape'
import createSpacing, { SpacingOptions } from './createSpacing'
import createTypography, { TypographyOptions } from './createTypography'

export type YomtorTheme = {
    palette?: Palette
    breakpoints?: BreakpointsOptions
    direction?: 'ltr' | 'rtl'
    type?: 'light' | 'dark'
    shadows?: string[]
    spacing?: SpacingOptions
    typography?: TypographyOptions
    shape?: ShapeOptions
}

export default function createTheme(options: YomtorTheme = {}) {
    const {
        palette: paletteInput = {},
        breakpoints: breakPointsInput = {},
        spacing: spacingInput,
        type: mode = 'light',
        typography: typographyInput = {},
        ...other
    } = options

    const palette = createPalette(mergeObjects(paletteInput, { mode }))
    const breakpoints = createBreakpoints(breakPointsInput)
    const spacing = createSpacing(spacingInput)
    const typography = createTypography(palette, typographyInput)

    const theme = mergeObjects(
        {
            palette,
            breakpoints,
            direction: 'ltr',
            shadows: shadows.slice(),
            shape: { ...shape },
            spacing,
            typography
        },
        other
    )

    return theme
}
