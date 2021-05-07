import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Settings, SettingsReducer, SettingsInitialState } from './settings'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
import { mergeObjects } from '../utils/lodashUtils'

const middleware = [thunk]

export type State = {
    settings: Settings
}

export const DefautState = {
    settings: SettingsInitialState
}

const rootReducer = combineReducers<any>({
    settings: SettingsReducer
})

export const store = (initialState?: State | any, mergeDeep?: boolean) => {
    initialState = mergeDeep
        ? mergeObjects(DefautState, initialState)
        : Object.assign(DefautState, initialState)

    return createStore(
        rootReducer,
        initialState,
        composeWithDevTools(applyMiddleware(...middleware))
    )
}
