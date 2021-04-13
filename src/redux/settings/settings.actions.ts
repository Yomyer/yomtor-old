export const settingsTypes = {
    ADD_COLOR: 'yomtor_add_color',
    REMOVE_COLOR: 'yomtor_remove_color'
}

export function addColor(payload: boolean) {
    return { type: settingsTypes.ADD_COLOR, payload }
}

export function removeColor(payload: boolean) {
    return { type: settingsTypes.REMOVE_COLOR, payload }
}
