import mitt from "mitt"

let all = {}
let emitter = mitt()

emitter.reset = () => {
  for (let i in all) delete all[i]
}

let off = emitter.off

emitter.off = (type, handler) =>{
  if (!handler) delete all[type]
  else return off(type, handler)
}

export default emitter
