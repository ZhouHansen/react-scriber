import * as decorator from './decorator'
import {drawCtrl} from './ctrl'
import emitter from '../emitter'
const createjs = window.createjs

export function drawPoint({x, y, uid}, currentId){
  const {changeCurrentId} = this.props

  var point = new createjs.Shape()

  point.graphics.setStrokeStyle(1)
                .beginStroke("#000000")
                .beginFill("#fff")
                .drawCircle(0, 0, 3)
  // for fetch
  if (currentId === uid){
    point.graphics.beginFill("#000").drawCircle(0, 0, 3)
  }

  point.x = x
  point.y = y
  point.uid = uid
  decorator.movable.bind(this)(point)
  decorator.cursurable.bind(this)(point)
  decorator.removable.bind(this)(point)
  decorator.ctrlable.bind(this)(point)
  decorator.draggable.bind(this)(point)

  emitter.on('changeCurrentId', ({last, next}) => {
    if (point.uid !== last && point.uid !== next) return

    if (point.uid === last){
      point.graphics.beginFill("#fff").drawCircle(0, 0, 3)
    }

    if (point.uid === next){
      point.graphics.beginFill("#000").drawCircle(0, 0, 3)
    }

    this.stage.update()
  })

  emitter.on('removePoint', uid => {
    if (point.uid !== uid) return

    const {operateCtrl} = this.props

    operateCtrl({uid: uid, isRemove: true})
    this.container.removeChild(point)

    this.stage.update()
  })

  emitter.on('createCtrl', ctrl => {
    if (point.uid !== ctrl.uid &&!ctrl.pointx) return
    var pointx
      , pointy

    if (!ctrl.pointx){
      pointx = x
      pointy = y
    } else {
      pointx = ctrl.pointx
      pointy = ctrl.pointy
    }

    drawCtrl.bind(this)({...ctrl, pointx, pointy, isMirror: true})
    drawCtrl.bind(this)({...ctrl, pointx, pointy, isMirror: false})
  })

  // for fetch
  if (!currentId){
    changeCurrentId(point.uid)
  }

  this.container.addChild(point)

  this.stage.update()
}
