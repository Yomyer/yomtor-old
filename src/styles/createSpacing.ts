import { createUnaryUnit } from './createUnary'

export type SpacingOptions =
    | number
    | Spacing
    | ((abs: number) => number | string)
    | ((abs: number | string) => number | string)
    | ReadonlyArray<string | number>

export type SpacingArgument = number | string

export interface Spacing {
    (): string
    (value: number): string
    (topBottom: SpacingArgument, rightLeft: SpacingArgument): string
    (
        top: SpacingArgument,
        rightLeft: SpacingArgument,
        bottom: SpacingArgument
    ): string
    (
        top: SpacingArgument,
        right: SpacingArgument,
        bottom: SpacingArgument,
        left: SpacingArgument
    ): string
}

export function createUnarySpacing(theme: {
    spacing?: SpacingOptions
}): Spacing {
    return createUnaryUnit(theme, 'spacing', 8)
}

export default function createSpacing(
    spacingInput: SpacingOptions = 8
): Spacing {
    if ((spacingInput as any).mui) {
        return spacingInput as Spacing
    }

    const transform = createUnarySpacing({
        spacing: spacingInput
    })

    const spacing = (...argsInput: ReadonlyArray<number | string>): string => {
        const args = argsInput.length === 0 ? [1] : argsInput

        return args
            .map((argument: any) => {
                const output = transform(argument)
                return typeof output === 'number' ? `${output}px` : output
            })
            .join(' ')
    }

    spacing.mui = true

    return spacing
}
