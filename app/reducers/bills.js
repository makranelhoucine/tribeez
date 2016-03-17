import {
  GET_BILLS_REQUEST,
  GET_BILLS_SUCCESS,
  GET_BILLS_FAILURE,
  NEW_BILL_SUCCESS,
  LOGOUT_SUCCESS,
  DELETE_BILL_SUCCESS,
} from '../constants/actions'

const initialState = {
  loading: false,
  list: [],
  error: null,
  got: false, // true = we got the initial list through a request
}

export default (state = initialState, action = null) => {
  switch (action.type) {
    case GET_BILLS_REQUEST:
      return Object.assign({}, state, {
        loading: true,
        error: null,
      })
    case GET_BILLS_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        error: null,
        list: action.list,
        got: true,
      })
    case GET_BILLS_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        error: action.error,
      })
    case NEW_BILL_SUCCESS:
      if (state.list.length) {
        const list = [action.bill, ...state.list]
        return {...state, list}
      } else {
        return state
      }
    case DELETE_BILL_SUCCESS:
      const list = state.list.filter((bill) => bill.id !== action.id)
      return {...state, list}
    case LOGOUT_SUCCESS:
      return Object.assign({}, initialState)
    default:
      return state
  }
}
