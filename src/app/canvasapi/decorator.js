import $ from 'jquery'

export const movable = function(target) {
  const {moveContainer} = this.props

  target.on("pressmove", e => {
    const {drawType} = this.props

    if (drawType !== 'move'){
      return
    }

    var x = e.stageX - target.x
      , y = e.stageY - target.y

    moveContainer({x, y})
  })
}

export const cursurable = function(target) {
  target.on("mouseover", () => {
    const {drawType, currentId} = this.props

    if (drawType === 'move'){
      $("#canvas").addClass("move")
    }
    else if (drawType === 'remove'){
      $("#canvas").addClass("remove")
    }
    else if (drawType === 'line' && currentId !== target.uid) {
      $("#canvas").addClass("unable")
    }

    if (drawType === 'ctrlline' && currentId !== target.uid) {
      $("#canvas").addClass("ctrlline")
    }
  })

  target.on("mouseout", () => {
    $("#canvas").removeClass("remove unable ctrlline move")
  })
}

export const removable = function(target) {
  target.on("mousedown", ()=>{
    const {drawType, removePoint} = this.props

    if (drawType === 'remove'){
      removePoint(target.uid)
    }
  })
}

export const ctrlRemovable = function(target) {
  const {operateCtrl} = this.props

  target.on("mousedown", () => {
    const {drawType} = this.props

    if (drawType === 'remove'){
      operateCtrl({uid: target.uid, isRemove: true})
    }
  })

  target.on("mouseover", () => {
    const {drawType} = this.props

    if (drawType === 'remove'){
      $("#canvas").addClass("remove")
    }
  })

  target.on("mouseout", () => {
    $("#canvas").removeClass("remove")
  })
}

export const ctrlable = function(target) {
  const {preventEvent, preventDrag, changeCurrentId, operateCtrl} = this.props

  target.on("click", () => {
    const {drawType} = this.props

    preventEvent(true)

    if (drawType === 'ctrlline'){
      changeCurrentId(target.uid)
    }
  })

  target.on("pressmove", e => {
    const {currentId, drawType} = this.props

    preventEvent(true)

    if (target.uid === currentId && drawType === 'ctrlline') {
      var x = e.stageX - this.container.x
        , y = e.stageY - this.container.y
        , isMirror = true

      operateCtrl({uid: currentId, x, y, isMirror})
    }
  })

  target.on("pressup", () => {
    preventDrag(true)
  })
}

export const draggable = (()=>{
  var innerfunc = function({target, e}){
    const {preventEvent, currentId, drawType, container, operateCtrl} = this.props

    preventEvent(true)

    if (target.uid === currentId &&
      drawType === 'line') {
      var x = e.stageX - container.x
        , y = e.stageY - container.y
        , isMirror = false

      operateCtrl({uid: currentId, x, y, isMirror})
    }
  }

  return function(target){
    const {preventEvent, preventDrag} = this.props

    target.on("mousedown", (e) => {
      innerfunc.bind(this)({target, e})
    })

    target.on("pressmove", (e) => {
      innerfunc.bind(this)({target, e})
    })

    target.on("pressup", () => {
      preventEvent(false)
      preventDrag(true)
    })
  }
})()
