import { SET_GLOBAL_STATE } from './actions'

const reducer = (state = {}, action = {}) => {
  switch(action.type){
    case SET_GLOBAL_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}

export default reducer
