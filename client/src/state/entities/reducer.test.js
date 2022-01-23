import { MERGE_ENTITIES } from './actions'
import reducer from './reducer'

describe('entities reducer', () => {

  it('returns inital state', () => {
    const state = reducer()
    expect(state).toEqual({})
  })

  it('has action MERGE_ENTITIES', () => {
    expect(MERGE_ENTITIES).toBeDefined()
  })

  it('merges entities from empty state', () => {
    const action = { type: MERGE_ENTITIES, payload: {
      fruits: {
        1: { id: 1, taste: 'apple' },
        2: { id: 2, taste: 'pear' },
        3: { id: 3, taste: 'banan' },
      }
    }}
    const state = reducer(undefined, action)
    expect(state).toEqual(action.payload)
  })

  it('skips undefined state', () => {
    const action = { type: MERGE_ENTITIES, payload: {
      fruits: undefined
    }}
    const state = reducer(undefined, action)
    expect(state).toEqual(action.payload)
  })

  it('merges entities with existing state', () => {
    const initalState = { people: { 1: { id: 1, name: 'john doe' } } }
    const action = { type: MERGE_ENTITIES, payload: {
      fruits: {
        1: { id: 1, taste: 'apple' },
        2: { id: 2, taste: 'pear' },
        3: { id: 3, taste: 'banan' },
      }
    }}
    const state = reducer(initalState, action)
    expect(state).toEqual({...initalState, ...action.payload})
  })

  it('merges entities by mergin record data', () => {
    const initalState = { fruits: { 1: { id: 1, taste: 'apple', inital: true } } }
    const action = { type: MERGE_ENTITIES, payload: { fruits: { 1: { id: 1, taste: 'pear' } } } }
    const state = reducer(initalState, action)
    expect(state.fruits['1'].taste).toEqual('pear')
    expect(state.fruits['1'].inital).toBeDefined()
    expect(state.fruits['1'].inital).toEqual(true)
  })

  it('merges multiple entities by mergin record data', () => {
    const initalState = {
      fruits: { 1: { id: 1, taste: 'apple', inital: true } },
      people: {
        1: { id: 1, name: 'john doe', inital: true },
        2: { id: 2, name: 'jane doe', inital: true },
      }
    }
    const action = { type: MERGE_ENTITIES, payload: {
      fruits: { 1: { id: 1, taste: 'pear' } },
      people: { 2: { id: 2, name: 'jenny doe' } },
      } }
    const state = reducer(initalState, action)
    expect(state.fruits['1'].taste).toEqual('pear')
    expect(state.fruits['1'].inital).toEqual(true)
    expect(state.people['1'].name).toEqual('john doe')
    expect(state.people['1'].inital).toEqual(true)
    expect(state.people['2'].name).toEqual('jenny doe')
    expect(state.people['2'].inital).toEqual(true)
  })

})
