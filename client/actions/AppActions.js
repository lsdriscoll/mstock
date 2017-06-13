import { some, isUndefined, isNull } from 'lodash'
import { isWebUri } from 'valid-url'
import { APP_INITIALIZE, APP_SET_API_ROOT } from '../constants/ActionTypes'
import { sync } from '../actions/SyncActions'
import { login } from '../actions/SessionActions'
import { validate, invalidate } from '../actions/ValidationActions'
import { callApi } from '../actions/NetworkActions'

const requiredConfigs = [
  'apiRoot'
]

function initialize() {
  return {
    type: APP_INITIALIZE
  }
}

export function _setApiRoot(apiRoot) {
  return {
    type: APP_SET_API_ROOT,
    apiRoot
  }
}

function checkInitialised(state) {
  return !some(requiredConfigs, config => (
    isUndefined(state.app[config]) || isNull(state.app[config])
  ))
}

export function testAPIRoot(url) {
  return (dispatch, getState) => {
    return dispatch(callApi({
      service: '',
      method: 'head',
      success: () => true,
      error: error => false
    }))
  }
}

/**
 * Validation is the responsibilty of the input mechanism
 */
export function setApiRoot(apiRoot) {
  return async (dispatch, getState) => {
    const fieldID = 'apiRoot'
    const error = 'Invalid URI'

    if (dispatch(validate({
      fieldID,
      value: apiRoot,
      validation: url => isWebUri(url),
      error
    }))) {
      dispatch(_setApiRoot(apiRoot))

      if (checkInitialised(getState())) {
        await dispatch(login('apiuser', 'api.123'))
        await dispatch(sync())
        return dispatch(initialize())
      }
    }
  }
}
