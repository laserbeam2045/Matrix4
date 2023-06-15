/* eslint-disable array-element-newline */
/* eslint-disable key-spacing */
/* eslint-disable indent */
import { fabric } from 'fabric'

// fabric.PencilBrushに独自のカスタマイズを加えるためのクラス
class MyPencilBrush extends fabric.PencilBrush {
  constructor(canvas) {
    super(canvas)
  }

  // 点の描画時に拡大するためのオーバーライド
  onMouseDown(pointer, options) {
    if (!this.canvas._isMainEvent(options.e)) {
      return
    }
    this.startPoint = pointer  // +
    this.dotOnlyFlg = true     // +
    this._prepareForDrawing(pointer)
    this._captureDrawingPath(pointer)
    this._render()
  }

  // 点の描画時に拡大するためのオーバーライド
  onMouseMove(pointer, options) {
    if (!this.canvas._isMainEvent(options.e)) {
      return
    }
    this.dotOnlyFlg = false    // +
    if (this._captureDrawingPath(pointer) && this._points.length > 1) {
      if (this.needsFullRender()) {
        // redraw curve
        // clear top canvas
        this.canvas.clearContext(this.canvas.contextTop)
        this._render()
      }
      else {
        var points = this._points, length = points.length, ctx = this.canvas.contextTop
        // draw the curve update
        this._saveAndTransform(ctx)
        if (this.oldEnd) {
          ctx.beginPath()
          ctx.moveTo(this.oldEnd.x, this.oldEnd.y)
        }
        this.oldEnd = this._drawSegment(ctx, points[length - 2], points[length - 1], true)
        ctx.stroke()
        ctx.restore()
      }
    }
  }

  // 点の描画時に拡大するためのオーバーライド
  onMouseUp(options) {
    if (!this.canvas._isMainEvent(options.e)) {
      return true
    }
    // + BEGIN
    if (this.dotOnlyFlg) {
      const moves = [
                                                        {x: 0, y: -3},
                                        {x: -1, y: -2}, {x: 0, y: -2}, {x: 1, y: -2},
                        {x: -2, y: -1}, {x: -1, y: -1}, {x: 0, y: -1}, {x: 1, y: -1}, {x: 2, y: -1},
        {x: -3, y:  0}, {x: -2, y:  0}, {x: -1, y:  0}, {x: 0, y:  0}, {x: 1, y:  0}, {x: 2, y:  0}, {x: 3, y:  0},
                        {x: -2, y:  1}, {x: -1, y:  1}, {x: 0, y:  1}, {x: 1, y:  1}, {x: 2, y:  1},
                                        {x: -1, y:  2}, {x: 0, y:  2}, {x: 1, y:  2},
                                                        {x: 0, y:  3},
      ]
      for (let move of moves) {
        const pointer = {
          x: this.startPoint.x + move.x,
          y: this.startPoint.y + move.y,
        }
        this._captureDrawingPath(pointer)
      }
    }
    // + END
    this.oldEnd = undefined
    this._finalizeAndAddPath()
    return false
  }

  // スマホでのちらつき防止のためのオーバーライド
  _finalizeAndAddPath() {
    var ctx = this.canvas.contextTop
    ctx.closePath()
    if (this.decimate) {
      this._points = this.decimatePoints(this._points, this.decimate)
    }
    var pathData = this.convertPointsToSVGPath(this._points).join('')
    if (pathData === 'M 0 0 Q 0 0 0 0 L 0 0') {
      // do not create 0 width/height paths, as they are
      // rendered inconsistently across browsers
      // Firefox 4, for example, renders a dot,
      // whereas Chrome 10 renders nothing
      this.canvas.requestRenderAll()
      return
    }
    var path = this.createPath(pathData)
    // this.canvas.clearContext(this.canvas.contextTop);  // -
    setTimeout(() => this.canvas.clearContext(this.canvas.contextTop), 0) // +
    this.canvas.fire('before:path:created', { path: path })
    this.canvas.add(path)
    this.canvas.requestRenderAll()
    path.setCoords()
    this._resetShadow()
    // fire event 'path' created
    this.canvas.fire('path:created', { path: path })
  }
}

fabric.PencilBrush = MyPencilBrush

export default fabric
