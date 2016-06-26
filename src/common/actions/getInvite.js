import router from '../router'
import routes from '../routes'

import api from '../utils/api'

import {
  GET_INVITE_REQUEST,
  GET_INVITE_SUCCESS,
  GET_INVITE_FAILURE,
} from '../constants/actions'

export default (token) => {
  return function(dispatch) {
    dispatch({
      type: GET_INVITE_REQUEST,
    })
    api.get('invite', {token})
      .then((response) => {
        if (response.error) {
          dispatch({
            type: GET_INVITE_FAILURE,
          })
          router.resetTo(routes.LOGIN, dispatch)
        } else {
          dispatch({
            type: GET_INVITE_SUCCESS,
            data: response,
          })
          if (response.redirect === 'login') {
            router.resetTo(routes.LOGIN, dispatch)
          } else if (response.redirect === 'home') {
            router.resetTo(routes.ACTIVITY, dispatch)
          }
        }
      })
      .catch((err) => {
        dispatch({
          type: GET_INVITE_FAILURE,
          error: 'request',
          fetchError: err.message,
        })
        router.resetTo(routes.LOGIN, dispatch)
      })
  }
}
