import { isNumber, merge } from 'lodash'

export class Grid {
    columns?: number
    gap?: number

    constructor()
    constructor(grid: Grid)
    constructor(columns: number, gap?: number)
    constructor(columns?: any, gap?: any) {
        if (isNumber(columns)) {
            columns = { columns, gap }
        }

        merge(
            this,
            {
                columns: 12,
                gap: 30
            },
            columns
        )
    }
}
