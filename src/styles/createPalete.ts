import common from './colors/common'
import indigo from './colors/indigo'
import pink from './colors/pink'
import red from './colors/red'
import orange from './colors/orange'
import blue from './colors/blue'
import green from './colors/green'
import { getContrastRatio, lighten, darken } from './colorManipulation'
import { mergeObjects } from '../utils/lodashUtils'
import grey from './colors/grey'

export type PaletteColor = {
    light?: string
    main: string
    dark?: string
    contrastText?: string
}

export type TypeAction = {
    active?: string
    hover?: string
    hoverOpacity?: number
    selected?: string
    selectedOpacity?: number
    disabled?: string
    disabledOpacity?: number
    disabledBackground?: string
    focus?: string
    focusOpacity?: number
    activatedOpacity?: number
}
export type TypeBackground = {
    default?: string
    paper?: string
}

export type TypeDivider = string

export type TypeText = {
    primary?: string
    secondary?: string
    disabled?: string
    icon?: string
}

export type TypeCanvas = {
    info?: {
        color?: string
        background?: string
    }
    selected?: {
        border?: string
    }
    selector?: {
        background?: string
        border?: string
    }
    corners?: {
        background?: string
        border?: string
    }
    highlight?: {
        background?: string
        border?: string
    }
    background?: string
}

export type TypePath = {
    default?: {
        background?: string
        border?: string
    }
}

export type Palette = {
    primary?: PaletteColor
    secondary?: PaletteColor
    error?: PaletteColor
    warning?: PaletteColor
    info?: PaletteColor
    success?: PaletteColor
    mode?: 'light' | 'dark'
    contrastThreshold?: number
    tonalOffset?: number
    text?: TypeText
    divider?: TypeDivider
    action?: TypeAction
    canvas?: TypeCanvas
    background?: TypeBackground
    path?: TypePath
}

export type Color = {
    color?: PaletteColor
    name?: string
}

export const light: Palette = {
    text: {
        primary: 'rgba(0, 0, 0, 0.87)',
        secondary: 'rgba(0, 0, 0, 0.6)',
        disabled: 'rgba(0, 0, 0, 0.38)'
    },
    divider: 'rgba(0, 0, 0, 0.12)',
    background: {
        paper: '#fafafa',
        default: common.white
    },
    action: {
        active: 'rgba(0, 0, 0, 0.54)',
        hover: 'rgba(0, 0, 0, 0.04)',
        hoverOpacity: 0.04,
        selected: 'rgba(0, 0, 0, 0.08)',
        selectedOpacity: 0.08,
        disabled: 'rgba(0, 0, 0, 0.26)',
        disabledBackground: 'rgba(0, 0, 0, 0.12)',
        disabledOpacity: 0.38,
        focus: 'rgba(0, 0, 0, 0.12)',
        focusOpacity: 0.12,
        activatedOpacity: 0.12
    },
    canvas: {
        background: '#E5E5E5'
    }
}

export const dark: Palette = {
    text: {
        primary: common.white,
        secondary: 'rgba(255, 255, 255, 0.7)',
        disabled: 'rgba(255, 255, 255, 0.5)',
        icon: 'rgba(255, 255, 255, 0.5)'
    },
    divider: 'rgba(255, 255, 255, 0.12)',
    background: {
        paper: '#303030',
        default: '#424242'
    },
    action: {
        active: common.white,
        hover: 'rgba(255, 255, 255, 0.08)',
        hoverOpacity: 0.08,
        selected: 'rgba(255, 255, 255, 0.16)',
        selectedOpacity: 0.16,
        disabled: 'rgba(255, 255, 255, 0.3)',
        disabledBackground: 'rgba(255, 255, 255, 0.12)',
        disabledOpacity: 0.38,
        focus: 'rgba(255, 255, 255, 0.12)',
        focusOpacity: 0.12,
        activatedOpacity: 0.24
    },
    canvas: {
        background: '#272829'
    }
}

export const canvas: TypeCanvas = {
    info: {
        color: 'white',
        background: 'rgba(128, 128, 128, 0.5)'
    },
    selected: {
        border: 'rgba(200, 200, 200, 0.5)'
    },
    selector: {
        background: 'rgba(0, 142, 252, 0.1)',
        border: 'rgba(0, 142, 252, 1)'
    },
    corners: {
        background: 'white',
        border: 'rgba(0, 0, 0, 0.7)'
    },
    highlight: {
        background: 'rgba(0, 142, 252, 0.1)',
        border: 'rgba(0, 142, 252, 1)'
    }
}

export const path: TypePath = {
    default: {
        background: '#D8D8D8',
        border: '#979797'
    }
}

function addLightOrDark(
    intent: PaletteColor,
    direction: string,
    shade: number,
    tonalOffset: any
) {
    const tonalOffsetLight = tonalOffset.light || tonalOffset
    const tonalOffsetDark = tonalOffset.dark || tonalOffset * 1.5

    if (!intent[direction]) {
        if (Object.prototype.hasOwnProperty.call(intent, shade)) {
            intent[direction] = intent[shade]
        } else if (direction === 'light') {
            intent.light = lighten(intent.main, tonalOffsetLight)
        } else if (direction === 'dark') {
            intent.dark = darken(intent.main, tonalOffsetDark)
        }
    }
}

export default function createPalette(palette: Palette): Palette {
    const {
        primary = {
            light: indigo[300],
            main: indigo[500],
            dark: indigo[700]
        },
        secondary = {
            light: pink.A200,
            main: pink.A400,
            dark: pink.A700
        },
        error = {
            light: red[300],
            main: red[500],
            dark: red[700]
        },
        warning = {
            light: orange[300],
            main: orange[500],
            dark: orange[700]
        },
        info = {
            light: blue[300],
            main: blue[500],
            dark: blue[700]
        },
        success = {
            light: green[300],
            main: green[500],
            dark: green[700]
        },
        mode = 'light',
        contrastThreshold = 3,
        tonalOffset = 0.2,
        ...other
    } = palette

    function getContrastText(background: string) {
        const contrastText =
            getContrastRatio(background, dark.text.primary) >= contrastThreshold
                ? dark.text.primary
                : light.text.primary

        return contrastText
    }

    const augmentColor = ({
        color,
        mainShade = 500,
        lightShade = 300,
        darkShade = 700
    }: any): PaletteColor => {
        color = { ...color }
        if (!color.main && color[mainShade]) {
            color.main = color[mainShade]
        }

        addLightOrDark(color, 'light', lightShade, tonalOffset)
        addLightOrDark(color, 'dark', darkShade, tonalOffset)
        if (!color.contrastText) {
            color.contrastText = getContrastText(color.main)
        }

        return color
    }

    const modes = { dark, light }

    const paletteOutput = mergeObjects(
        {
            common,
            mode,
            primary: augmentColor({ color: primary }),
            secondary: augmentColor({ color: secondary }),
            error: augmentColor({ color: error }),
            warning: augmentColor({ color: warning }),
            info: augmentColor({ color: info }),
            success: augmentColor({ color: success }),
            grey,
            contrastThreshold,
            getContrastText,
            augmentColor,
            tonalOffset,
            canvas,
            path
        },
        modes[mode],
        other
    )

    return paletteOutput
}
