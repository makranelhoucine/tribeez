import { GET_USER_REQUEST, GET_USER_SUCCESS, GET_USER_FAILURE } from '../actions'

const initialState = {
  loading: false,
  data: {},
  error: false,
}

export default (state = initialState, action = null) => {
  switch (action.type) {
    case GET_USER_REQUEST:
      return Object.assign({}, initialState, {
        loading: true,
      })
    case GET_USER_SUCCESS:
      return Object.assign({}, initialState, {
        data: action.data,
      })
    case GET_USER_FAILURE:
      return Object.assign({}, initialState, {
        error: true,
      })
    default:
      return state
  }
}
