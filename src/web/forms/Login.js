import React, {Component, PropTypes} from 'react'
import {FormattedMessage} from 'react-intl'
import {reduxForm} from 'redux-form'
import {Link} from 'react-router'

import {CardTitle, CardText, CardActions} from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'

import TextField from './fields/Text'

import styles from '../styles'
import routes from '../routes'

import validator, {focus} from '../../common/utils/formValidator'

import submitLogin from '../../common/actions/submitLogin'

class LoginForm extends Component {

  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit(event) {
    this.props.handleSubmit(submitLogin.bind(null, this.props.destination))(event)
      .catch((errors) => focus(errors, this.refs))
  }

  render() {
    const {fields: {email, password}, error, submitting} = this.props
    const subtitle = this.props.invite.email && <FormattedMessage id="login_to_join" values={{inviter: this.props.invite.inviter, tribe: this.props.invite.tribe}} />

    return (
      <form onSubmit={this.handleSubmit}>
        <CardTitle subtitle={subtitle} />
        <CardText>
          <TextField ref="email"
            type="email"
            required={true}
            {...email}
          />
          <TextField ref="password"
            type="password"
            required={true}
            {...password}
            name="login_password"
          />
          <p style={{textAlign: 'right', marginBottom: 0}}>
            <Link to={routes.PASSWORD}><FormattedMessage id="password_lost" /></Link>
          </p>
        </CardText>
        <CardActions style={styles.actions}>
          <RaisedButton label={<FormattedMessage id="submit.login" />} type="submit" disabled={submitting} />
          <p className="error">
            {error && <FormattedMessage id="error.other" />}
          </p>
          <p style={{marginTop: '2em'}}>
            <FormattedMessage id="no_account" /> <Link to={routes.REGISTER}><FormattedMessage id="register_now" /></Link>
          </p>
        </CardActions>
      </form>
    )
  }
}

LoginForm.propTypes = {
  // from redux-form:
  fields: PropTypes.object,
  error: PropTypes.string,
  handleSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  // from redux:
  destination: PropTypes.string, // next route after login (when trying to directly access a page when anonymous)
  invite: PropTypes.object.isRequired,
  initialValues: PropTypes.object,
}

const mapStateToProps = (state) => ({
  destination: state.login.destination,
  invite: state.join.data,
  initialValues: {
    email: state.join.data.email, // email is null when not coming from /join
  },
})

export default reduxForm({
  form: 'login',
  fields: ['email', 'password'],
  returnRejectedSubmitPromise: true,
  validate: validator.login,
  touchOnBlur: false,
}, mapStateToProps)(LoginForm)