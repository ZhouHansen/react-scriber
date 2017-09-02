import { connect } from 'react-redux'
import * as action from '../action'
import SketchCanvas from '../component/SketchCanvas'

const mapStateToProps = (state) => {
  return {
    drawType: state.draw.drawType,
    points: state.draw.points,
    currentId: state.draw.currentId,
    container: state.draw.container,
    isPreventEvent: state.draw.isPreventEvent,
    isPreventDrag: state.draw.isPreventDrag,
    ctrls: state.draw.ctrls
  }
}

const mapDispatchToProps = (dispatch) => {
  class Dispatchs {
    constructor(){
      [ 'addPoint',
        'changeType',
        'changeCurrentId',
        'moveContainer',
        'removePoint',
        'preventEvent',
        'preventDrag',
        'operateCtrl',
        'initCtrl',
        'initPoint',
        'fetch',
        'init',
      ].forEach((name) => {
        this[name] = (data) => {
          dispatch(action[name](data))
        }
      })
    }
  }
  // Must return a plain object. Instead received [object Object].
  return Object.assign({}, new Dispatchs())
}

const DrawSketchCanvas = connect(
  mapStateToProps,
  mapDispatchToProps
)(SketchCanvas)

export default DrawSketchCanvas
