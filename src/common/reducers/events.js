import {
  GET_EVENTS_REQUEST,
  GET_EVENTS_SUCCESS,
  GET_EVENTS_FAILURE,
  GET_EVENT_REQUEST,
  GET_EVENT_SUCCESS,
  GET_EVENT_FAILURE,
  NEW_EVENT,
  UPDATE_EVENT,
  DELETE_EVENT,
  SWITCH_SUCCESS,
  LOGOUT_SUCCESS,
} from '../constants/actions'

const initialState = {
  loading: false,
  error: null,
  items: [],
  pages: 0,
  current: null, // current event being viewed or edited
}

export default (state = initialState, action = null) => {
  switch (action.type) {
    case GET_EVENTS_REQUEST:
    case GET_EVENT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      }
    case GET_EVENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        items: action.page ? [...state.items, ...action.data.items] : action.data.items,
        pages: action.page + 1,
      }
    case GET_EVENT_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        current: action.data,
      }
    case GET_EVENTS_FAILURE:
    case GET_EVENT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error,
      }

    // from socket.io:
    case NEW_EVENT: {
      const items = [action.data, ...state.items]
      return {
        ...state,
        items,
      }
    }
    case UPDATE_EVENT: {
      const items = state.items.map((event) => {
        if (event.id === action.data.id) {
          return {...event, ...action.data}
        }
        return event
      })
      return {
        ...state,
        items,
      }
    }
    case DELETE_EVENT: {
      const items = state.items.filter((event) => event.id !== action.data.id)
      return {
        ...state,
        items,
      }
    }

    case SWITCH_SUCCESS:
    case LOGOUT_SUCCESS:
      return {...initialState}
    default:
      return state
  }
}
