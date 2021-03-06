import test from 'ava'
import { receiveLogout } from '../../../client/actions/SessionActions'
import { RECEIVE_LOGOUT } from '../../../client/constants/ActionTypes'

test('create an action to start a session', t => {
  const actualAction = receiveLogout()

  t.is(actualAction.type, RECEIVE_LOGOUT)
  t.is(typeof actualAction.receivedAt, 'number')
})
