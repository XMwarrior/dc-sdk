/**
 * @Author: Caven
 * @Date: 2020-11-09 20:04:30
 */

import { Cesium } from '@dc-modules/namespace'
import State from '@dc-modules/state/State'
import Parse from '@dc-modules/parse/Parse'
import { Transform } from '@dc-modules/transform'
import Overlay from '../Overlay'

class VideoPrimitive extends Overlay {
  constructor(positions, video) {
    super()
    this._positions = Parse.parsePositions(positions)
    this._delegate = new Cesium.GroundPrimitive({
      geometryInstances: new Cesium.GeometryInstance({
        geometry: {}
      })
    })
    this._video = video
    this.type = Overlay.getOverlayType('video_primitive')
    this._state = State.INITIALIZED
  }

  set positions(positions) {
    this._positions = Parse.parsePositions(positions)
    this._delegate.geometryInstances.geometry = Cesium.PolygonGeometry.fromPositions(
      {
        positions: Transform.transformWGS84ArrayToCartesianArray(
          this._positions
        ),
        height: this._style?.height,
        extrudedHeight: this._style?.extrudedHeight,
        closeTop: this._style?.closeTop,
        closeBottom: this._style?.closeBottom,
        vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT
      }
    )
    return this
  }

  get positions() {
    return this._positions
  }

  set video(video) {
    this._video = video
    this._setAppearance()
    return this
  }

  get video() {
    return this._video
  }

  /**
   *
   * @private
   */
  _setAppearance() {
    this._delegate.appearance = new Cesium.EllipsoidSurfaceAppearance({
      material: Cesium.Material.fromType('Image', {
        image: this._video
      })
    })
  }

  _mountedHook() {
    /**
     *  set the positions
     */
    this.positions = this._positions

    /**
     * initialize the Overlay parameter
     */
    this.video = this._video
  }

  /**
   * Sets Style
   * @param style
   * @returns {VideoPrimitive}
   */
  setStyle(style) {
    if (Object.keys(style).length === 0) {
      return this
    }
    this._style = style
    if (this._style?.classificationType) {
      this._delegate.classificationType = this._style.classificationType
    }
    return this
  }
}

Overlay.registerType('video_primitive')

export default VideoPrimitive
