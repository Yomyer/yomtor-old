function getPath(obj: any, path: string) {
    if (!path || typeof path !== 'string') {
        return null
    }

    return path
        .split('.')
        .reduce((acc, item) => (acc && acc[item] ? acc[item] : null), obj)
}

export function createUnaryUnit(
    theme: any,
    themeKey: string,
    defaultValue: number
) {
    const themeSpacing = getPath(theme, themeKey) || defaultValue

    if (typeof themeSpacing === 'number') {
        return (abs: any) => {
            if (typeof abs === 'string') {
                return abs
            }

            return themeSpacing * abs
        }
    }

    if (Array.isArray(themeSpacing)) {
        return (abs: any) => {
            if (typeof abs === 'string') {
                return abs
            }

            return themeSpacing[abs]
        }
    }

    if (typeof themeSpacing === 'function') {
        return themeSpacing
    }
    return (): any => undefined
}
