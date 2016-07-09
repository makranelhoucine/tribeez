import md5 from 'md5'

import {auth, db, timestamp} from '../firebase'
import platform from '../platform'
import asyncStorage from '../utils/asyncStorage'
import {rand} from '../utils/utils'
import {login} from './app'
import routes from '../routes'

import {FIREBASE_FAILURE} from '../constants/actions'

export default (tribe_name, values, dispatch) => {
  return new Promise((resolve, reject) => {
    auth.createUserWithEmailAndPassword(values.email, values.password)
    .then((user) => {
      const uid = user.uid
      const gravatar = md5(uid)
      const updates = {}
      let historyKey

      const user_record = {
        current_tribe: values.tribe,
        email: user.email,
        gravatar,
        lang: values.lang,
        name: values.name,
        tribes: {
          [values.tribe]: tribe_name,
        },
      }
      if (values.birthdate) {
        user_record.birthdate = values.birthdate
      }
      if (values.phone) {
        user_record.phone = values.phone
      }
      updates['users/' + uid] = user_record

      // membership
      updates['tribes/' + values.tribe + '/members/' + uid] = {
        balance: 0,
        gravatar,
        name: values.name,
        invite: values.token,
      }

      // private user infos
      updates['users_private/' + uid] = {
        bot_token: rand(32),
      }

      db.ref().update(updates)
      .then(() => {
        // add history entry
        historyKey = db.ref('tribes/' + values.tribe + '/history').push().key
        return db.ref('tribes/' + values.tribe + '/history/' + historyKey).set({
          action: 'new',
          type: 'member',
          added: timestamp,
          user: uid,
          // TODO: inviter
        })
      })
      .then(() => {
        // add history key as member's "last_viewed_history_key"
        return db.ref('tribes/' + values.tribe + '/members/' + uid + '/last_viewed_history_key').set(historyKey)
      })
      .then(() => {
        // remove invitation
        return db.ref('tribes/' + values.tribe + '/invites/' + values.token).remove()
      })
      .then(() => {
        if (platform !== 'web') {
          asyncStorage.setItem('credentials', JSON.stringify({email: values.email, password: values.password}))
          .catch(() => {
            // console.error('LOCAL STORAGE SET ERROR', error)
          })
        }
        resolve()
        dispatch(login(user))
      })
      .catch((error) => {
        reject({_error: 'request'})
        dispatch({
          type: FIREBASE_FAILURE,
          origin: 'submitJoin',
          error,
        })
        auth.signOut()
      })
    })
    .catch((error) => {
      switch (error.code) {
        case 'auth/email-already-in-use':
          reject({email: 'exists'})
          break
        case 'auth/invalid-email':
          reject({email: 'invalid'})
          break
        case 'auth/weak-password':
          reject({password: 'weak'})
          break
        default:
          reject({_error: 'request'})
          dispatch({
            type: FIREBASE_FAILURE,
            origin: 'submitJoin',
            error,
          })
      }
    })
  })
}
