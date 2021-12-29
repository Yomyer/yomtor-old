import { isString, merge } from 'lodash'

export default class Unit {
    name: string | undefined
    code: string | undefined
    factor?: number

    constructor(unit: Unit)
    constructor(name: string, code: string, factor?: number)
    constructor(name: any, code?: any, factor?: any) {
        if (isString(name)) {
            name = { name, code, factor }
        }
        merge(
            this,
            {
                factor: 1
            },
            name
        )
    }
}
