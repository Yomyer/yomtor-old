import { CSSProperties } from 'react'
import { Palette } from './createPalete'
import { mergeObjects } from '../apis/lodash'

export type Variant =
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'subtitle1'
    | 'subtitle2'
    | 'body1'
    | 'body2'
    | 'caption'
    | 'button'
    | 'input'
    | 'overline'

export interface FontStyle
    extends Required<{
        fontFamily: React.CSSProperties['fontFamily']
        fontSize: number
        fontWeightLight: React.CSSProperties['fontWeight']
        fontWeightRegular: React.CSSProperties['fontWeight']
        fontWeightMedium: React.CSSProperties['fontWeight']
        fontWeightBold: React.CSSProperties['fontWeight']
        htmlFontSize: number
    }> {}

export interface FontStyleOptions extends Partial<FontStyle> {
    allVariants?: React.CSSProperties
}

export type TypographyStyle = CSSProperties
export interface TypographyStyleOptions extends TypographyStyle {}

export interface TypographyUtils {
    pxToRem: (px: number) => string
}

export interface Typography
    extends Record<Variant, TypographyStyle>,
        FontStyle,
        TypographyUtils {}

export interface TypographyOptions
    extends Partial<
        Record<Variant, TypographyStyleOptions> &
            FontStyleOptions &
            TypographyUtils
    > {}

function round(value: number) {
    return Math.round(value * 1e5) / 1e5
}

const caseAllCaps = {
    textTransform: 'uppercase'
}
const defaultFontFamily = '"Roboto", "Helvetica", "Arial", sans-serif'

export default function createTypography(
    palette: Palette,
    typography: TypographyOptions | ((palette: Palette) => TypographyOptions)
): Typography {
    const {
        fontFamily = defaultFontFamily,
        fontSize = 14, // px
        fontWeightLight = 300,
        fontWeightRegular = 400,
        fontWeightMedium = 500,
        fontWeightBold = 700,
        htmlFontSize = 16,
        allVariants,
        pxToRem: pxToRem2,
        ...other
    } = typeof typography === 'function' ? typography(palette) : typography

    if (process.env.NODE_ENV !== 'production') {
        if (typeof fontSize !== 'number') {
            console.error('Material-UI: `fontSize` is required to be a number.')
        }

        if (typeof htmlFontSize !== 'number') {
            console.error(
                'Material-UI: `htmlFontSize` is required to be a number.'
            )
        }
    }

    const coef = fontSize / 14
    const pxToRem = pxToRem2 || ((size) => `${(size / htmlFontSize) * coef}rem`)
    const buildVariant = (
        fontWeight: React.CSSProperties['fontWeight'],
        size: number,
        lineHeight: number,
        letterSpacing: number,
        casing?: any
    ) => ({
        fontFamily,
        fontWeight,
        fontSize: pxToRem(size),
        lineHeight,
        ...(fontFamily === defaultFontFamily
            ? { letterSpacing: `${round(letterSpacing / size)}em` }
            : {}),
        ...casing,
        ...allVariants
    })

    const variants = {
        h1: buildVariant(fontWeightLight, 96, 1.167, -1.5),
        h2: buildVariant(fontWeightLight, 60, 1.2, -0.5),
        h3: buildVariant(fontWeightRegular, 48, 1.167, 0),
        h4: buildVariant(fontWeightRegular, 34, 1.235, 0.25),
        h5: buildVariant(fontWeightRegular, 24, 1.334, 0),
        h6: buildVariant(fontWeightMedium, 20, 1.6, 0.15),
        subtitle1: buildVariant(fontWeightRegular, 16, 1.75, 0.15),
        subtitle2: buildVariant(fontWeightMedium, 14, 1.57, 0.1),
        body1: buildVariant(fontWeightRegular, 16, 1.5, 0.15),
        body2: buildVariant(fontWeightRegular, 14, 1.43, 0.15),
        button: buildVariant(fontWeightMedium, 14, 1.75, 0.4, caseAllCaps),
        caption: buildVariant(fontWeightRegular, 12, 1.66, 0.4),
        overline: buildVariant(fontWeightRegular, 12, 2.66, 1, caseAllCaps),
        input: buildVariant(fontWeightRegular, 10, 14, 1, 0.1)
    }

    return mergeObjects(
        {
            htmlFontSize,
            pxToRem,
            round, // TODO v5: remove
            fontFamily,
            fontSize,
            fontWeightLight,
            fontWeightRegular,
            fontWeightMedium,
            fontWeightBold,
            ...variants
        },
        other,
        {
            clone: false // No need to clone deep
        }
    )
}
