export function changeType(drawType) {
  return {type: 'CHANGE_TYPE', drawType}
}

export function addPoint(data) {
  return {type: 'ADD_POINT', data};
}

export function changeCurrentId(currentId) {
  return {type: 'CHANGE_CURRENT_ID', currentId};
}

export function moveContainer(data) {
  return {type: 'MOVE_CONTAINER', data};
}

export function removePoint(uid) {
  return {type: 'REMOVE_POINT', uid};
}

export function preventEvent(bool) {
  return {type: 'PREVENT_EVENT', bool};
}

export function preventDrag(bool) {
  return {type: 'PREVENT_DRAG', bool};
}

export function operateCtrl(ctrl) {
  return {type: 'OPERATE_CTRL', ctrl}
}

export function initCtrl(ctrls) {
  return {type: 'INIT_CTRL', ctrls}
}

export function initPoint(points) {
  return {type: 'INIT_POINT', points}
}

export function init(fetchState) {
  return {type: 'Init', fetchState}
}

export function fetch(data) {
  return {type: 'Fetch', data}
}
