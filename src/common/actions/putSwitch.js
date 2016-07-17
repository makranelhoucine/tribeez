import {auth, db} from '../firebase'

import {
  FIREBASE_REQUEST,
  FIREBASE_SUCCESS,
  SNACK_MESSAGE,
} from '../constants/actions'

import router from '../router'
import routes from '../routes'

import getMember from './getMember'
import {firebaseError} from './error'

export default (tid) => {
  return (dispatch) => {
    const uid = auth.currentUser.uid

    dispatch({
      type: FIREBASE_REQUEST,
    })
    db.ref('users/' + uid + '/current_tribe').set(tid)
    .then(() => {
      dispatch(getMember.off())
      router.resetTo(routes.ACTIVITY, dispatch)
      dispatch(getMember.on(uid))
      dispatch({
        type: SNACK_MESSAGE,
        message: 'switched',
      })
      dispatch({
        type: FIREBASE_SUCCESS,
      })
    })
    .catch((error) => {
      dispatch(firebaseError(error, 'putSwitch'))
    })
  }
}
