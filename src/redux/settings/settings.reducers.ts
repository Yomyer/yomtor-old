import { AnyAction } from 'redux'
import { Color } from '../../models'
import { Grid } from '../../models/grid'
import { Margin } from '../../models/margin'
import { Size } from '../../models/size'
import { settingsTypes } from './settings.actions'
import { Settings } from './settings.model'

export type SettingsState = Settings

export const SettingsInitialState: SettingsState = {
    colors: [new Color('#fff')],
    fonts: [],
    medias: [],
    size: new Size(100, 100),
    factor: 1,
    zoom: {
        max: 300,
        min: 10
    },
    units: [],
    blood: new Margin(),
    margin: new Margin(),
    grid: new Grid()
}

export const SettingsReducer = (
    state: Settings = SettingsInitialState,
    action: AnyAction
) => {
    switch (action.type) {
        case settingsTypes.ADD_COLOR:
            return {
                ...state,
                colors: state.colors && state.colors.concat(action.payload)
            }

        default:
            return state
    }
}
