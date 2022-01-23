import { createStore, combineReducers } from 'redux'
import entities from './entities/reducer'
import globalState from './globalState/reducer'

const store = createStore(combineReducers({
  entities,
  globalState
}))

export default store
