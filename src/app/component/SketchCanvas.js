import React, {Component} from 'react'
import $ from 'jquery'
import _ from 'lodash'
import PropTypes from 'prop-types'
import {drawPoint} from '../canvasapi/point'
import {drawCtrl} from '../canvasapi/ctrl'
import {drawLine} from '../canvasapi/line'
import emitter from '../emitter'
import '../style/SketchCanvas.css'

const createjs = window.createjs

class SketchCanvas extends Component {

  constructor(props) {
    super(props)
    this.drawPoint = drawPoint.bind(this)
    this.drawCtrl = drawCtrl.bind(this)
    this.drawLine = drawLine.bind(this)
    this.handleMousedown = this.handleMousedown.bind(this)
    this.handleMousemove = this.handleMousemove.bind(this)
    this.handleMouseup = this.handleMouseup.bind(this)
    this.countId = 0
  }

  unique(prefix){
    var id = ++this.countId + '';
    return prefix ? prefix + id : id;
  }

  save(){
    emitter.on('save', ()=>{
      localStorage.setItem("react_sketch_data", JSON.stringify(this.context.store.getState().draw))
    })

    return this
  }

  fetch(){
    emitter.on('fetch', ()=>{
      const { init } = this.props

      // 清除所有订阅者，释放内存
      emitter.reset()

      // 重新订阅fetch和save
      this.save().fetch()

      this.container.removeAllChildren()

      this.stage.update()

      var data = JSON.parse(localStorage.getItem("react_sketch_data"))

      this.isFetch = true

      init(data)

      this.init(data)
    })
  }

  init(data){
    $('#' + data.drawType).focus()

    this.watchContainer({x: data.container.x, y: data.container.y})
    this.countId = 0

    var l = data.points.length

    while (l--){
      var uid = data.points[l].uid
        , pointx = data.points[l].x
        , pointy = data.points[l].y

      this.unique('p_')
      this.drawPoint(data.points[l], data.currentId)
      this.drawCtrl({uid, pointx, pointy, isMirror: true})
      this.drawCtrl({uid, pointx, pointy, isMirror: false})
    }

    l = data.ctrls.length

    while (l--){
      emitter.emit('moveCtrl', {...data.ctrls[l], currentId: data.currentId})
    }

    l = data.points.length

    for (var i=0;i<l-1;i++){
      var oldOne = data.points[i]
        , newOne = data.points[i+1]

      this.drawLine({oldOne, newOne, fetchctrls: data.ctrls})
    }
  }

  componentDidMount() {
    this.stage = new createjs.Stage("canvas")
    this.container = new createjs.Container()
    this.stage.enableMouseOver()
    this.stage.addChild(this.container)
    this.stage.update()
    this.save().fetch()
  }

  render() {
    return (
      <div className="canvaswrap">
        <canvas
          width="1050"
          height="1000"
          id="canvas"
          onMouseDown={this.handleMousedown}
          onMouseMove={this.handleMousemove}
          onMouseUp={this.handleMouseup}>
        </canvas>
      </div>
    )
  }

  handleMousedown(e){
    const {addPoint, drawType, container, isPreventEvent, preventEvent} = this.props

    if (isPreventEvent){
      e.preventDefault()
      preventEvent(false)
      return
    }

    if (drawType !== 'line'){
      return
    }

    var x = e.pageX - $(e.target).offset().left - container.x
      , y = e.pageY - $(e.target).offset().top - container.y
      , uid = this.unique('p_')

    addPoint({x, y, uid})

    this.isMouseDown = true
  }

  handleMousemove(e){
    const {drawType, container, currentId, operateCtrl} = this.props

    if (this.isMouseDown && (drawType === 'line' || drawType === 'ctrlline')){
      var x = e.pageX - $(e.target).offset().left - container.x
        , y = e.pageY - $(e.target).offset().top - container.y

      operateCtrl({uid: currentId, x, y, isMirror: true})
    }
  }

  handleMouseup(){
    const {preventDrag} = this.props

    preventDrag(false)
    this.isMouseDown = false
  }

  // A solution for data watcher.
  componentWillReceiveProps(nextProp){
    if (this.isFetch){
      this.isFetch = false
      return
    }

    var last
      , next

    if (this.props.points !== nextProp.points){
      last = this.props.points
      next = nextProp.points

      this.watchPoints({last, next})
    }

    if (this.props.currentId !== nextProp.currentId){
      last = this.props.currentId
      next = nextProp.currentId

      this.watchCurrentId({last, next})
    }

    if (this.props.container !== nextProp.container){
      var x = nextProp.container.x
        , y = nextProp.container.y

      this.watchContainer({x, y})
    }

    if (this.props.ctrls !== nextProp.ctrls){

      var ctrl = _.without(this.props.ctrls, ...nextProp.ctrls)[0]
        , nextctrl = _.without(nextProp.ctrls, ...this.props.ctrls)[0]

      if (nextctrl.isRemove){
        emitter.emit('removeCtrl', {ctrl: nextctrl, ctrls: nextProp.ctrls})
      } else if(ctrl){
        if (ctrl.isNew){
          emitter.emit('createCtrl', ctrl)
        } else {
          emitter.emit('moveCtrl', ctrl)
        }
      }
    }
  }

  watchPoints({last, next}){
    const {changeCurrentId} = this.props
    var newOne
      , oldOne
    // add points
    if (last.length < next.length){
      newOne = _.without(next, ...last)[0]
      oldOne = last[last.length - 1]

      this.drawPoint(newOne)

      if (oldOne !== void 0){
        this.drawLine({oldOne, newOne})
      }
    }
    else if (last.length > next.length){
      var removeOne = _.without(last, ...next)[0]
        , index = _.indexOf(last, removeOne)
        , lastOne = next[next.length - 1]

      oldOne = last[index - 1]
      newOne = last[index + 1]

      if (lastOne !== void 0){
        changeCurrentId(lastOne.uid)
      } else {
        changeCurrentId("")
      }

      emitter.emit('removePoint', removeOne.uid)

      if (oldOne !== void 0 && newOne !== void 0){
        this.drawLine({oldOne, newOne})
      }
    }
  }

  watchCurrentId({last, next}){
    emitter.emit('changeCurrentId', {last, next})
  }

  watchContainer({x, y}){
    this.container.set({x, y})
    this.stage.update()
  }
}

SketchCanvas.contextTypes = {
  store: PropTypes.object.isRequired
}

SketchCanvas.propTypes = {
  drawType: PropTypes.string.isRequired,
  points: PropTypes.array.isRequired,
  currentId: PropTypes.string.isRequired,
  container: PropTypes.object.isRequired,
  isPreventEvent: PropTypes.bool.isRequired,
  isPreventDrag: PropTypes.bool.isRequired,
  ctrls: PropTypes.array.isRequired,
}

export default SketchCanvas
