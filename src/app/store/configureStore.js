import {createStore} from 'redux'
import rootReducer from '../reducer/index'

export default function configureStore(initialState) {
  const store = createStore(rootReducer, initialState)

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducer', () => {
      const nextReducer = rootReducer
      store.replaceReducer(nextReducer)
    })
  }
  return store
}
