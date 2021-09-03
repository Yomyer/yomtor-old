/* eslint-disable standard/no-callback-literal */
import paper from 'paper'
import BlendMode from './BlendMode'
import { CanvasProvider } from './CanvasProvider'

// No export, side-effect only.

declare global {
    export namespace paper {
        export interface Item {
            draw: (
                ctx: CanvasRenderingContext2D,
                param: any,
                parentStrokeMatrix: any
            ) => void
            superDraw: (
                ctx: CanvasRenderingContext2D,
                param: any,
                parentStrokeMatrix: any
            ) => void
            _visible: boolean
            _opacity: number
            _matrix: any
            _globalMatrix: any
            _blendMode: string
            _canComposite: any
            getStrokeBounds: any
            _canScaleStroke: any
            getStrokeScaling: any
            _draw: any
            getFillRule: any
        }
    }
}

paper.Path.prototype.superDraw =
    paper.Path.prototype.superDraw || paper.Path.prototype.draw

paper.Path.prototype.draw = function (
    ctx: CanvasRenderingContext2D,
    param: any,
    parentStrokeMatrix: any
): void {
    // const updateVersion = (this._updateVersion = this._project._updateVersion)

    if (!this._visible || this._opacity === 0) return

    const matrices = param.matrices
    let viewMatrix = param.viewMatrix
    const matrix = this._matrix
    const globalMatrix = matrices[matrices.length - 1].appended(matrix)

    if (!globalMatrix.isInvertible()) return
    viewMatrix = viewMatrix ? viewMatrix.appended(globalMatrix) : globalMatrix

    matrices.push(globalMatrix)
    if (param.updateMatrix) {
        this._globalMatrix = globalMatrix
    }

    const blendMode = this._blendMode
    const opacity =
        this._opacity < 0 ? 0 : this._opacity > 1 ? 1 : this._opacity
    const normalBlend = blendMode === 'normal'
    const nativeBlend = BlendMode.nativeModes[blendMode]
    const direct =
        (normalBlend && opacity === 1) ||
        param.dontStart || // e.g. CompoundPath
        param.clip ||
        // If native blending is possible, see if the item allows it
        ((nativeBlend || (normalBlend && opacity < 1)) && this._canComposite())
    const pixelRatio = param.pixelRatio || 1
    let mainCtx
    let itemOffset
    let prevOffset

    if (!direct) {
        const bounds = this.getStrokeBounds(viewMatrix)
        if (!bounds.width || !bounds.height) {
            matrices.pop()
            return
        }
        prevOffset = param.offset
        itemOffset = param.offset = bounds.getTopLeft().floor()
        mainCtx = ctx
        ctx = CanvasProvider.getContext(
            bounds.getSize().ceil().add(1).multiply(pixelRatio)
        )
        if (pixelRatio !== 1) ctx.scale(pixelRatio, pixelRatio)
    }
    ctx.save()

    const strokeMatrix = parentStrokeMatrix
        ? parentStrokeMatrix.appended(matrix)
        : // pass `true` for dontMerge
          this._canScaleStroke && !this.getStrokeScaling(true) && viewMatrix

    const clip = !direct && param.clipItem
    const transform = !strokeMatrix || clip

    if (direct) {
        ctx.globalAlpha = opacity
        if (nativeBlend) ctx.globalCompositeOperation = blendMode
    } else if (transform) {
        ctx.translate(-itemOffset.x, -itemOffset.y)
    }
    if (transform) {
        ;(direct ? matrix : viewMatrix).applyToContext(ctx)
    }
    if (clip) {
        param.clipItem.draw(ctx, param.extend({ clip: true }))
    }
    if (strokeMatrix) {
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
        const offset = param.offset
        if (offset) ctx.translate(-offset.x, -offset.y)
    }

    this._draw(ctx, param, viewMatrix, strokeMatrix)

    ctx.restore()
    matrices.pop()
    if (param.clip && !param.dontFinish) {
        ctx.clip(this.getFillRule())
    }
    if (!direct) {
        BlendMode.process(
            blendMode,
            ctx,
            mainCtx,
            opacity,
            itemOffset.subtract(prevOffset).multiply(pixelRatio)
        )
        CanvasProvider.release(ctx)
        param.offset = prevOffset
    }

    /*
    const c = this.view.element

    if (!this.guide) {
        paper.Path.prototype.superDraw.call(
            this,
            ctx,
            param,
            parentStrokeMatrix
        )

        ctx.globalCompositeOperation = 'xor'
        ctx.fillRect(this.position.x, this.position.y, c.width, c.height)
        ctx.shadowBlur = 7 * 2 // use double of what is in CSS filter (Chrome x4)
        ctx.shadowOffsetX = 5
        ctx.shadowOffsetY = 5
        ctx.shadowColor = '#000'
        ctx.drawImage(c, this.position.x, this.position.y)

        ctx.globalCompositeOperation = 'destination-atop'
        ctx.shadowColor = 'transparent'
        paper.Path.prototype.superDraw.call(
            this,
            ctx,
            param,
            parentStrokeMatrix
        )
        ctx.globalCompositeOperation = 'source-over'
    } else {
        paper.Path.prototype.superDraw.call(
            this,
            ctx,
            param,
            parentStrokeMatrix
        )
    }
    */

    /*
// paper.Path.prototype.superDraw.call(this, ctx, param, parentStrokeMatrix)

if (!this.guide) {
    // ctx.shadowInset = true
    ctx.shadowBlur = 10
    ctx.shadowColor = 'rgba(0,0,0,0.5)'
}

paper.Path.prototype.superDraw.call(this, ctx, param, parentStrokeMatrix)

ctx.shadowInset = false
*/
    if (!this.guide) {
        // ctx.filter = 'blur(15px)'
        // set shadowing
        /*
    ctx.shadowColor = 'black'
    ctx.shadowBlur = 25

    ctx.lineWidth = 1

    ctx.stroke()

    // stop shadowing
    ctx.shadowColor = 'rgba(0,0,0,0)'

    // set compositing to erase everything outside the stroke
    ctx.globalCompositeOperation = 'destination-in'
    ctx.fill()

    // set compositing to erase everything outside the stroke
    ctx.globalCompositeOperation = 'destination-over'
    // ctx.fillStyle = 'gold'
    // ctx.fill()

    // always clean up -- set compsiting back to default
    ctx.globalCompositeOperation = 'source-over'
    */
    }

    ctx.filter = ''

    // console.log(this)
}
