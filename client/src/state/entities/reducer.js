import { MERGE_ENTITIES, REMOVE_ENTITIES } from './actions'

const initalState = {}

const reducer = (state = initalState, action = {}) => {

  const nextState = JSON.parse(JSON.stringify(state))

  switch(action.type){

    case MERGE_ENTITIES:
      for(const entity of Object.keys(action.payload)){
        // guard against undefined values
        if(action.payload[entity] === undefined) return nextState
        for(const record of Object.values(action.payload[entity])){

          // initialize entity
          if(!nextState[entity]) nextState[entity] = {}

          // initialize entity record
          if(!nextState[entity][record.id]) nextState[entity][record.id] = {}

          // merge entity record
          nextState[entity][record.id] = { ...nextState[entity][record.id], ...record }
        }
      }
      return nextState

    case REMOVE_ENTITIES:
      for(const entity of Object.keys(action.payload)){
        for(const record of Object.values(action.payload[entity])){
          delete nextState[entity][record.id]
        }
      }
      return state

    default:
      return state
  }
}

export default reducer
