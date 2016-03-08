import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
import {FormattedMessage} from 'react-intl'
import {reduxForm} from 'redux-form'

import CardTitle from 'material-ui/lib/card/card-title'
import CardText from 'material-ui/lib/card/card-text'
import CardActions from 'material-ui/lib/card/card-actions'
import RaisedButton from 'material-ui/lib/raised-button'

import TextField from './fields/Text'

import styles from '../constants/styles'

import validator from '../utils/formValidator'

import submitPassword from '../actions/submitPassword'

class PasswordForm extends Component {

  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit(event) {
    this.props.handleSubmit(submitPassword)(event)
      .catch((errors) => {
        const field = Object.keys(errors)[0]
        if (field && field !== '_error') {
          ReactDOM.findDOMNode(this.refs[field].refs.input).focus()
        }
      })
  }

  render() {
    const {fields: {email}, error, submitting} = this.props

    return (
      <form onSubmit={this.handleSubmit}>
        <CardTitle subtitle="Fill this form to receive a reset link via email" />
        <CardText>
          <TextField ref="email"
            type="email"
            required={true}
            floatingLabelText="Email"
            errorText={email.touched && email.error && <FormattedMessage id="error.login.email" />}
            {...email}
          />
        </CardText>
        <CardActions style={styles.actions}>
          <RaisedButton label="Send request" type="submit" disabled={submitting} />
          <p className="error">
            {error && <FormattedMessage id="error.other" />}
          </p>
        </CardActions>
      </form>
    )
  }
}

PasswordForm.propTypes = {
  // from redux-form:
  fields: PropTypes.object,
  error: PropTypes.string,
  handleSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  // from redux state:
  initialValues: PropTypes.object,
}

const mapStateToProps = (state) => ({
  initialValues: {
    lang: state.app.lang,
  },
})

export default reduxForm({
  form: 'login',
  fields: ['email', 'lang'],
  returnRejectedSubmitPromise: true,
  validate: validator.password,
  touchOnBlur: false,
}, mapStateToProps)(PasswordForm)