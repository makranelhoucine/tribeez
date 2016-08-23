import {reportIssue} from '../error-report'

import {
  FAILURE,
} from '../constants/actions'

export default (error, origin, type = 'firebase') => {
  return (dispatch) => {
    if (__DEV__) {
      console.error(type + ' error from ' + origin + ':', error) // eslint-disable-line no-console
    }

    reportIssue(error, type + '::' + origin)

    dispatch({
      type: FAILURE,
      error: (error.code || error.message || error.toString()), //TODO: improve
    })
  }
}
