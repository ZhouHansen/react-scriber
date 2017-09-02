import _ from 'lodash'
import emitter from '../emitter'
const createjs = window.createjs

export function drawLine({oldOne, newOne, fetchctrls}){
  const {ctrls} = this.props

  let line = new createjs.Shape()
  let eatime = 0
  let uids = [oldOne.uid, newOne.uid]

  if (!fetchctrls){
    drawCurve(line.graphics, ctrls, oldOne, newOne)
  } else {
    // for fetch
    drawCurve(line.graphics, fetchctrls, oldOne, newOne)
  }

  emitter.on('removePoint', (uid) => {
    if (!_.includes(uids, uid)) return

    this.container.removeChild(line)

    this.stage.update()
  })

  emitter.on('moveCtrl', (ctrl) => {

    if (!_.includes(uids, ctrl.uid)) return

    if (ctrl.isMirror === false && uids[0] !== ctrl.uid) return

    const {ctrls} = this.props

    if (eatime === 0){
      line.graphics.clear()
      eatime++
    }

    eatime--

    drawCurve(line.graphics, ctrls, oldOne, newOne)

    this.stage.update()
  })

  emitter.on('removeCtrl', ({ctrl, ctrls}) => {
    if (!_.includes(uids, ctrl.uid)) return

    line.graphics.clear()

    drawCurve(line.graphics, ctrls, oldOne, newOne)

    this.stage.update()
  })

  this.container.addChildAt(line, 0)
  this.stage.update()
}

function drawCurve(g, ctrls, oldOne, newOne){
  var oldCtrl = _.filter(ctrls, ctrl => ctrl.uid === oldOne.uid && !ctrl.isRemove)[0]
    , newCtrl = _.filter(ctrls, ctrl => ctrl.uid === newOne.uid && !ctrl.isRemove)[0]
    , {x, y} = oldOne

  g.setStrokeStyle(1)
   .beginStroke("#000")
   .moveTo(newOne.x, newOne.y)

  if (oldCtrl !== void 0 && newCtrl === void 0){
    g.quadraticCurveTo(oldCtrl.x, oldCtrl.y, x, y)
  } else if (oldCtrl === void 0 && newCtrl !== void 0){
    g.quadraticCurveTo(newCtrl.x, newCtrl.y, x, y)
  } else if (oldCtrl !== void 0 && newCtrl !== void 0){
    g.bezierCurveTo(newCtrl.x, newCtrl.y, oldCtrl.x, oldCtrl.y, x, y)
  } else {
    g.lineTo(x, y)
  }
}
