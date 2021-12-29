import Color from './color'
import Font from './font'
import Media from './media'
import Size from './size'
import Unit from './unit'
import Margin from './margin'
import Grid from './grid'

export default interface Settings {
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
