import _ from 'lodash'

const initialState = {
  drawType: "line",
  points: [],
  currentId: '',
  container: {
    x:0,
    y:0
  },
  isPreventEvent: false,
  isPreventDrag: false,
  ctrls:[]
}

export default function draw(state = initialState, action) {
  switch (action.type) {
    case 'CHANGE_TYPE':
      return {...state, drawType: action.drawType}
    case 'ADD_POINT':
      return {...state, points: [...state.points, action.data]}
    case 'CHANGE_CURRENT_ID':
      return {...state, currentId: action.currentId}
    case 'MOVE_CONTAINER':
      return {...state, container: action.data}
    case 'REMOVE_POINT':
      return {...state, points: _.reject(state.points, {uid: action.uid})}
    case 'PREVENT_EVENT':
      return {...state, isPreventEvent: action.bool}
    case 'PREVENT_DRAG':
      return {...state, isPreventDrag: action.bool}
    case 'OPERATE_CTRL':
      var ctrl = _.find(state.ctrls, {uid: action.ctrl.uid})

      if (ctrl === void 0){
        state.ctrls.push({...action.ctrl, isNew:true})
      } else {
        state.ctrls = _.map(state.ctrls, c =>{
          if (c.uid === action.ctrl.uid){
            return action.ctrl
          }
          return c
        })
      }

      return {...state, ctrls: state.ctrls}
    case 'INIT_CTRL':
      return {...state, ctrls: action.ctrls}
    case 'INIT_POINT':
      return {...state, points: action.points}
    case 'Init':
      return action.fetchState
    case 'Fetch':
      return action.data
    default:
      return state
  }
}
