import { Color } from '../../models/color'
import { Font } from '../../models/font'
import { Media } from '../../models/media'
import { Size } from '../../models/size'
import { Unit } from '../../models/unit'
import { Margin } from '../../models/margin'
import { Grid } from '../../models/grid'

export interface Settings {
    colors?: Color[]
    fonts?: Font[]
    medias?: Media[]
    size?: Size
    factor?: Number
    zoom?: {
        max: number
        min: number
    }
    units?: Unit[]
    blood?: Margin
    margin?: Margin
    grid?: Grid
}
