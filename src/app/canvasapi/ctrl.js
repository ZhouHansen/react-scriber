import * as decorator from './decorator'
import emitter from '../emitter'
const createjs = window.createjs

export function drawCtrl({uid, pointx, pointy, isMirror}){
  let square = new createjs.Shape()
  let line = new createjs.Shape()
  let cuid = uid
  let eatime = 0

  square.graphics
        .setStrokeStyle(1)
        .beginStroke("#f46c51")
        .beginFill("#f46c51")
        .drawRect(-2, -2, 4, 4)

  square.uid = cuid
  line.uid = cuid

  square.isMirror = isMirror
  line.isMirror = isMirror

  this.container.addChild(square)
  this.container.addChildAt(line, 0)
  decorator.ctrlRemovable.bind(this)(square)

  emitter.on('moveCtrl', ({x, y, uid, isMirror, currentId}) =>{
    moveCtrl.bind(this)({square: square, line: line, eatime: eatime, x, y, uid, isMirror, cuid, pointx, pointy, currentId})
  })

  emitter.on('changeCurrentId', ({last, next}) =>{
    changeCurrentId.bind(this)({last, next, cuid, line: line, square: square})
  })

  emitter.on('removeCtrl', ({ctrl, ctrls}) =>{
    removeCtrl.bind(this)({ctrl, ctrls, cuid, square: square, line: line})
  })
}

function moveCtrl({square, line, x, y, uid, isMirror, cuid, pointx, pointy, eatime, currentId}){
  if (cuid !== uid) return

  square.graphics
        .setStrokeStyle(1)
        .beginStroke("#f46c51")
        .beginFill("#f46c51")
        .drawRect(-2, -2, 4, 4)
  console.log(pointx, cuid, currentId)
  square.x = x
  square.y = y

  if (square.isMirror&& isMirror){
    square.x = 2 * pointx - x
    square.y = 2 * pointy - y
  }

  if (eatime === 0){
    line.graphics.clear()
    eatime++
  }

  eatime--

  line.graphics
      .setStrokeStyle(1)
      .beginStroke("#f46c51")
      .moveTo(x, y)
      .lineTo(pointx, pointy)

  line.from = {x, y}
  line.to = {x:pointx, y:pointy}


  if (line.isMirror&& isMirror){
    line.graphics
        .moveTo(pointx, pointy)
        .lineTo(2 * pointx - x, 2 * pointy - y)

    line.from = {x, y}
    line.to = {x:2 * pointx - x, y:2 * pointy - y}
  }

  // for fetch
  if (currentId && currentId !== uid){
    square.graphics.clear()
    line.graphics.clear()
  }

  this.stage.update()
}

function changeCurrentId({last, next, cuid, line, square}){
  if (cuid !== last && cuid !== next) return

  if (cuid === last){
    square.graphics.clear()
    line.graphics.clear()
  }
  else if (cuid === next){
    square.graphics
        .setStrokeStyle(1)
        .beginStroke("#f46c51")
        .beginFill("#f46c51")
        .drawRect(-2, -2, 4, 4)

    line.graphics
        .setStrokeStyle(1)
        .beginStroke("#f46c51")
        .moveTo(line.from.x, line.from.y)
        .lineTo(line.to.x, line.to.y)
  }
  this.stage.update()
}

function removeCtrl({ctrl, ctrls, cuid, square, line}){
  if (cuid !== ctrl.uid) return

  square.graphics.clear()
  line.graphics.clear()
  this.stage.update()
}
