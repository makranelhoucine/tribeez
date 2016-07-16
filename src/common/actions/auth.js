import router from '../router'
import routes from '../routes'

import {auth} from '../firebase'

import {
  LOGGED_IN,
  LOGGED_OUT,
  LOGIN_DESTINATION,
} from '../constants/actions'

import getMember from './getMember'
import getUnread from './getUnread'

export const login = (user) => {
  return (dispatch, getState) => {
    dispatch({
      type: LOGGED_IN,
      user,
    })

    dispatch(getMember.on(user.uid))
    // the subscription to getUnread.on is done once we have the tribe ID

    const destination = getState().login.destination || routes.ACTIVITY
    router.resetTo(destination, dispatch)

    const stop = auth.onAuthStateChanged((connectedUser) => {
      if (!connectedUser) {
        dispatch(logout())
        stop()
      }
    })
  }
}

export const logout = () => {
  return (dispatch) => {
    // too late => should be done in postLogout:
    dispatch(getMember.off())
    dispatch(getUnread.off())
    // these two listeners will raise an error if user is logged out by firebase

    dispatch({
      type: LOGGED_OUT,
    })
    router.resetTo(routes.WELCOME, dispatch)
  }
}

export const setDestination = (destination) => {
  return (dispatch) => {
    dispatch({
      type: LOGIN_DESTINATION,
      destination,
    })
  }
}