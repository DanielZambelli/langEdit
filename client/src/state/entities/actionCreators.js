import Api from '../../utils/api'
import store from '../store'
import { MERGE_ENTITIES, REMOVE_ENTITIES } from './actions'

export const mergeEntities = (payload) => ({ type: MERGE_ENTITIES, payload })

export const removeEntities = (payload) => ({ type: REMOVE_ENTITIES, payload })

export const saveEntities = async (payload) => {
  if(payload.projects) payload.projects = await Promise.all(payload.projects.map(p => Api.saveProject(p)))
  store.dispatch(mergeEntities(payload))
  return payload
}

export const getEntities = async (payload) => {
  if(payload.projects) payload.projects = await Api.getProjects()
  store.dispatch(mergeEntities(payload))
  return payload
}
